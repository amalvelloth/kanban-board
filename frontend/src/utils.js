import { toast } from 'react-toastify';

export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: 'top-right',
    className:
      'rounded-xl bg-emerald-950 text-emerald-100 border border-emerald-500/30 shadow-xl font-rmneue',
    progressClassName: 'bg-emerald-400',
    icon: false,
  });
};

export const handleError = (msg) => {
  toast.error(msg, {
    position: 'top-right',
    className:
      'rounded-xl bg-red-950 text-red-100 border border-red-500/30 shadow-xl font-rmneue',
    progressClassName: 'bg-red-400',
    icon: false,
  });
};
