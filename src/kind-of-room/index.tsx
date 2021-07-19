import { FC, RefObject, useRef, useState } from 'react';
import { Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import KindOfRoomGrid from './Grid';
import KindOfRoomModal from './Modal';
import { KindOfRoomGridRef, KindOfRoomModalRef, KindOfRoomPageProps } from './interface';

const KindOfRoomPage: FC<KindOfRoomPageProps> = ({ onChangeTourStep }) => {
  const [edit, setEdit] = useState('');
  const kindOfRoomGridRef: RefObject<KindOfRoomGridRef> = useRef(null);
  const kindOfRoomModalRef: RefObject<KindOfRoomModalRef> = useRef(null);

  const handleAdd = () => {
    kindOfRoomModalRef.current!.openModal();
    onChangeTourStep(2, 200);
  };

  const handleOk = () => {
    if (edit) {
      setEdit('');
    }
    kindOfRoomGridRef.current!.fetchData();

    onChangeTourStep(3, 400);
  };

  return (
    <PageContainer
      extra={[
        <Button type='primary' onClick={handleAdd}>
          Thêm mới
        </Button>
      ]}
      header={{ title: 'Quản lý loại phòng' }}
    >
      <KindOfRoomGrid
        onEdit={setEdit}
        ref={kindOfRoomGridRef}
        getKindOfRoomModalRef={() => kindOfRoomModalRef.current!}
      />
      <KindOfRoomModal
        ref={kindOfRoomModalRef}
        edit={edit}
        onCancel={() => setEdit('')}
        onOk={handleOk}
      />
    </PageContainer>
  );
};

export default KindOfRoomPage;
