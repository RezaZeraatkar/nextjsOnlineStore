import { IError } from '@/types/interfaces/formactions';

interface SuccessParams {
  success: true;
  data: any;
  message: string | null;
}

interface ErrorParams {
  success: false;
  data?: any;
  message?: string;
  error: IError;
}

export type ResponseParams = SuccessParams | ErrorParams;
