"use client";

import React, { createContext, useContext } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';
import CustomSnackbar from '@/components/common/CustomSnackbar';

interface SnackbarContextType {
  showSnackbar: (message: string, severity: "success" | "error" | "warning" | "info") => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

export const useGlobalSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useGlobalSnackbar must be used within a SnackbarProvider');
  }
  return context;
};