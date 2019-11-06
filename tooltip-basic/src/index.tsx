import React from "react";
import { Tooltip } from "antd";

export default () => (
  <div className="container">
    <div id="components-tooltip-demo-basic">
      <Tooltip title="prompt text">
        <span>Tooltip will show on mouse enter.</span>
      </Tooltip>
    </div>
  </div>
);
