import { FC, useContext, useEffect, useRef, useState } from 'react';
import { Avatar, Menu, Dropdown, Modal } from 'antd';
import type { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import ProLayout from '@ant-design/pro-layout';
import { Link, Switch, Route, BrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { tourSteps } from './tourSteps';
import { AuthenticationContext } from '../authentication-provider';
import AnalysisPage from '../analysis';
import RoomPage from '../room';
import KindOfRoomPage from '../kind-of-room';
import CustomerPage from '../customer';
import AgreementPage from '../agreement';
import UnitPricePage from '../unitPrice';
import BillPage from '../bill';
import EquipmentPage from '../equipment';
import Tour from 'reactour';

const Dashboard: FC = () => {
  const [tourStep, setTourStep] = useState(0);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [pathname, setPathname] = useState('/analysis');
  const { setAuthenticate } = useContext(AuthenticationContext);
  const timeout = useRef<any>(null);
  const hasTourGuide = useRef(localStorage.getItem('TOUR_GUIDE'));

  useEffect(() => {
    if (!hasTourGuide.current) {
      localStorage.setItem('TOUR_GUIDE', 'TOUR_GUIDE');
      Modal.confirm({
        content: 'Bắt đầu hướng dẫn?',
        onOk: () => {
          setIsTourOpen(true);
        }
      });
    }
  }, []);

  const handleTourClose = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    timeout.current = setTimeout(() => {
      setIsTourOpen(false);
    }, 3000);
  };

  const handleListItemClick = (path: string) => {
    setPathname(path!);

    if (hasTourGuide.current) {
      return;
    }
    if (path === '/kind-of-room') {
      setTourStep(1);
    }

    if (path === '/room') {
      setTourStep(4);
    }

    if (path === '/customer') {
      setTourStep(7);
    }

    if (path === '/agreement') {
      setTourStep(10);
    }

    if (path === '/unit-price') {
      setTourStep(13);
    }

    if (path === '/bill') {
      setTourStep(16);
    }

    if (path === '/analysis' && tourStep === 18) {
      setTourStep(19);
      handleTourClose();
    }
  };

  const handleUserMenuClick: MenuClickEventHandler = e => {
    if (e.key === 'logout') {
      setAuthenticate(false);
      localStorage.removeItem('access-token');
    }
  };

  const renderUserMenu = () => (
    <Menu onClick={handleUserMenuClick}>
      <Menu.Item key='logout' icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const handleChangeTourStep = (step: number, time?: number) => {
    if (time) {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }

      timeout.current = setTimeout(() => {
        setTourStep(step);
      }, time);
    } else {
      setTourStep(step);
    }
  };

  return (
    <BrowserRouter basename='/room-management-system'>
      <ProLayout
        {...routes}
        location={{
          pathname
        }}
        title='Quản lý phòng trọ'
        logo={null}
        rightContentRender={() => (
          <Dropdown overlay={renderUserMenu()}>
            <Avatar size='small' icon={<UserOutlined />} />
          </Dropdown>
        )}
        menuItemRender={(item, dom) => (
          <Link to={item.path!} onClick={() => handleListItemClick(item.path!)}>
            {dom}
          </Link>
        )}
        fixSiderbar
      >
        <Switch>
          <Route render={() => <AnalysisPage />} key='analysis' path='/analysis' />
          <Route
            render={() => <RoomPage onChangeTourStep={handleChangeTourStep} />}
            key='room'
            path='/room'
          />
          <Route
            render={() => <CustomerPage onChangeTourStep={handleChangeTourStep} />}
            key='customer'
            path='/customer'
          />
          <Route
            render={() => <AgreementPage onChangeTourStep={handleChangeTourStep} />}
            key='agreement'
            path='/agreement'
          />
          <Route
            render={() => <KindOfRoomPage onChangeTourStep={handleChangeTourStep} />}
            key='kind-of-room'
            path='/kind-of-room'
          />
          <Route
            render={() => <UnitPricePage onChangeTourStep={handleChangeTourStep} />}
            key='unit-price'
            path='/unit-price'
          />
          <Route
            render={() => <BillPage onChangeTourStep={handleChangeTourStep} />}
            key='bill'
            path='/bill'
          />
          <Route render={() => <EquipmentPage />} key='equipment' path='/equipment' />
        </Switch>
        <Tour
          steps={tourSteps}
          disableFocusLock
          showCloseButton={false}
          showButtons={false}
          showNavigation={false}
          goToStep={tourStep}
          isOpen={isTourOpen}
          disableKeyboardNavigation
          onRequestClose={() => setIsTourOpen(false)}
        />
      </ProLayout>
    </BrowserRouter>
  );
};

export default Dashboard;
