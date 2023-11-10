import { IError, ResponseType } from '@/types/interfaces/formactions';

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

// export function createActionResponse(params: ResponseParams): ResponseType {
//   const { data, success, message } = params;

//   if (!success) {
//     return {
//       success,
//       error,
//     };
//   } else {
//     return {
//       data,
//       success,
//       message,
//     };
//   }
// }
