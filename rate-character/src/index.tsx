import React from 'react';
import { Rate, Icon } from 'antd';

export default () => <div id="components-rate-demo-character">
  <div>
    <Rate character={<Icon type="heart" />} allowHalf />
    <br />
    <Rate character="A" allowHalf style={{ fontSize: 36 }} />
    <br />
    <Rate character="好" allowHalf />
  </div></div>;
