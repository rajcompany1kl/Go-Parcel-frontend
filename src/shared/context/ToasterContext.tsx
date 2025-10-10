import { createContext, useCallback, useState, type ReactNode } from "react";
import type { Toast, ToasterContainerProps, ToasterContextProps, ToastType } from "../types";
import Toaster from "../components/ui/Toaster";

export const ToasterContext = createContext<ToasterContextProps | null>(null);

let idCounter = 0;

const ToasterContainer: React.FC<ToasterContainerProps> = ({ toasts, removeToast }) => {
    return (
      <div aria-live="assertive" className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50">
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {toasts.map(({ id, message, type }) => (
            <Toaster key={id} id={id} message={message} type={type} onClose={() => removeToast(id)} />
          ))}
        </div>
      </div>
    );
  };

const ToasterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = idCounter++;
    const newToast: Toast = { id, message, type };
    setToasts((currentToasts) => [...currentToasts, newToast]);
    setTimeout(() => removeToast(id), duration);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToasterContext.Provider value={{ addToast }}>
      {children}
      <ToasterContainer toasts={toasts} removeToast={removeToast} />
    </ToasterContext.Provider>
  );
};

export default ToasterProvider