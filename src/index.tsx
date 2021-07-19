import React from 'react';
import ReactDOM from 'react-dom';
import Dexie from 'dexie';
import { ConfigProvider } from 'antd';
import { LicenseManager } from 'ag-grid-enterprise';
import viVN from 'antd/lib/locale/vi_VN';
import 'moment/locale/vi';
import App from './App';
import AuthenticationProvider from './authentication-provider';
import reportWebVitals from './reportWebVitals';
import './style';

LicenseManager.setLicenseKey(
  '[TRIAL]_16_May_2020_[v2]_MTU4OTU4NzIwMDAwMA==b03f1f5b63303eabbc3b42a734fcc666'
);

window.roomManagementSystemDB = new Dexie('room-management-system');
window.roomManagementSystemDB!.version(1).stores({
  account: 'id,username,password',
  room: 'id,code,name,stillEmpty,kindOfRoomId',
  kindOfRoom: 'id,code,name,price,deposit',
  agreement: 'id,code,roomId,customerIds,date',
  customer: 'id,code,fullName,identityCardNumber,dateOfBirth,sex,address,phoneNumber,job',
  unitPrice: 'id,code,water,electricity,parking,junkMoney,date',
  bill: 'id,code,amountOfWater,amountOfElectricity,numberOfVehicles,date,formatDate,roomId',
  equipment: 'id,code,name,number'
});

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={viVN}>
      <AuthenticationProvider>
        <App />
      </AuthenticationProvider>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
