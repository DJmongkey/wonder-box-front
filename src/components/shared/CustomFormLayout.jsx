import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BaseInfoForm from '../../pages/BaseInfoForm';

export default function CustomFormLayout() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      {location.pathname === '/custom' || location.pathname === '/custom/' ? (
        <BaseInfoForm />
      ) : (
        <Outlet />
      )}
    </>
  );
}
