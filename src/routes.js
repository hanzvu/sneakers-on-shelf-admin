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
import BrandManagementLayout from './sos/layouts/BrandManagementLayout';
import BrandList from './sos/components/brand/BrandList';
import CategoryManagementLayout from './sos/layouts/CategoryManagementLayout';
import CategoryList from './sos/components/category/CategoryList';
import AccountManagementLayout from './sos/layouts/AccountManagementLayout';
import AccountList from './sos/components/account/AccountList';
import AccountDetail from './sos/components/account/AccountDetail';
import ProductManagementLayout from './sos/layouts/ProductManagementLayout';
import ProductList from './sos/components/product/ProductList';
import ProductDetail from './sos/components/product/ProductDetail';
import GoogleFCMListener from './sos/components/fcm/GoogleFCMListener';
import StaffManagementLayout from './sos/layouts/StaffManagementLayout';
import StaffList from './sos/components/staff/StaffList';
import StaffDetail from './sos/components/staff/StaffDetail';
import MemberOfferPolicyList from './sos/components/member-offer-policy/MemberOfferPolicyList';
import MaterialManagementLayout from './sos/layouts/MaterialManagementLayout';
import MaterialList from './sos/components/material/MaterialList';
import ColorList from './sos/components/color/ColorList';
import ColorManagementLayout from './sos/layouts/ColorManagementLayout';

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
              <GoogleFCMListener />
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
              path: 'staff',
              element: <StaffManagementLayout />,
              children: [
                { path: '', element: <StaffList /> },
                { path: ':id', element: <StaffDetail /> },
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
            {
              path: 'brand',
              element: <BrandManagementLayout />,
              children: [
                { path: '', element: <BrandList /> },
              ]
            },
            {
              path: 'category',
              element: <CategoryManagementLayout />,
              children: [
                { path: '', element: <CategoryList /> }
              ]
            },
            {
              path: 'material',
              element: <MaterialManagementLayout />,
              children: [
                { path: '', element: <MaterialList /> }
              ]
            },
            {
              path: 'color',
              element: <ColorManagementLayout />,
              children: [
                { path: '', element: <ColorList /> }
              ]
            },
            { path: 'member-offer', element: <MemberOfferPolicyList /> },
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
