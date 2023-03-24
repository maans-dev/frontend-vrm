import { EuiGlobalToastList } from '@elastic/eui';
import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import { createContext, useState } from 'react';

export type ToastContextType = {
  addToast: (toast: Toast) => void;
  removeToast: (removedToast: Toast) => void;
};

export const ToastContext = createContext<Partial<ToastContextType>>({});

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Toast) => {
    setToasts(toasts.concat(toast));
  };

  const removeToast = (removedToast: Toast) => {
    setToasts(toasts.filter(toast => toast.id !== removedToast.id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <EuiGlobalToastList
        toasts={toasts}
        dismissToast={removeToast}
        toastLifeTimeMs={6000}
      />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
