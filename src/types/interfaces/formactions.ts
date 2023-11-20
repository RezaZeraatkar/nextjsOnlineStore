import { StatusCode } from '@/types/enums';

export type Status = StatusCode | 'initial_render';

export type IError = {
  status: Status;
  message: string;
  fields?: Record<string, string>;
};

interface SuccessResponse<T> {
  success: true;
  status: Status;
  data: T;
  metadata?: any;
  message: string | null;
}

interface ErrorResponse {
  success: false;
  status: Status;
  metadata?: any;
  error: IError;
}

export type ResponseType<T> = SuccessResponse<T> | ErrorResponse;
