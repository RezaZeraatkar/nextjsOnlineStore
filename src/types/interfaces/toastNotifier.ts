import { Status } from './formactions';

export interface NotificationProps {
  success: boolean;
  message: string;
  status: Status;
}
