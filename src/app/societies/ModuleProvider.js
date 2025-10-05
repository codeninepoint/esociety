'use client';

import { createContext, useState } from 'react';

export const ModuleContext = createContext();

export default function ModuleProvider({ children }) {
  const [moduleContext, setModuleContext] = useState({
    society_code: '',
    society_name: '',
  });

  return (
    <ModuleContext.Provider value={{ moduleContext, setModuleContext }}>
      {children}
    </ModuleContext.Provider>
  );
}
