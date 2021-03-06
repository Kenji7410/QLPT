import { FC, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, message, Tooltip, Select, DatePicker } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';

interface IForeignKey {
  room: IRoom[];
  customer: ICustomer[];
}

export interface AgreementPageProps {
  onChangeTourStep: (step: number, time?: number) => void;
}

const AgreementPage: FC<AgreementPageProps> = ({ onChangeTourStep }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [rowData, setRowData] = useState<IAgreement[]>([]);
  const [edit, setEdit] = useState('');
  const [form] = Form.useForm<Omit<IAgreement, 'id'>>();
  const [foreignKey, setForeignKey] = useState<IForeignKey>({
    room: [],
    customer: []
  });
  const db = window.roomManagementSystemDB;

  const fetchData = async () => {
    setRowData(await db!.agreement!.toArray());
  };

  const fetchForeignKeyData = async () => {
    const room = await db!.room!.toArray();
    const customer = await db!.customer!.toArray();
    setForeignKey({
      room,
      customer
    });
  };

  useEffect(() => {
    fetchData();
    fetchForeignKeyData();
    // eslint-disable-next-line
  }, []);

  const handleEdit = ({ date, ...rest }: Omit<IAgreement, 'date'> & { date: string }) => {
    const tempDate = JSON.parse(date);
    setEdit(rest.id);
    setVisibleModal(true);
    form.setFieldsValue({
      date: [moment(tempDate[0]), moment(tempDate[1])],
      ...rest
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(async ({ date, ...rest }) => {
      const value = { date: [date[0].valueOf(), date[1].valueOf()], ...rest };

      const data = await db!.agreement!.where('code').equals(value.code).toArray();

      if (data.filter(({ id }) => (edit ? edit !== id : id)).length > 0) {
        message.error(`H???p ?????ng ${value.code} ???? t???n t???i!`);
        return;
      }

      const usedCustomers = rowData
        .filter(agreement => (edit ? edit !== agreement.id : agreement.id))
        .filter(
          agreement =>
            agreement.customerIds.filter(customerId => value.customerIds.includes(customerId))
              .length > 0
        );

      const usedRooms = rowData
        .filter(agreement => (edit ? edit !== agreement.id : agreement.id))
        .filter(agreement => agreement.roomId === value.roomId);

      if (usedRooms.length > 0) {
        message.error(`Ph??ng ???? ???????c s??? d???ng!`);
        return;
      }

      if (usedCustomers.length > 0) {
        message.error(`C?? kh??ch h??ng ??ang ??? ph??ng kh??c!`);
        return;
      }

      if (edit) {
        db!.agreement!.update(edit, value).then(updated => {
          if (updated) {
            message.success('C???p nh???t th??nh c??ng!');
            setVisibleModal(false);
            setEdit('');
            form.resetFields();
            fetchData();
          } else {
            message.error('C???p nh???t th???t b???i!');
          }
        });
        return;
      }

      db!
        .agreement!.add({
          id: uuidv4(),
          ...value
        })
        .then(async () => {
          message.success('T???o th??nh c??ng!');
          setVisibleModal(false);
          form.resetFields();
          await db!.room!.update(value.roomId, { stillEmpty: true });
          fetchData();
        });
    });

    onChangeTourStep(12, 200);
  };

  const handleModalCancel = () => {
    setVisibleModal(false);
    setEdit('');
    form.resetFields();
  };

  const handleDeleteData = (data: IAgreement) => {
    Modal.warning({
      title: `B???n c?? mu???n x??a h???p ?????ng ${data.code}?`,
      onOk: () => {
        db!
          .agreement!.where('code')
          .equals(data.code)
          .delete()
          .then(async () => {
            message.success(`X??a th??nh c??ng!`);
            await db!.room!.update(data.roomId, { stillEmpty: false });
            fetchData();
          });
      }
    });
  };

  return (
    <>
      <PageContainer
        extra={[
          <Button
            type='primary'
            onClick={() => {
              setVisibleModal(true);
              onChangeTourStep(11, 400);
            }}
          >
            Th??m m???i
          </Button>
        ]}
        header={{ title: 'Qu???n l?? h???p ?????ng' }}
      >
        <ProCard style={{ height: window.innerHeight - 168 }} className='ag-theme-alpine'>
          <AgGridReact
            animateRows
            defaultColDef={{ floatingFilter: true, sortable: true, filter: true, resizable: true }}
            columnDefs={[
              { headerName: 'M??', field: 'code', filter: 'agTextColumnFilter' },
              {
                headerName: 'Ph??ng',
                field: 'room',
                filter: 'agTextColumnFilter'
              },
              {
                headerName: 'Kh??ch h??ng',
                field: 'customer',
                filter: 'agTextColumnFilter'
              },
              {
                headerName: 'Th???i h???n',
                field: 'formatDate',
                filter: 'agTextColumnFilter'
              },
              {
                pinned: 'right',
                field: '',
                width: 100,
                floatingFilter: false,
                cellRendererFramework: (params: any) => (
                  <>
                    <Tooltip title='Ch???nh s???a'>
                      <Button
                        onClick={() => handleEdit(params.data)}
                        icon={<EditOutlined />}
                        style={{ marginRight: 8 }}
                        type='primary'
                      />
                    </Tooltip>

                    <Tooltip title='X??a'>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteData(params.data)}
                      />
                    </Tooltip>
                  </>
                )
              }
            ]}
            rowData={rowData.map(({ date, ...rest }) => ({
              room: foreignKey.room!.find(room => room.id === rest.roomId)?.name,
              date: JSON.stringify(date),
              formatDate: `t??? ${moment(date[0]).format('MM/YYYY')} ?????n ${moment(date[1]).format(
                'MM/YYYY'
              )}`,
              customer: foreignKey.customer
                .filter(customer => rest.customerIds.includes(customer.id))
                .map(customer => customer.fullName)
                .join(', '),
              ...rest
            }))}
          />
        </ProCard>
      </PageContainer>

      <Modal
        visible={visibleModal}
        title={edit ? 'Ch???nh s???a' : 'Th??m h???p ?????ng m???i'}
        centered
        cancelText='H???y'
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form name='add-form' form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label='M??' name='code' rules={[{ required: true, message: 'H??y nh???p m??!' }]}>
            <Input autoFocus />
          </Form.Item>

          <Form.Item
            label='Ph??ng'
            name='roomId'
            rules={[{ required: true, message: 'H??y ch???n ph??ng!' }]}
          >
            <Select>
              {foreignKey.room!.map(room => (
                <Select.Option value={room.id} key={room.id}>
                  {room.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label='Kh??ch h??ng'
            name='customerIds'
            rules={[{ required: true, message: 'H??y ch???n kh??ch h??ng!' }]}
          >
            <Select mode='multiple'>
              {foreignKey.customer!.map(customer => (
                <Select.Option value={customer.id} key={customer.id}>
                  {customer.fullName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label='Th???i h???n'
            name='date'
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: 'H??y ch???n th???i h???n!' }]}
          >
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              picker='month'
              format={['MM/YYYY', 'MM/YYYY']}
              ranges={{
                '1 th??ng': [moment(), moment().add(1, 'months')],
                '3 th??ng': [moment(), moment().add(3, 'months')],
                '6 th??ng': [moment(), moment().add(6, 'months')],
                '1 n??m': [moment(), moment().add(12, 'months')]
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AgreementPage;
