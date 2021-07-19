import { FormInstance } from 'antd';

export interface KindOfRoomModalProps {
  edit: string;
  onOk: () => void;
  onCancel: () => void;
}

export interface KindOfRoomModalRef {
  getForm: () => FormInstance;
  openModal: () => void;
}

export interface KindOfRoomGridProps {
  getKindOfRoomModalRef: () => KindOfRoomModalRef;
  onEdit: (id: string) => void;
}

export interface KindOfRoomGridRef {
  fetchData: () => void;
}

export interface KindOfRoomPageProps {
  onChangeTourStep: (step: number, time?: number) => void;
}
