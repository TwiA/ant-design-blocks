import React from 'react';
import { Button, notification } from 'antd';

const openNotification = () => {
  notification.open({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

export default () => <div id="components-notification-demo-basic">
  <Button type="primary" onClick={openNotification}>
    Open the notification box
  </Button></div>;
