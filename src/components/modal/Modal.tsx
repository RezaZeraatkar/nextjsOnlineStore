import React, { ReactNode, useState, useCallback } from 'react';

// useModal hook
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return { isOpen, handleOpen, handleClose };
}

interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, handleClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 m-0 flex items-center justify-center overflow-hidden p-0'>
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={handleClose}
      ></div>
      <div className='duration-400 z-10 mx-auto max-w-md scale-100 transform rounded bg-white p-6 shadow-lg transition-transform ease-out'>
        <button
          className='absolute right-0 top-0 p-2 pr-3 font-bold text-gray-700 hover:text-gray-900'
          onClick={handleClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
