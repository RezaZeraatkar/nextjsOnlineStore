import { StatusCode } from '@/types/enums';

export type Status = StatusCode | 'initial_render';

export type IError =
  | {
      status: Status;
      message: string;
      fields?: Record<string, string>;
    }
  | false;

interface SuccessResponse<T> {
  success: true;
  status: Status;
  data: T;
  message: string | null;
}

interface ErrorResponse {
  success: false;
  status: Status;
  error: IError;
}

export type ResponseType<T> = SuccessResponse<T> | ErrorResponse;
