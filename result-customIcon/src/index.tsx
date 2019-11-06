import React from "react";
import styles from "./index.less";
import { Result, Icon, Button } from "antd";

export default () => (
  <div className={styles.container}>
    <div id="components-result-demo-customIcon">
      <Result
        icon={<Icon type="smile" theme="twoTone" />}
        title="Great, we have done all the operations!"
        extra={<Button type="primary">Next</Button>}
      />
    </div>
  </div>
);
