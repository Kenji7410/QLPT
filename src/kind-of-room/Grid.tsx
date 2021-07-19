import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip, Modal, message } from 'antd';
import ProCard from '@ant-design/pro-card';
import { AgGridReact } from 'ag-grid-react';
import { KindOfRoomGridProps, KindOfRoomGridRef } from './interface';

const KindOfRoomGrid = forwardRef<KindOfRoomGridRef, KindOfRoomGridProps>(
  ({ getKindOfRoomModalRef, onEdit }, ref) => {
    const db = window.roomManagementSystemDB;
    const [rowData, setRowData] = useState<IKindOfRoom[]>([]);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND'
    });

    const fetchData = async () => {
      setRowData(await db!.kindOfRoom!.toArray());
    };

    useImperativeHandle(ref, () => ({
      fetchData
    }));

    useEffect(() => {
      fetchData();
      // eslint-disable-next-line
    }, []);

    const handleDelete = async (data: IKindOfRoom) => {
      const room = await db!.room!.where({ kindOfRoomId: data.id }).toArray();

      if (room.length > 0) {
        message.error('Bạn không thể  loại phòng vì có phòng đã sử dụng');
        return;
      }

      Modal.warning({
        title: `Bạn có muốn xóa loại phòng ${data.name}?`,
        onOk: () => {
          db!
            .kindOfRoom!.where('code')
            .equals(data.code)
            .delete()
            .then(() => {
              message.success(`Xóa thành công!`);
              fetchData();
            });
        }
      });
    };

    const handleEdit = (data: IKindOfRoom) => {
      const { getForm, openModal } = getKindOfRoomModalRef();
      onEdit(data.id);
      openModal();
      getForm().setFieldsValue(data);
    };

    return (
      <ProCard style={{ height: window.innerHeight - 168 }} className='ag-theme-alpine'>
        <AgGridReact
          animateRows
          defaultColDef={{ floatingFilter: true, sortable: true, filter: true }}
          columnDefs={[
            { headerName: 'Mã', field: 'code', filter: 'agTextColumnFilter' },
            {
              headerName: 'Tên',
              field: 'name',
              filter: 'agTextColumnFilter'
            },
            {
              headerName: 'Giá',
              field: 'price',
              valueFormatter: params => formatter.format(params.value),
              filter: 'agTextColumnFilter'
            },
            {
              headerName: 'Tiền cọc',
              field: 'deposit',
              valueFormatter: params => formatter.format(params.value),
              filter: 'agTextColumnFilter'
            },
            {
              pinned: 'right',
              field: '',
              width: 100,
              floatingFilter: false,
              cellRendererFramework: (params: any) => (
                <>
                  <Tooltip title='Chỉnh sửa'>
                    <Button
                      onClick={() => handleEdit(params.data)}
                      icon={<EditOutlined />}
                      style={{ marginRight: 8 }}
                      type='primary'
                    />
                  </Tooltip>

                  <Tooltip title='Xóa'>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDelete(params.data)}
                    />
                  </Tooltip>
                </>
              )
            }
          ]}
          rowData={rowData}
        />
      </ProCard>
    );
  }
);

export default KindOfRoomGrid;
