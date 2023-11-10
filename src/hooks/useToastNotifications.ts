import React from 'react';
import toast from 'react-hot-toast';
import { NotificationProps } from '@/types/interfaces/toastNotifier';

export const useToastNotifications = <T extends NotificationProps>() => {
  const notify = React.useCallback(({ message, success, status }: T) => {
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }, []);

  return notify;
};
