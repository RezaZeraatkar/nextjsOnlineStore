'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import SubmitButton from '../SubmitButton/submitButton';
import PhotoCanvas from '../photoCanvas/photoCanvas';
import {
  getSignature,
  saveToDatabase,
} from '@/app/(dashboard)/dashboard/products/_actions';
import { ICloudinaryImageUploadResponse } from '@/types/interfaces/cloudinary';
import { CameraIcon, UploadIcon } from '../common/icons';
import StatusMessage from '../common/statusMessage/statusMessage';
import { useToastNotifications } from '@/hooks/useToastNotifications';

interface IuploadImageProps {
  productId: string | null;
  onSuccessUploadImages: number;
  setOnSuccessUploadImages: Dispatch<SetStateAction<number>>;
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

export default function UploadImage({
  productId,
  setOnSuccessUploadImages,
  onSuccessUploadImages,
}: IuploadImageProps) {
  const [open, setOpen] = useState(false);
  const notify = useToastNotifications();
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
      if (results?.length && productId) {
        // uploading images to cloudinary was successful. so update the product with these images
        const res = await saveToDatabase(results, productId);
        // notify success uploaded message to the user
        if (res.success) {
          setOnSuccessUploadImages(onSuccessUploadImages + 1);
          return notify({
            message: res?.message || '',
            status: res?.status,
            success: res?.success,
          });
        } else {
          return notify({
            success: res?.success,
            status: res?.status,
            message: res?.error?.message,
          });
        }
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
  }, [
    imgFiles,
    productId,
    notify,
    setOnSuccessUploadImages,
    onSuccessUploadImages,
  ]);

  return (
    <div className='w-full'>
      <h1 className='font-extrabold'>Upload new product photos</h1>
      <div className='flex flex-col justify-between gap-2 md:w-full md:flex-row'>
        <div className='mb-0 w-full md:w-1/5'>
          <label className='flex flex-col items-center justify-center rounded-md bg-gray-200 p-2 text-center text-gray-500'>
            <span className='flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-500'>
              <UploadIcon />
              <p className='mb-1 mt-0 text-sm text-yellow-800'>
                upload only image files less than 1mb in size. Limited up to 3
                photo files!
              </p>
              <input
                name='file'
                type='file'
                className='hidden'
                ref={inputFileRef}
                onChange={handleInputFiles}
                accept='image/*'
                multiple
                required
              />
            </span>
            <SubmitButton
              icon={<CameraIcon className='h-5 w-5' />}
              isloading={isLoading}
              onClick={imageFileUploader}
              className='btn-primary mt-2 w-full'
            >
              {productId ? 'Edit photos' : 'Upload photos'}
            </SubmitButton>
            <p className='text-red-500'>{errorMessage || null}</p>
          </label>
        </div>
        {/* Preview images */}
        <div className='relative flex w-full flex-wrap gap-2 rounded-md border border-gray-200 px-2 pt-12 md:w-4/5'>
          <div className='absolute left-2 top-0 text-sm text-gray-300'>
            Total files(in MB): {totalSizeInMB}
          </div>
          {imgFiles?.map((file, idx) => {
            return (
              <div key={idx} className='relative'>
                <PhotoCanvas url={URL.createObjectURL(file)} />
                <button
                  className='absolute -right-1 -top-1 h-5 w-5 rounded-full border bg-red-500 text-sm text-white opacity-70'
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
          {!imgFiles && (
            <div className='absolute inset-0 flex items-center justify-center rounded-md'>
              <p className='p-8 font-bold text-gray-300'>Images Preview</p>
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
