'use client';
import React, { useCallback, useEffect, useState } from 'react';
import PhotoCanvas from '../photoCanvas/photoCanvas';

import { CameraIcon } from '../common/icons';
import { IProduct } from '@/types/interfaces/product';
import { Spinner } from '../common/Spinner/spinner';
import { ResponseType } from '@/types/interfaces/formactions';
import { useToastNotifications } from '@/hooks/useToastNotifications';
interface IuploadedImagesProps {
  productId: string;
  onSuccessUploadImages: number;
}

export default function UploadedImages({
  productId,
  onSuccessUploadImages,
}: IuploadedImagesProps) {
  const [product, setProduct] = useState<IProduct>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const notify = useToastNotifications();

  // refetch the product images after mutations
  const fetchProduct = useCallback(async () => {
    const productRes = await fetch(`/api/product?productId=${productId}`, {
      method: 'GET',
    });
    const res: ResponseType<IProduct> = await productRes.json();
    return res;
  }, [productId]);

  useEffect(() => {
    setIsLoading(true);
    const fetchAndSetProduct = async () => {
      const res = await fetchProduct();
      if (res.success) {
        setIsLoading(false);
        setProduct(res.data);
      } else {
        notify({
          success: false,
          message: res.error.message,
          status: res.status,
        });
        setIsLoading(false);
      }
    };
    fetchAndSetProduct();
    // setIsLoading(false);
  }, [fetchProduct, notify, onSuccessUploadImages]);

  const handleDelete = async (url: string, productId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/product`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          productId,
        }),
      });
      // get the new product data from the response
      const newProduct = await response.json();
      // update the state with the new product data
      setProduct(newProduct.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to delete the product image!');
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className='flex w-5/12 flex-col'>
      <h1 className='flex items-center font-extrabold'>
        {isLoading ? <Spinner /> : <CameraIcon className='mr-2 h-6 w-6' />}{' '}
        <span>Product uploaded photos</span>
      </h1>
      <div className='flex flex-col justify-between gap-2 md:w-full md:flex-row'>
        {/* Preview images */}
        <div className='relative flex w-full flex-wrap gap-2 rounded-md border border-gray-200 px-2'>
          {product?.product_images?.map((url, idx) => {
            return (
              <div key={idx} className='relative'>
                <PhotoCanvas url={url} />
                <button
                  className='absolute -right-1 -top-1 h-5 w-5 rounded-full border bg-red-500 text-sm text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(url, product?._id); // delete the image from db
                  }}
                >
                  X
                </button>
              </div>
            );
          })}
          {isLoading ? (
            <Spinner />
          ) : (
            !product?.product_images?.length && (
              <div className='top-3 flex items-center justify-center rounded-md'>
                <p className='font-bold text-red-500'>
                  No images uploaded for this product yet!
                </p>
              </div>
            )
          )}
        </div>
      </div>
      <p className='text-red-500'>{errorMessage}</p>
    </div>
  );
}
