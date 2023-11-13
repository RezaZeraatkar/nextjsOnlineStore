'use client';

import React from 'react';
import Button from '.';
import Modal, { useModal } from '@/components/modal/Modal';
import { deleteProduct } from '@/app/(dashboard)/dashboard/products/_actions';
import { IProduct } from '@/types/interfaces/product';
import SubmitButton from '@/components/SubmitButton/submitButton';
import {
  // @ts-expect-error
  experimental_useFormState as useFormState,
} from 'react-dom';
import { ResponseType } from '@/types/interfaces/formactions';
import { ToastNotifier } from '@/components/toastNotifier/toastNotifier';

interface IdeleteBtnProps {
  product: IProduct;
}

const initialState: ResponseType<IProduct> = {
  success: false,
  error: false,
  status: 'initial_render',
};

export default function DeleteBtn({ product }: IdeleteBtnProps) {
  const { handleClose, handleOpen, isOpen } = useModal();
  const deletedProduct = deleteProduct.bind(null, product);
  const [state, formAction] = useFormState(deletedProduct, initialState);

  return (
    <>
      <Button
        onClick={handleOpen}
        className='flex items-center rounded-md bg-red-500 px-2 py-1 text-sm text-white'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4 text-white'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
          />
        </svg>
        Delete
      </Button>
      <Modal isOpen={isOpen} handleClose={handleClose}>
        <div className='m-2 flex flex-col gap-3'>
          <h2>
            Do you really want to delete Product <b>{product.product_name}</b>
          </h2>
          <div className='flex gap-1'>
            <form action={formAction}>
              <SubmitButton className='flex rounded-md bg-red-500 p-2 text-white shadow-md'>
                Delete Product (yes)
              </SubmitButton>
            </form>
            <Button
              onClick={handleClose}
              className='mx-2 rounded-md border border-gray-300 p-2'
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
      <ToastNotifier
        status={state?.status}
        success={state?.success}
        message={state?.success ? state?.message : state?.error?.message}
      />
    </>
  );
}
