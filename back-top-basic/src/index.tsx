import React from "react";
import styles from "./index.less";
import { BackTop } from "antd";

export default () => (
  <div className={styles.container}>
    <div id="components-back-top-demo-basic">
      <div>
        <BackTop />
        Scroll down to see the bottom-right
        <strong style={{ color: "rgba(64, 64, 64, 0.6)" }}> gray </strong>
        button.
      </div>
    </div>
  </div>
);
