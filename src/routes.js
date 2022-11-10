import { Navigate, useRoutes } from 'react-router-dom';
// layouts
//
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import Statistical from './sos/layouts/StatisticLayout';
import LoginLayout from './sos/layouts/LoginLayout';
import OAuthRedirected from './sos/components/login/OAuthRedirected';
import DashboardLayout from './sos/layouts/dashboard';
import ProtectedRoute from './sos/components/login/ProtectedRoute';
import OrderManagementLayout from './sos/layouts/OrderManagementLayout';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '',
      children: [
        { path: '', element: <Navigate to="/dashboard" replace /> },
        {
          path: '/dashboard',
          element:
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>,
          children: [
            { path: '', element: <Statistical /> },
            { path: 'app', element: <DashboardApp /> },
            { path: 'user', element: <User /> },
            { path: 'orders', element: <OrderManagementLayout /> },
            { path: 'products', element: <Products /> },
            { path: 'blog', element: <Blog /> },
          ],
        },
        {
          path: 'oauth2',
          children: [
            { path: 'redirect', element: <OAuthRedirected /> },
          ],
        },
        {
          path: 'register',
          element: <Register />,
        },
        {
          path: 'login',
          element: <LoginLayout />,
        },
        { path: '/404', element: <NotFound /> }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
