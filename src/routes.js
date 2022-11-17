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
import OrderList from './sos/components/order/OrderList';
import OrderDetail from './sos/components/order/OrderDetail';
import CartManagementLayout from './sos/layouts/CartManagementLayout';
import CartDetail from './sos/components/cart/CartDetail';
import CartList from './sos/components/cart/CartList';
import VoucherList from './sos/components/voucher/VoucherList';
import VoucherManagementLayout from './sos/layouts/VoucherManagementLayout';
import CreateVoucher from './sos/components/voucher/CreateVoucher';

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
            {
              path: 'orders',
              element: <OrderManagementLayout />,
              children: [
                { path: '', element: <OrderList /> },
                { path: ':id', element: <OrderDetail /> },
              ]
            },
            {
              path: 'carts',
              element: <CartManagementLayout />,
              children: [
                { path: '', element: <CartList /> },
                { path: ':id', element: <CartDetail /> },
              ]
            },
            {
              path: 'vouchers',
              element: <VoucherManagementLayout />,
              children: [
                { path: '', element: <VoucherList /> },
                { path: 'create', element: <CreateVoucher /> },
              ]
            },
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
