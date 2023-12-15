import { Schema } from 'zod';

export const safeParser = <T>(schema: Schema, formdata: FormData) => {
  const form = Object.fromEntries(formdata.entries());
  try {
    const result = schema.parse(form);
    return {
      error: false,
      data: result as T,
    };
  } catch (error: any) {
    console.error('safeParser Error: ', error);
    // constructing a unified error
    const normalizedErrors: Record<string, string> = {};
    for (const err of error.issues) {
      const fieldName = err.path[0];
      if (!normalizedErrors[fieldName]) {
        normalizedErrors[fieldName] = '';
      }
      normalizedErrors[fieldName] = err.message;
    }
    return {
      error: true,
      errorData: normalizedErrors as Record<string, string>,
    };
  }
};
/*
[
  {
    code: 'invalid_type',
    expected: 'string',
    received: 'number',
    path: [ 'product_name' ],
    message: 'Expected string, received number'
  },
  {
    code: 'invalid_type',
    expected: 'string',
    received: 'undefined',
    path: [ 'product_descripton' ],
    message: 'Required'
  },
  {
    code: 'invalid_type',
    expected: 'number',
    received: 'nan',
    path: [ 'product_price' ],
    message: 'Expected number, received nan'
  }
]
*/
