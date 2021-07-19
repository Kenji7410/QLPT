import { FC, RefObject, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { BillGridRef, BillModalRef, BillPageProps, IForeignKey } from './interface';
import BillModal from './Modal';
import BillGrid from './Grid';

const BillPage: FC<BillPageProps> = ({ onChangeTourStep }) => {
  const [edit, setEdit] = useState('');
  const billGridRef: RefObject<BillGridRef> = useRef(null);
  const billModalRef: RefObject<BillModalRef> = useRef(null);
  const [foreignKey, setForeignKey] = useState<IForeignKey>({
    room: [],
    unitPrice: []
  });
  const db = window.roomManagementSystemDB;

  const fetchForeignKeyData = async () => {
    const room = await db!.room!.toArray();
    const unitPrice = await db!.unitPrice!.toArray();
    setForeignKey({
      room,
      unitPrice
    });
  };

  useEffect(() => {
    fetchForeignKeyData();
    // eslint-disable-next-line
  }, []);

  const handleAdd = () => {
    billModalRef.current?.openModal();
    onChangeTourStep(17, 400);
  };

  const handleCancel = () => {
    setEdit('');
  };

  const handleOk = () => {
    if (edit) {
      setEdit('');
    }
    billGridRef.current?.fetchData();
    onChangeTourStep(18, 200);
  };

  return (
    <PageContainer
      extra={[
        <Button type='primary' onClick={handleAdd}>
          Thêm mới
        </Button>
      ]}
      header={{ title: 'Quản lý hóa đơn' }}
    >
      <BillGrid
        foreignKey={foreignKey}
        getBillModalRef={() => billModalRef.current!}
        onEdit={setEdit}
        ref={billGridRef}
      />
      <BillModal
        foreignKey={foreignKey}
        edit={edit}
        ref={billModalRef}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </PageContainer>
  );
};

export default BillPage;
