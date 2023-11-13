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
import { PlusIcon } from '../common/icons';
import MultiStepForm from '../multiStepForm';

const initialState: ResponseType<IProduct> = {
  success: false,
  error: false,
  status: 'initial_render',
};

export function AddProductForm({
  product,
}: {
  product: IProduct;
}): JSX.Element {
  const productId: string | null | undefined = product?._id;
  const updateProductWithId = createOrUpdateProduct.bind(null, productId);
  const [state, formAction] = useFormState(updateProductWithId, initialState);

  const { success, error } = state;

  return (
    <div className='mt-3 flex w-full flex-col gap-6'>
      <MultiStepForm
        showStepNumber={true}
        forms={[
          <form
            key='1'
            action={formAction}
            className='flex w-full flex-col gap-2 border border-x-0 border-y-0 border-b-[1px] pb-10'
          >
            <div className='flex justify-between'>
              <h1 className='font-extrabold'>
                {productId ? 'Edit' : 'Add'} Product Informations
              </h1>
              <Link
                href='/dashboard/products'
                className='h-0 p-0 text-sm text-blue-900 hover:underline'
              >
                &larr; back to products page
              </Link>
            </div>
            <div>
              <TextInput
                id='product_name'
                name='product_name'
                defaultValue={productId ? product?.product_name : ''}
                label='Product name'
                className='p-1'
                placeholder='Product name'
                error={error?.fields?.product_name || null}
                required
              />
              <TextAreaField
                id='product_description'
                name='product_description'
                defaultValue={productId ? product?.product_description : ''}
                label='Product description'
                className='p-1'
                placeholder='Product description'
                error={error?.fields?.product_description || null}
                required
              />
              <NumberInput
                id='product_price'
                name='product_price'
                defaultValue={productId ? product?.product_price : ''}
                label='Product price '
                className='p-1'
                placeholder='Product price (in USD)'
                error={error?.fields?.product_price || null}
                min={0}
                required
              />
              <SubmitButton
                icon={<PlusIcon />}
                isloading={false}
                type='submit'
                className='btn-primary mt-2 flex items-center'
              >
                {productId
                  ? 'Edit Product informations'
                  : 'Add product informations'}
              </SubmitButton>
            </div>
            <ToastNotifier
              status={state.status}
              success={success}
              message={success ? state?.message : state?.error?.message}
            />
          </form>,
          <UploadImage key='2' productId={productId} />,
        ]}
      />
    </div>
  );
}
