'use client';
import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '8px',
          background: '#0D1F29',
          color: '#fff',
          fontSize: '14px',
        },
      }}
    />
  );
}
