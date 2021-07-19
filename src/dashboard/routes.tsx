import {
  BarChartOutlined,
  BankOutlined,
  BranchesOutlined,
  SmileOutlined,
  PaperClipOutlined,
  DollarOutlined,
  FileOutlined,
  ScissorOutlined
} from '@ant-design/icons';

export const routes = {
  route: {
    path: '/',
    routes: [
      {
        path: '/analysis',
        name: 'Thống kê',
        icon: <BarChartOutlined />,
        component: './Analysis'
      },
      {
        path: '/room',
        name: 'Quản lý phòng',
        icon: <BankOutlined />,
        component: './Room'
      },
      {
        path: '/kind-of-room',
        name: 'Quản lý loại phòng',
        icon: <BranchesOutlined />,
        component: './KindOfRoom'
      },
      {
        path: '/customer',
        name: 'Quản lý khách hàng',
        icon: <SmileOutlined />,
        component: './Customer'
      },
      {
        path: '/agreement',
        name: 'Quản lý hợp đồng',
        icon: <PaperClipOutlined />,
        component: './Agreement'
      },
      {
        path: '/unit-price',
        name: 'Quản lý đơn giá',
        icon: <DollarOutlined />,
        component: './UnitPrice'
      },
      {
        path: '/bill',
        name: 'Quản lý hóa đơn',
        icon: <FileOutlined />,
        component: './Bill'
      },
      {
        path: '/equipment',
        name: 'Quản lý trang thiết bị',
        icon: <ScissorOutlined />,
        component: './Equipment'
      }
    ]
  },
  location: {
    pathname: '/'
  }
};
