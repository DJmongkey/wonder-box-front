import { Outlet, useLocation } from 'react-router-dom';

import { FormProvider } from '../../context/FormContext';
import Navbar from './Navbar';
import BaseInfoForm from '../../pages/BaseInfoForm';

export default function CustomFormLayout() {
  const location = useLocation();

  return (
    <>
      <FormProvider>
        <Navbar />
        {location.pathname === '/custom' || location.pathname === '/custom/' ? (
          <BaseInfoForm />
        ) : (
          <Outlet />
        )}
      </FormProvider>
    </>
  );
}
