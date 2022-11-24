// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Thống Kê',
    path: '/dashboard/statistic',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Đơn Hàng',
    path: '/dashboard/orders?status=PENDING',
    icon: getIcon('fa:cart-arrow-down'),
  },
  {
    title: 'Tạo Đơn Hàng',
    path: '/dashboard/carts',
    icon: getIcon('fa:cart-plus'),
  },
  {
    title: 'Thu Chi',
    path: '/dashboard/transactions',
    icon: getIcon('fa6-solid:money-bill-transfer'),
  },
  {
    title: 'Mã Giảm Giá',
    path: '/dashboard/vouchers',
    icon: getIcon('mdi:voucher'),
  },
  {
    title: 'Tài Khoản',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Sản Phẩm',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
];

export default navConfig;
