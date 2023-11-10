import React, { useRef, useEffect } from 'react';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { NotificationProps } from '@/types/interfaces/toastNotifier';

export const ToastNotifier: React.FC<NotificationProps> = ({
  success,
  message,
  status,
}) => {
  const notify = useToastNotifications();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current || status === 'initial_render') {
      firstRender.current = false;
      return;
    }

    notify({ success, message, status });
  }, [success, message, status, notify]);

  return null;
};
