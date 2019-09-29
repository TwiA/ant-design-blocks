import React from 'react';
import { PageHeader } from 'antd';

const routes = [
  {
    path: 'index',
    breadcrumbName: 'First-level Menu',
  },
  {
    path: 'first',
    breadcrumbName: 'Second-level Menu',
  },
  {
    path: 'second',
    breadcrumbName: 'Third-level Menu',
  },
];

export default () => <div id="components-page-header-demo-breadcrumb">
  <PageHeader title="Title" breadcrumb={{ routes }} subTitle="This is a subtitle" /></div>;
