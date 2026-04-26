import { toast } from 'react-toastify';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: 'bottom-center',
    className:
      '!min-h-9 !py-3 !px-6 !rounded-full !bg-purple-950/10 !backdrop-blur-2xl !w-fit !m-auto !mb-10 !text-emerald-100 !border !border-purple-500/30 !shadow-xl !font-rmneue',
    progressClassName: 'bg-emerald-400',
    icon: React.createElement(FaCheckCircle, {
      className: 'text-emerald-400',
    }),
  });
};

export const handleError = (msg) => {
  toast.error(msg, {
    position: 'bottom-center',
    className:
      '!min-h-9 !py-3 !px-6 !rounded-full !bg-black/30 !backdrop-blur-2xl !w-fit !m-auto !mb-10 !text-red-100 !border !border-red-500/30 !shadow-xl !font-rmneue',
    progressClassName: 'bg-red-400',
    icon: React.createElement(FaCheckCircle, {
      className: 'text-red-400',
    }),
  });
};
