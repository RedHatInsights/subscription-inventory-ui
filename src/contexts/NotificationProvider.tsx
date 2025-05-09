/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState } from 'react';
import { AlertActionLink } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { v4 as uuid } from 'uuid';

type NotificationVariantType = 'success' | 'danger' | 'info';

interface NotificationProps {
  variant: NotificationVariantType;
  message: string;
  key: string;
  timeout?: boolean;
  actionLinks?: React.ReactNode;
  downloadHref?: string;
}
interface NotificationProviderProps {
  children?: React.ReactNode;
}

export type NotificationOptions = {
  hasTimeout?: boolean;
  alertLinkText?: string;
  alertLinkHref?: string;
  alertLinkIsDownload?: boolean;
  keyOfAlertToReplace?: string;
};

interface NotificationContextType {
  notifications: NotificationProps[];
  addNotification: (
    variant: NotificationVariantType,
    message: string,
    options?: NotificationOptions
  ) => string;
  removeNotification: (key: string) => void;
}

const NotificationContext = React.createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => '',
  removeNotification: () => {
    throw new Error(' removeNotification must be used within a NotificationProvider');
  }
});

const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const buildNotificationProps = (
    variant: NotificationVariantType,
    message: string,
    options?: NotificationOptions
  ): NotificationProps => {
    const notificationKey: string = uuid();
    const notificationProps: NotificationProps = {
      variant: variant,
      message: message,
      key: notificationKey,
      timeout: options?.hasTimeout ?? true
    };

    if (options?.alertLinkText && options?.alertLinkHref) {
      const linkAttributes = options?.alertLinkIsDownload ? { download: '' } : {};
      const alertLink = (
        <>
          <AlertActionLink>
            <a href={options.alertLinkHref} {...linkAttributes}>
              {options.alertLinkText}
            </a>
          </AlertActionLink>
        </>
      );
      notificationProps.actionLinks = alertLink;
    }

    if (options?.alertLinkIsDownload && options?.alertLinkHref) {
      notificationProps.downloadHref = options.alertLinkHref;
    }

    return notificationProps;
  };

  const addNotification = (
    variant: NotificationVariantType,
    message: string,
    options?: NotificationOptions
  ): string => {
    const newNotificationProps = buildNotificationProps(variant, message, options);

    let newNotifications = [...notifications, { ...newNotificationProps }];

    if (options?.keyOfAlertToReplace) {
      newNotifications = newNotifications.filter(
        (notification) => notification.key !== options.keyOfAlertToReplace
      );
    }

    setNotifications(newNotifications);
    return newNotificationProps.key;
  };

  const removeNotification = (key: string) => {
    setNotifications(notifications.filter((notification) => notification.key !== key));
  };

  const contextValue = {
    notifications,
    addNotification: (
      variant: NotificationVariantType,
      message: string,
      options?: NotificationOptions
    ) => {
      return addNotification(variant, message, options);
    },
    removeNotification: (key: string) => removeNotification(key)
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

export { NotificationVariantType, NotificationContext, NotificationProvider as default };
