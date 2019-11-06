import React from "react";
import styles from "./index.less";
import { AutoComplete } from "antd";

const dataSource = ["Burns Bay Road", "Downing Street", "Wall Street"];

function Complete() {
  return (
    <AutoComplete
      style={{ width: 200 }}
      dataSource={dataSource}
      placeholder="try to type `b`"
      filterOption={(inputValue, option) =>
        option.props.children
          .toUpperCase()
          .indexOf(inputValue.toUpperCase()) !== -1
      }
    />
  );
}

export default () => (
  <div className={styles.container}>
    <div id="components-auto-complete-demo-non-case-sensitive">
      <Complete />
    </div>
  </div>
);
