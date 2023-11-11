'use client';

import {
  // @ts-expect-error
  experimental_useFormState as useFormState,
} from 'react-dom';
import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef, useCallback } from 'react';
import { createOrUpdateProduct } from '@/app/(dashboard)/dashboard/products/actions';
import SubmitButton from '@/components/SubmitButton/submitButton';

import { IProduct } from '@/types/interfaces/product';
import { ResponseType } from '@/types/interfaces/formactions';
import { TextInput } from '@/components/common/Inputs/text/textInput';
import { TextAreaField } from '@/components/common/Inputs/textarea/textareaField';
import { NumberInput } from '@/components/common/Inputs/number/numberInput';
import { ToastNotifier } from '@/components/toastNotifier/toastNotifier';
import Link from 'next/link';
import PhotoCanvas from '../photoCanvas/photoCanvas';
import ClientOnlyPortal from '../Portals/clientOnlyPortal';

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
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imgFiles, setImgFile] = useState<File[] | null>(null);
  const [totalSizeInMB, setFilesSize] = useState<number>(0);

  const productId: string | null | undefined = product?._id;
  const updateProductWithId = createOrUpdateProduct.bind(null, productId);
  const [state, formAction] = useFormState(updateProductWithId, initialState);

  if (imgFiles?.length === 0 && inputFileRef.current) {
    inputFileRef.current.value = '';
  }

  // handler to uplaod images file
  const handleInputFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files?.length || !files) return;

    const newFiles = [...files].filter((file) => {
      if (file.size < 1024 * 1024 && file.type.startsWith('image/')) {
        // only accept image files less then 1mb in size
        return file;
      } else {
        console.log('more than 1MB in size', file);
      }
    });

    // calculate total files volume
    const totalSizeInBytes = newFiles.reduce(
      (total, file) => total + file.size,
      0
    );
    // convert total size to megabytes
    const totalSizeInMB = Number((totalSizeInBytes / (1024 * 1024)).toFixed(2));

    setFilesSize((prevSize) => prevSize + totalSizeInMB);
    setImgFile((prev) => [...newFiles, ...(prev || [])]);
  };

  // const closeSignleImage = useCallback(, []);

  const { success, error } = state;

  return (
    <div className='mt-3 flex flex-col gap-6'>
      <form
        action={formAction}
        className='flex w-full flex-col gap-2 border border-x-0 border-y-0 border-b-[1px] pb-10'
      >
        <div className='flex justify-between'>
          <h1 className='font-extrabold'>
            {productId ? 'Edit' : 'Add'} Product Informations
          </h1>
          <Link href='/dashboard/products' className='btn-primary'>
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
          <SubmitButton className='btn-primary mt-2 flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='mr-2 h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
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
      </form>
      {/* upload images */}
      <div>
        <h1 className='font-extrabold'>Upload product photos</h1>
        <div className='flex flex-col justify-between gap-2 md:w-full md:flex-row'>
          <div className='mb-0 w-full md:w-1/3'>
            <input
              name='file'
              type='file'
              ref={inputFileRef}
              onChange={handleInputFiles}
              accept='image/*'
              multiple
              required
            />
            <p className='mb-1 mt-0 text-sm text-red-500'>
              Only image files less than 1mb in size. Up to 3 photo files!
            </p>
          </div>
          {/* Preview images */}
          <div className='relative flex w-full gap-2 border border-gray-200 px-2 pt-12 md:w-2/3'>
            <div className='absolute left-2 top-0 text-sm text-gray-300'>
              Total files(in MB): {totalSizeInMB}
            </div>
            {imgFiles?.map((file, idx) => {
              return (
                <div key={idx} className='relative'>
                  <PhotoCanvas url={URL.createObjectURL(file)} />
                  <button
                    className='absolute -right-1 -top-1 h-5 w-5 rounded-full border border-gray-400 bg-gray-100 text-sm opacity-50'
                    onClick={(e) => {
                      e.stopPropagation();
                      setImgFile((prev) => {
                        const newFiles = prev?.filter((_, i) => i !== idx);
                        if (newFiles && newFiles?.length > 0) {
                          return newFiles;
                        } else return null;
                      }); // remove the image at index idx
                      setFilesSize((prevSize) => {
                        const newSize =
                          prevSize -
                          Number(file.size.toFixed(2)) / (1024 * 1024);
                        return Number(newSize.toFixed(2)); // round to 2 decimal places
                      }); // subtract the size of the removed file
                    }}
                  >
                    X
                  </button>
                </div>
              );
            })}
            {!imgFiles && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <p className='p-8 font-bold text-gray-300'>Images Preview</p>
              </div>
            )}
            {imgFiles && (
              <button
                className='absolute right-2 top-1 text-sm text-gray-300'
                onClick={(e) => {
                  e.stopPropagation();
                  setImgFile(null);
                  setFilesSize(0);
                  if (inputFileRef.current) {
                    inputFileRef.current.value = '';
                  }
                }}
              >
                X
              </button>
            )}
          </div>
        </div>
        <SubmitButton className='btn-primary mt-2 flex items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='mr-2 h-6 w-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z'
            />
          </svg>

          {productId ? 'Edit Product photos' : 'Upload product photos'}
        </SubmitButton>
      </div>
    </div>
  );
}
