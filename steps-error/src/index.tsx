import React from 'react';
import { Steps } from 'antd';

const { Step } = Steps;

export default () => 
  <Steps current={1} status="error">
    <Step title="Finished" description="This is a description" />
    <Step title="In Process" description="This is a description" />
    <Step title="Waiting" description="This is a description" />
  </Steps>;
