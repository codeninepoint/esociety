'use client';

import { createContext, useState } from 'react';

export const AppContext = createContext();

export default function ContextProvider({ children }) {
  const [context, setContext] = useState({
    // Store organization id and name separately so BFF calls can pass id upstream
    organizationId: '',
    organizationName: 'Acme Corp', // Example default name
    project: 'Default', // Example default
    module: 'Societies',
    subscription: 'Basic',
    location: '',
  });

  return (
    <AppContext.Provider value={{ context, setContext }}>
      {children}
    </AppContext.Provider>
  );
}