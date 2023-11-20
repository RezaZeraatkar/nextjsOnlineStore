import React, { useState } from 'react';
import PhotoCanvas from '../photoCanvas/photoCanvas';

import { CameraIcon } from '../common/icons';
import { IProduct } from '@/types/interfaces/product';
import { Spinner } from '../common/Spinner/spinner';
interface IuploadedImagesProps {
  product: IProduct;
}

export default function UploadedImages({ product }: IuploadedImagesProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // use useState hook to create a state variable for product and a setter function
  const [newProduct, setProduct] = useState(product);

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
      setIsLoading(true);
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to delete the product image!');
      setIsLoading(true);
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
          {newProduct.product_images?.map((url, idx) => {
            return (
              <div key={idx} className='relative'>
                <PhotoCanvas url={url} />
                <button
                  className='absolute -right-1 -top-1 h-5 w-5 rounded-full border bg-red-500 text-sm text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(url, newProduct._id); // delete the image from db
                  }}
                >
                  X
                </button>
              </div>
            );
          })}
          {!newProduct.product_images?.length && (
            <div className='top-3 flex items-center justify-center rounded-md'>
              <p className='font-bold text-red-500'>
                No images uploaded for this product yet!
              </p>
            </div>
          )}
        </div>
      </div>
      <p className='text-red-500'>{errorMessage}</p>
    </div>
  );
}
