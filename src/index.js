const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const prettier = require('prettier');
require('events').EventEmitter.defaultMaxListeners = 0;
const { parseJSX, parseStyle, parseTitle, parseDesc, parseIsDebug } = require('./parse');
const fetchAntDDemos = require('./fetchAntDDemos');
const { screenshot, openBrowser, closeBrowser } = require('./screenshot');

const blockTemplateDir = path.join(__dirname, '../assets/block-template');
const rootDir = path.join(__dirname, '..');
const continueFilePath = path.join(__dirname, '../continue.json');
const spinner = ora();
let historyList = [];
const DEBUG_COUNT = 0;

const modifyPackageInfo = async (blockDir, name, description) => {
  const pkgFilePath = path.join(blockDir, 'package.json');
  const pkg = require(pkgFilePath);
  const json = {
    ...pkg,
    name: `@umi-block/${name}`,
    description,
  };
  const jsonStr = prettier.format(JSON.stringify(json), { parser: 'json' });
  await fs.outputFile(pkgFilePath, jsonStr);
};

const generateBlock = async demoWithText => {
  const { name, text, width, height } = demoWithText;

  const blockDir = path.join(rootDir, name);

  try {
    await fs.remove(blockDir);
  } catch (err) {
    console.log(err);
  }

  try {
    await fs.ensureDir(blockDir);
  } catch (err) {
    console.log(err);
  }

  try {
    await fs.copy(`${blockTemplateDir}`, `${blockDir}`);
  } catch (err) {
    console.log(err);
  }

  const jsxText = parseJSX(text);
  const cssText = parseStyle(text);
  const indexTSXPath = path.join(blockDir, 'src/index.tsx');
  const indexLessPath = path.join(blockDir, 'src/index.less');
  try {
    await fs.outputFile(indexTSXPath, jsxText);
    if (cssText !== null) {
      await fs.outputFile(indexLessPath, cssText);
    }
  } catch (err) {
    console.log(err);
  }

  const description = parseDesc(text);
  await modifyPackageInfo(blockDir, name, description);

  await screenshot(name, blockDir, rootDir, width, height);
};

const generateBlocks = async (demosWithText, needContinue) => {
  for (let index = 0; index < demosWithText.length; index++) {
    const demoWithText = demosWithText[index];
    const { name } = demoWithText;
    if (needContinue && historyList.indexOf(name) !== -1) {
      continue;
    }

    const current = historyList.length + 1;
    const total = demosWithText.length;
    spinner.start(`[${current}/${total}] generate block ${name}`);

    await generateBlock(demoWithText);
    historyList.push(name);
    await fs.writeJSON(continueFilePath, historyList);
  }
  const total = demosWithText.length;
  spinner.succeed(`${total} blocks generated`);
};

const generateBlockList = async demosWithText => {
  spinner.start('generate umi-block.json');
  let blockList = [];
  for (let index = 0; index < demosWithText.length; index++) {
    const demoWithText = demosWithText[index];
    const { name, componentName, mdBaseName, text, componentType } = demoWithText;
    if (componentType === '废弃') {
      return;
    }
    const description = parseDesc(text);
    const demoTitle = parseTitle(text);
    const title = `${componentName}-${demoTitle}`;
    const img = `https://raw.githubusercontent.com/ant-design/ant-design-blocks/master/${name}/snapshot.png`;
    const previewUrl = `https://ant.design/components/${componentName}-cn/#components-${componentName}-demo-${mdBaseName}`;
    const url = `https://github.com/ant-design/ant-design-blocks/tree/master/${name}`;
    const tags = [componentType];
    blockList.push({
      title,
      value: name,
      key: name,
      description,
      url,
      type: 'block',
      path: name,
      isPage: false,
      defaultPath: `/${name}`,
      img,
      tags,
      name: title,
      previewUrl,
    });
  }
  const umiBlockJSON = { blocks: blockList };
  const blockListFilePath = path.join(rootDir, 'umi-block.json');
  await fs.writeJSON(blockListFilePath, umiBlockJSON);
  spinner.succeed();
};

const main = async () => {
  const needContinue = process.argv[2] === '-c';

  if (needContinue) {
    historyList = await fs.readJSON(continueFilePath, 'utf8');
  } else {
    await fs.writeJSON(continueFilePath, historyList);
  }

  const demos = await fetchAntDDemos();

  if (demos.length <= 0) {
    console.error('antd demos not found, please check ant-design submodule is existed!');
    return;
  }

  let demosWithText = await Promise.all(
    demos.map(async demo => {
      const text = await fs.readFile(demo.filePath, 'utf8');
      return {
        ...demo,
        text,
      };
    }),
  );

  demosWithText = demosWithText.filter(demo => !parseIsDebug(demo.text));

  if (DEBUG_COUNT !== 0) {
    demosWithText = demosWithText.slice(0, DEBUG_COUNT);
  }

  console.log(`will generate ${demosWithText.length} blocks`);

  await openBrowser();

  await generateBlocks(demosWithText, needContinue);

  await generateBlockList(demosWithText);

  await closeBrowser();
};

main();
