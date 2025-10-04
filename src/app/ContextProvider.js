'use client';

import { createContext, useState } from 'react';

export const AppContext = createContext();

export default function ContextProvider({ children }) {
  const [context, setContext] = useState({
    organization: 'Acme Corp', // Example default
    project: 'Default', // Example default
    module: 'Dashboard',
    subscription: 'Basic',
    location: '',
  });

  return (
    <AppContext.Provider value={{ context, setContext }}>
      {children}
    </AppContext.Provider>
  );
}