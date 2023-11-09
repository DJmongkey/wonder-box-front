import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export function useFormContext() {
  return useContext(FormContext);
}

export function FormProvider({ children }) {
  const [visitedTabs, setVisitedTabs] = useState({
    baseinfo: true,
    dailyboxes: false,
    style: false,
  });

  return (
    <FormContext.Provider value={{ visitedTabs, setVisitedTabs }}>
      {children}
    </FormContext.Provider>
  );
}
