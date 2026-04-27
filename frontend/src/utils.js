import { toast } from 'react-toastify';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';

export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: 'bottom-center',
    className:
      '!min-h-9 !py-3 !px-6 !text-xs !rounded-full !bg-purple-950/10 !backdrop-blur-2xl !w-fit !m-auto !left-0 !right-0 !text-emerald-100 !border !border-purple-500/30 !shadow-xl !font-rmneue',
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
      '!min-h-9 !py-3 !px-6 !text-xs !rounded-full !bg-black/30 !backdrop-blur-2xl !w-fit !m-auto !left-0 !right-0 !text-red-100 !border !border-red-500/30 !shadow-xl !font-rmneue',
    progressClassName: 'bg-red-400',
    icon: React.createElement(FaTimesCircle, {
      className: 'text-red-400',
    }),
  });
};

export const handleThemeToast = (msg) => {
  toast(msg, {
    position: 'bottom-center',
    className:
      '!min-h-9 !py-3 !px-6 !text-xs !rounded-full !bg-black/30 !backdrop-blur-2xl !w-fit !m-auto !left-0 !right-0 !text-white !border !border-purple-500/30 !shadow-xl !font-rmneue',
    progressClassName: '!bg-purple-400',
    icon: React.createElement(FaCheckCircle, {
      className: 'text-emerald-400',
    }),
  })
}