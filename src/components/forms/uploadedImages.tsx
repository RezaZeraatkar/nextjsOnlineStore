'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import SubmitButton from '../SubmitButton/submitButton';
import PhotoCanvas from '../photoCanvas/photoCanvas';
import {
  getSignature,
  saveToDatabase,
} from '@/app/(dashboard)/dashboard/products/_actions';
import { ICloudinaryImageUploadResponse } from '@/types/interfaces/cloudinary';
import { CameraIcon, UploadIcon } from '../common/icons';
import StatusMessage from '../common/statusMessage/statusMessage';
import { IProduct } from '@/types/interfaces/product';

interface IuploadedImagesProps {
  product: IProduct;
}

// File handling functions
const filterFiles = (files: FileList) => {
  return [...files].filter((file) => {
    if (file.size < 1024 * 1024 && file.type.startsWith('image/')) {
      return file;
    } else {
      alert(`The ${file.name} is more than 1MB in size. rejected!`);
    }
  });
};

const calculateTotalSize = (imgFiles: File[]) => {
  let totalSizeInMB = 0;
  if (imgFiles?.length) {
    const totalSizeInBytes = imgFiles?.reduce(
      (total, file) => total + file.size,
      0
    );
    totalSizeInMB = Number((totalSizeInBytes / (1024 * 1024)).toFixed(2));
  } else {
    totalSizeInMB = 0;
  }
  return totalSizeInMB;
};

type CloudinaryEnpointTypes = 'delete' | 'upload';

// Cloudinary functions
const getCloudinaryConfig = (endpointType: CloudinaryEnpointTypes) => {
  const endpoint =
    endpointType === 'upload'
      ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL
      : process.env.NEXT_PUBLIC_CLOUDINARY_DELETE_URL;
  const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const cloudinary_folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

  return { endpoint, api_key, cloudinary_folder };
};

const createFormData = (
  imgFiles: File,
  signature: string,
  timestamp: number,
  cloudinary_folder: string,
  api_key: string
) => {
  const formData = new FormData();

  formData.append('file', imgFiles);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', cloudinary_folder);
  formData.append('api_key', api_key);

  return formData;
};

export default function UploadedImages({ product }: IuploadedImagesProps) {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imgFiles, setImgFile] = useState<File[] | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  if (imgFiles?.length === 0 && inputFileRef.current) {
    inputFileRef.current.value = '';
  }

  // Calculate total size in MB directly here
  let totalSizeInMB = imgFiles?.length ? calculateTotalSize(imgFiles) : 0;

  // handler to uplaod images file
  const handleInputFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files?.length || !files) return;

    const newFiles = filterFiles(files);

    setErrorMessage('');
    setImgFile((prev) => [...newFiles, ...(prev || [])]);
  };

  const imageFileUploader = useCallback(async () => {
    if (!imgFiles?.length) {
      setIsLoading(false);
      setOpen(false);
      setErrorMessage(
        'No image selected! You can either upload product images now or you can upload them later on edit page!'
      );
      return;
    }

    if (imgFiles.length > 3) {
      alert('You can only upload up to 3 files at a time.');
      setIsLoading(false);
      setOpen(false);
      return;
    }

    const { signature, timestamp } = await getSignature();
    const { endpoint, api_key, cloudinary_folder } =
      getCloudinaryConfig('upload');

    if (!endpoint || !api_key || !cloudinary_folder) {
      setErrorMessage('No cloudinary api detected!');
      return;
    }

    setOpen(true);

    const uploadFile = async (file: File) => {
      try {
        const formData = createFormData(
          file,
          signature,
          timestamp,
          cloudinary_folder,
          api_key
        );

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res: ICloudinaryImageUploadResponse = await response.json();
        return res;
      } catch (error) {
        console.error(
          'There was a problem with the file upload to cloudinary:',
          error
        );
        // You can set an error message to state here, or handle the error in another way
        setErrorMessage(
          `There was a problem with the file upload to cloudinary storage`
        );
      }
    };

    const responses: Promise<ICloudinaryImageUploadResponse | undefined>[] =
      imgFiles.map(uploadFile);

    try {
      const results = await Promise.all(responses);
      if (results?.length && product._id) {
        // uploading images to cloudinary was successful. so update the product with these images
        await saveToDatabase(results, product._id);
      } else {
        setOpen(false);
        setErrorMessage(
          `There was a problem with the file upload into database. It may be possible your product images does not successfully uploaded!}`
        );
      }
      // show the successful message to the user
    } catch (error) {
      console.error(
        'There was a problem with the file upload into database:',
        error
      );
      setOpen(false);
      setErrorMessage(
        `There was a problem with the file upload into database}`
      );
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  }, [imgFiles, product._id]);

  useEffect(() => {
    if (!!product._id) {
      setIsLoading(true);
      imageFileUploader();
    }
  }, [setIsLoading, imageFileUploader, product._id]);

  return (
    <div className='flex w-1/3 flex-col'>
      <h1 className='flex items-center font-extrabold'>
        <CameraIcon className='mr-2 h-6 w-6' />{' '}
        <span>Product uploaded photos</span>
      </h1>
      <div className='flex flex-col justify-between gap-2 md:w-full md:flex-row'>
        {/* Preview images */}
        <div className='relative flex w-full flex-wrap gap-2 rounded-md border border-gray-200 px-2'>
          {product.product_images?.map((url, idx) => {
            return (
              <div key={idx} className='relative'>
                <PhotoCanvas url={url} />
                <button
                  className='absolute -right-1 -top-1 h-5 w-5 rounded-full border bg-red-500 text-sm text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    setImgFile((prev) => {
                      const newFiles = prev?.filter((_, i) => i !== idx);
                      if (newFiles && newFiles?.length > 0) {
                        return newFiles;
                      } else return null;
                    }); // remove the image at index idx
                  }}
                >
                  X
                </button>
              </div>
            );
          })}
          {!product.product_images?.length && (
            <div className='absolute inset-0 top-3 flex items-center justify-center rounded-md'>
              <p className='font-bold text-red-500'>
                No images uploaded for this product yet!
              </p>
            </div>
          )}
          {imgFiles && (
            <button
              className='absolute right-2 top-1 text-sm text-gray-300'
              onClick={(e) => {
                e.stopPropagation();
                setImgFile(null);
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
      <StatusMessage open={open}>
        Wait! Uploading image files to the server ...
      </StatusMessage>
    </div>
  );
}
