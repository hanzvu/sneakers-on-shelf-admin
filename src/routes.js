import { Navigate, useRoutes } from 'react-router-dom';
// layouts
//
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductCreate from './sos/sosProduct/layouts/FormCreate';
import ProductUpdate from './sos/sosProduct/layouts/FormUpdate';
import DashboardApp from './pages/DashboardApp';
import ProductManager from './sos/sosProduct/layouts/ProductManager';
import Statistical from './sos/layouts/StatisticLayout';
import LoginLayout from './sos/layouts/LoginLayout';
import OAuthRedirected from './sos/components/login/OAuthRedirected';
import DashboardLayout from './sos/layouts/dashboard';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <Statistical /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'ProductManager', element: <ProductManager /> },
        { path: 'productCreate', element: <ProductCreate /> },
        { path: 'productUpdate', element: <ProductUpdate /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
      ],
    },
    {
      path: 'login',
      element: <LoginLayout />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: 'oauth2',
      children: [
        { path: 'redirect', element: <OAuthRedirected /> },
      ],
    },
    {
      path: '',
      children: [
        { path: '', element: <Navigate to="/dashboard" replace /> },
        { path: '/404', element: <NotFound /> }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
