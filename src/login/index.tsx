/* eslint jsx-a11y/anchor-is-valid:0 */
import { FC, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Form, Button, Input, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { sign } from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcryptjs';
import { RouteComponentProps, StaticContext } from 'react-router';
import { AuthenticationContext } from '../authentication-provider';
import { getTokenEncryptSecret } from '../utils/getTokenEncryptSecret';
import { getPasswordHashSalt } from '../utils/getPasswordHashSalt';
import './style';

interface LoginPageProps extends RouteComponentProps<{}, StaticContext, unknown> {}

const LoginPage: FC<LoginPageProps> = () => {
  const [form] = Form.useForm<Omit<IAccount, 'id'> & { remember: boolean }>();
  const [registration, setRegistration] = useState(false);
  const { setAuthenticate } = useContext(AuthenticationContext);
  const db = window.roomManagementSystemDB;

  const handleLogin = () => {
    form.validateFields().then(async ({ username, password, remember }) => {
      const data = await db!.account!.where('username').equals(username).toArray();

      if (registration) {
        if (data.length > 0) {
          message.error('Tài khoản đã tồn tại!');
        } else {
          db!
            .account!.add({
              id: uuidv4(),
              username,
              password: hashSync(password, getPasswordHashSalt())
            })
            .then(() => {
              message.success('Tạo tài khoản thành công!');
              setRegistration(false);
              form.resetFields();
            });
        }
      } else {
        if (data.length > 0 && compareSync(password, data[0].password)) {
          const token = sign({ username, password }, getTokenEncryptSecret(), {
            expiresIn: '7d'
          });
          setAuthenticate(true);
          if (remember) {
            localStorage.setItem('access-token', token);
          }
        } else {
          message.error('Tên đăng nhập hoặc mật khẩu sai!');
        }
      }
    });
  };

  return (
    <div className='login-page'>
      <div className='login-box'>
        <div className='login-title'>{registration ? 'Đăng kí' : 'Đăng nhập'}</div>

        <Form name='normal_login' className='login-form' form={form}>
          <Form.Item
            name='username'
            rules={[{ required: true, message: 'Hãy nhập tên đăng nhập của bạn!' }]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Tên đăng nhập'
              onPressEnter={handleLogin}
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Hãy nhập mật khẩu của bạn!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Mật khẩu'
              onPressEnter={handleLogin}
            />
          </Form.Item>

          {registration || (
            <Form.Item>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>Giữ tôi luôn đăng nhập</Checkbox>
              </Form.Item>

              <a className='login-form-forgot'>Quên mật khẩu</a>
            </Form.Item>
          )}

          <Form.Item>
            <Button type='primary' onClick={handleLogin} className='login-form-button'>
              {registration ? 'Đăng kí' : 'Đăng nhập'}
            </Button>
          </Form.Item>

          <Form.Item noStyle>
            Hoặc{' '}
            <a
              onClick={() => {
                setRegistration(prev => !prev);
                form.resetFields();
              }}
            >
              {registration ? 'đăng nhập' : 'đăng kí ngay!'}
            </a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
