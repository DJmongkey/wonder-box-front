import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App';
import NotFound from './pages/NotFound';
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CalendarList from './pages/CalendarList';
import BaseInfoForm from './pages/BaseInfoForm';
import CustomFormLayout from './components/shared/CustomFormLayout';
import DailyBoxesForm from './pages/DailyBoxesForm';
import StyleForm from './pages/StyleForm';
import SharedCalendar from './pages/SharedCalendar';
import { AuthContextProvider } from './context/AuthContext';

import './index.scss';
import './style.scss';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Main /> },
      { path: 'calendars', element: <CalendarList /> },
      {
        path: 'custom/',
        element: <CustomFormLayout />,
        children: [
          { path: 'base-info', element: <BaseInfoForm /> },
          { path: 'base-info/:calendarId', element: <BaseInfoForm /> },
          { path: 'daily-boxes/:calendarId', element: <DailyBoxesForm /> },
          { path: 'style/:calendarId', element: <StyleForm /> },
        ],
      },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/calendars/:calendarId/share', element: <SharedCalendar /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>,
);
