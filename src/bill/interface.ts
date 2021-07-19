import { FormInstance } from 'antd';

export interface IForeignKey {
  room: IRoom[];
  unitPrice: IUnitPrice[];
}

export interface IPrintData {
  room: string;
  electricityBill: string;
  amountOfElectricity: string;
  waterBill: string;
  amountOfWater: string;
  parkingFee: string;
  junkMoney: string;
  total: string;
}

export interface BillPageProps {
  onChangeTourStep: (step: number, time?: number) => void;
}

export interface BillModalProps {
  edit: string;
  foreignKey: IForeignKey;
  onOk: () => void;
  onCancel: () => void;
}

export interface BillModalRef {
  getForm: () => FormInstance;
  openModal: () => void;
}

export interface BillGridProps {
  foreignKey: IForeignKey;
  getBillModalRef: () => BillModalRef;
  onEdit: (id: string) => void;
}

export interface BillGridRef {
  fetchData: () => void;
}
