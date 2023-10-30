import { Outlet } from 'react-router-dom';
import Header from './components/shared/Header';
import { AuthContextProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthContextProvider>
      <Header />
      <Outlet />
    </AuthContextProvider>
  );
}
