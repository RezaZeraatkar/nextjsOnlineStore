'use client';

import {
  // @ts-expect-error
  experimental_useFormState as useFormState,
} from 'react-dom';
import { createOrUpdateProduct } from '@/app/(dashboard)/dashboard/products/_actions';
import SubmitButton from '@/components/SubmitButton/submitButton';

import { IProduct } from '@/types/interfaces/product';
import { ResponseType } from '@/types/interfaces/formactions';
import { TextInput } from '@/components/common/Inputs/text/textInput';
import { TextAreaField } from '@/components/common/Inputs/textarea/textareaField';
import { NumberInput } from '@/components/common/Inputs/number/numberInput';
import { ToastNotifier } from '@/components/toastNotifier/toastNotifier';
import Link from 'next/link';
import UploadImage from './uploadImage';
import { PlusIcon } from '@/components/common/icons';
import UploadedImages from './uploadedImages';
import { Suspense, useState } from 'react';

const initialState: ResponseType<IProduct> = {
  success: false,
  error: { status: 100, message: '' },
  status: 'initial_render',
};

export function AddProductForm({ product }: { product: IProduct }) {
  const productIdParam: string | null | undefined = product?._id;
  const updateProductWithId = createOrUpdateProduct.bind(null, {
    productId: productIdParam,
    step: 1,
  });
  const [state, formAction] = useFormState(updateProductWithId, initialState);
  const [onSuccessUploadImages, setOnSuccessUploadImages] = useState(0);
  const { success, error } = state;

  return (
    <div className='mt-3 flex w-full flex-col gap-6'>
      <div className='flex flex-col'>
        <form
          action={formAction}
          className='flex flex-col gap-2 border border-x-0 border-y-0 border-b-[1px] pb-10'
        >
          <div className='fixed inset-x-0 top-0 z-40 ml-64 flex h-auto items-center justify-between bg-blue-200 p-4 pt-20 shadow-md'>
            <div>
              <h1 className='pt-2 font-extrabold'>
                {productIdParam ? 'Edit' : 'Add'} Product Informations
              </h1>
            </div>
            <div className='flex flex-col gap-2'>
              <SubmitButton
                icon={<PlusIcon />}
                isloading={false}
                type='submit'
                className='btn-primary mt-2'
              >
                {productIdParam ? 'Edit Product' : 'Add product'}
              </SubmitButton>
              <Link
                href='/dashboard/products'
                className='text-sm text-yellow-600 hover:underline'
              >
                &larr; back to products page
              </Link>
            </div>
          </div>
          <div className='flex items-start justify-center gap-2 pt-24'>
            <div className='flex w-7/12 gap-2 border-r pr-2'>
              <div className='mt-2'>
                <TextInput
                  id='product_name'
                  name='product_name'
                  defaultValue={
                    productIdParam
                      ? product?.product_name
                      : success
                      ? state.data.product_name
                      : ''
                  }
                  label='Product name'
                  className='p-1'
                  placeholder='Product name'
                  error={error?.fields?.product_name || null}
                  required
                />
                <TextAreaField
                  id='product_description'
                  name='product_description'
                  defaultValue={
                    productIdParam
                      ? product?.product_description
                      : success
                      ? state.data.product_description
                      : ''
                  }
                  label='Product description'
                  className='p-1'
                  placeholder='Product description'
                  error={error?.fields?.product_description || null}
                  required
                />
                <NumberInput
                  id='product_price'
                  name='product_price'
                  defaultValue={
                    productIdParam
                      ? product?.product_price
                      : success
                      ? state.data.product_price
                      : ''
                  }
                  label='Product price'
                  className='p-1'
                  placeholder='Product price (in USD)'
                  error={error?.fields?.product_price || null}
                  min={0}
                  required
                />
              </div>
            </div>
            <Suspense fallback={'loading ...'}>
              <UploadedImages
                productId={product._id}
                onSuccessUploadImages={onSuccessUploadImages}
              />
            </Suspense>
          </div>
        </form>
      </div>
      <UploadImage
        productId={success ? state.data._id : productIdParam}
        setOnSuccessUploadImages={setOnSuccessUploadImages}
        onSuccessUploadImages={onSuccessUploadImages}
      />
      <ToastNotifier
        status={state.status}
        success={success}
        message={success ? state?.message : state?.error?.message}
      />
    </div>
  );
}
