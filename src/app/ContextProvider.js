'use client';

import { createContext, useState } from 'react';

export const AppContext = createContext();

export default function ContextProvider({ children }) {
  const [context, setContext] = useState({
    customer: '',
    subscription: '',
    profile: '',
  });

  return (
    <AppContext.Provider value={{ context, setContext }}>
      {children}
    </AppContext.Provider>
  );
}