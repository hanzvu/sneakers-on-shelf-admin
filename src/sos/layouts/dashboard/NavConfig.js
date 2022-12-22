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
    title: 'Quản Lý Đơn Hàng',
    path: '/dashboard/orders',
    icon: getIcon('fa:cart-arrow-down'),
  },
  {
    title: 'Bán Hàng Tại Quầy',
    path: '/dashboard/carts',
    icon: getIcon('fa:cart-plus'),
  },
  {
    title: 'Quản Lý Thu Chi',
    path: '/dashboard/transactions',
    icon: getIcon('fa6-solid:money-bill-transfer'),
  },
  {
    title: 'Quản Lý Tài Khoản',
    icon: getIcon('eva:people-fill'),
    children: [
      {
        title: 'Nhân Viên',
        path: '/dashboard/staff',
      },
      {
        title: 'Khách Hàng',
        path: '/dashboard/accounts',
      },
    ]
  },
  {
    title: 'Quản Lý Sản Phẩm',
    icon: getIcon('eva:shopping-bag-fill'),
    children: [
      {
        title: 'Sản Phẩm',
        path: '/dashboard/products',
      },
      {
        title: 'Nhãn Hiệu',
        path: '/dashboard/brand',
      },
      {
        title: 'Danh Mục',
        path: '/dashboard/category'
      },
      {
        title: 'Màu Sắc',
        path: '/dashboard/color'
      },
      {
        title: 'Đế Giày',
        path: '/dashboard/sole'
      },
      {
        title: 'Chất Liệu',
        path: '/dashboard/material'
      },

    ]
  },
  {
    title: 'Khuyến Mại',
    icon: getIcon('mdi:user-heart'),
    children: [
      {
        title: 'Mã Giảm Giá',
        path: '/dashboard/vouchers',
      },
      {
        title: 'Ưu Đãi Thành Viên',
        path: '/dashboard/member-offer',
      },
    ]
  }
];

export default navConfig;
