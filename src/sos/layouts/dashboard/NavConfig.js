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
    path: '/dashboard/orders',
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
    title: 'Tài Khoản',
    path: '/dashboard/accounts',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Sản Phẩm',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'Nhãn Hiệu',
    path: '/dashboard/brand',
    icon: getIcon('eva:pricetags-fill'),
  },
  {
    title: 'Danh Mục',
    path: '/dashboard/category',
    icon: getIcon('eva:list-fill')
  },
  {
    title: 'Mã Giảm Giá',
    path: '/dashboard/vouchers',
    icon: getIcon('mdi:voucher'),
  },
];

export default navConfig;
