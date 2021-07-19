/// <reference types="react-scripts" />

declare interface IAccount {
  id: string;
  username: string;
  password: string;
}

declare interface IRoom {
  id: string;
  code: string;
  name: string;
  stillEmpty: boolean;
  kindOfRoomId: string;
}

declare interface IKindOfRoom {
  id: string;
  code: string;
  name: string;
  price: number;
  deposit: number;
}

declare interface IBill {
  id: string;
  code: string;
  amountOfWater: number;
  amountOfElectricity: number;
  numberOfVehicles: number;
  date: number;
  formatDate: string;
  roomId: string;
}

declare interface IAgreement {
  id: string;
  code: string;
  roomId: string;
  customerIds: string[];
  date: number[];
}

declare interface ICustomer {
  id: string;
  code: string;
  fullName: string;
  identityCardNumber: number;
  dateOfBirth: number;
  sex: string;
  address: string;
  phoneNumber: number;
  job: string;
}

declare interface IUnitPrice {
  id: string;
  code: string;
  water: number;
  electricity: number;
  parking: number;
  junkMoney: number;
  date: number;
}

declare interface IEquipment {
  id: string;
  code: string;
  name: string;
  number: string;
}

declare interface Window {
  roomManagementSystemDB?: import('dexie').Dexie & {
    account?: import('dexie').Table<IAccount>;
    room?: import('dexie').Table<IRoom>;
    kindOfRoom?: import('dexie').Table<IKindOfRoom>;
    agreement?: import('dexie').Table<IAgreement>;
    customer?: import('dexie').Table<ICustomer>;
    unitPrice?: import('dexie').Table<IUnitPrice>;
    bill?: import('dexie').Table<IBill>;
    equipment?: import('dexie').Table<IEquipment>;
  };
}
