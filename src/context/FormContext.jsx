import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export function useFormContext() {
  return useContext(FormContext);
}

export function FormProvider({ children }) {
  const [isDailyBoxesValid, setIsDailyBoxesValid] = useState(false);
  const [isStyleValid, setIsStyleValid] = useState(false);
  const [isPreviewValid, setIsPreviewValid] = useState(false);

  return (
    <FormContext.Provider
      value={{
        isDailyBoxesValid,
        setIsDailyBoxesValid,
        isStyleValid,
        setIsStyleValid,
        isPreviewValid,
        setIsPreviewValid,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
