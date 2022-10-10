import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import ProductManager from './pages/ProductManager';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductCreate from './sosProduct/layouts/FormCreate';
import ProductUpdate from './sosProduct/layouts/FormUpdate';
import DashboardApp from './pages/DashboardApp';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
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
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
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
