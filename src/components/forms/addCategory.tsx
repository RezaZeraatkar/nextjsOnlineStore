'use client';
import React from 'react';
import {
  // @ts-expect-error
  experimental_useFormState as useFormState,
} from 'react-dom';
import { TextInput } from '@/components/common/Inputs/text/textInput';
import SubmitButton from '@/components/SubmitButton/submitButton';
import { ICategory } from '@/types/interfaces/category';
import { ResponseType } from '@/types/interfaces/formactions';
import { ToastNotifier } from '@/components/toastNotifier/toastNotifier';
import { createCategory } from '@/app/(dashboard)/dashboard/categories/_actions';

const initialState: ResponseType<ICategory> = {
  success: false,
  error: { status: 100, message: '' },
  status: 'initial_render',
};

export default function AddCategory() {
  const [state, formAction] = useFormState(createCategory, initialState);
  const { success, error } = state;

  return (
    <form action={formAction} className='w-1/4'>
      <TextInput
        placeholder='New category'
        label='New category'
        id='categoryId'
        name='category_name'
        className='p-1'
        error={error?.fields?.category_name || null}
        required
      />
      <SubmitButton className='btn-primary'>Save</SubmitButton>
      <ToastNotifier
        status={state.status}
        success={success}
        message={success ? state?.message : state?.error?.message}
      />
    </form>
  );
}
