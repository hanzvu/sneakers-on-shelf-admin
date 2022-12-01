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
import TransactionManagementLayout from './sos/layouts/TransactionManagementLayout';
import TransactionList from './sos/components/transaction/TransactionList';
import AccountManagementLayout from './sos/layouts/AccountManagementLayout';
import AccountList from './sos/components/account/AccountList';
import AccountDetail from './sos/components/account/AccountDetail';
import ProductManagementLayout from './sos/layouts/ProductManagementLayout';
import ProductList from './sos/components/product/ProductList';
import ProductDetail from './sos/components/product/ProductDetail';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '',
      children: [
        { path: '', element: <Navigate to="/dashboard/orders?status=PENDING" replace /> },
        {
          path: '/dashboard',
          element:
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>,
          children: [
            { path: '', element: <Navigate to="/dashboard/orders?status=PENDING" replace /> },
            { path: 'statistic', element: <Statistical /> },
            {
              path: 'accounts',
              element: <AccountManagementLayout />,
              children: [
                { path: '', element: <AccountList /> },
                { path: ':id', element: <AccountDetail /> },
              ]
            },
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
              path: 'transactions',
              element: <TransactionManagementLayout />,
              children: [
                { path: '', element: <TransactionList /> },
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
            {
              path: 'products',
              element: <ProductManagementLayout />,
              children: [
                { path: '', element: <ProductList /> },
                { path: ':id', element: <ProductDetail /> },
              ]
            },
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
