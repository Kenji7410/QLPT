import { FC, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Form, InputNumber, message, Tooltip, DatePicker } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { ValueFormatterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';

export interface UnitPricePageProps {
  onChangeTourStep: (step: number, time?: number) => void;
}

const UnitPricePage: FC<UnitPricePageProps> = ({ onChangeTourStep }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [rowData, setRowData] = useState<IUnitPrice[]>([]);
  const [edit, setEdit] = useState('');
  const [form] = Form.useForm<Omit<IUnitPrice, 'id' | 'code' | 'date'> & { date: moment.Moment }>();
  const db = window.roomManagementSystemDB;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND'
  });

  const fetchData = async () => {
    setRowData(await db!.unitPrice!.toArray());
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleEdit = ({ date, ...rest }: Omit<IRoom, 'date'> & { date: moment.Moment }) => {
    setEdit(rest.id);
    setVisibleModal(true);
    form.setFieldsValue({
      date: moment(date),
      ...rest
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(async ({ date, ...rest }) => {
      const value = { date: date?.valueOf(), code: moment(date).format('MM/YYYY'), ...rest };

      const data = await db!.unitPrice!.where('code').equals(value.code).toArray();

      if (data.filter(({ id }) => (edit ? edit !== id : id)).length > 0) {
        message.error(`Đơn giá tháng ${data[0].code} đã tồn tại!`);
        return;
      }

      if (edit) {
        db!.unitPrice!.update(edit, value).then(updated => {
          if (updated) {
            message.success('Cập nhật thành công!');
            setVisibleModal(false);
            setEdit('');
            form.resetFields();
            fetchData();
          } else {
            message.error('Cập nhật thất bại!');
          }
        });
        return;
      }

      db!
        .unitPrice!.add({
          id: uuidv4(),
          ...value
        })
        .then(() => {
          message.success('Tạo thành công!');
          setVisibleModal(false);
          form.resetFields();
          fetchData();
        });
    });

    onChangeTourStep(15, 200);
  };

  const handleModalCancel = () => {
    setVisibleModal(false);
    setEdit('');
    form.resetFields();
  };

  const handleDeleteData = (data: IUnitPrice) => {
    Modal.warning({
      title: `Bạn có muốn xóa đơn giá tháng ${data.code}?`,
      onOk: () => {
        db!
          .unitPrice!.where('code')
          .equals(data.code)
          .delete()
          .then(() => {
            message.success(`Xóa thành công!`);
            fetchData();
          });
      }
    });
  };

  const dateValueFormatter = (params: ValueFormatterParams) =>
    params.value && moment(+params.value).format('MM/YYYY');

  return (
    <>
      <PageContainer
        extra={[
          <Button
            type='primary'
            onClick={() => {
              setVisibleModal(true);
              onChangeTourStep(14, 400);
            }}
          >
            Thêm mới
          </Button>
        ]}
        header={{ title: 'Quản lý đơn giá' }}
      >
        <ProCard style={{ height: window.innerHeight - 168 }} className='ag-theme-alpine'>
          <AgGridReact
            animateRows
            defaultColDef={{ floatingFilter: true, sortable: true, filter: true }}
            columnDefs={[
              {
                headerName: 'Đơn giá điện',
                field: 'electricity',
                filter: 'agTextColumnFilter',
                valueFormatter: params => formatter.format(params.value)
              },
              {
                headerName: 'Đơn giá nước',
                field: 'water',
                filter: 'agTextColumnFilter',
                valueFormatter: params => formatter.format(params.value)
              },
              {
                headerName: 'Tiền giữ xe',
                field: 'parking',
                filter: 'agTextColumnFilter',
                valueFormatter: params => formatter.format(params.value)
              },
              {
                headerName: 'Tiền rác',
                field: 'junkMoney',
                filter: 'agTextColumnFilter',
                valueFormatter: params => formatter.format(params.value)
              },
              {
                headerName: 'Thời gian',
                field: 'date',
                filterParams: {
                  valueFormatter: dateValueFormatter
                },
                valueFormatter: dateValueFormatter
              },
              {
                pinned: 'right',
                field: '',
                width: 100,
                floatingFilter: false,
                cellRendererFramework: (params: any) => {
                  if (moment().isAfter(moment(params.data.date), 'months')) {
                    return null;
                  }

                  return (
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
                          onClick={() => handleDeleteData(params.data)}
                        />
                      </Tooltip>
                    </>
                  );
                }
              }
            ]}
            rowData={rowData}
          />
        </ProCard>
      </PageContainer>

      <Modal
        visible={visibleModal}
        title={edit ? 'Chỉnh sửa' : 'Thêm đơn giá mới'}
        centered
        cancelText='Hủy'
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form name='add-form' form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label='Đơn giá Điện'
            name='electricity'
            rules={[{ required: true, message: 'Hãy nhập đơn giá điện!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\s?VNĐ|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label='Đơn giá nước'
            name='water'
            rules={[{ required: true, message: 'Hãy nhập đơn giá nước!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\s?VNĐ|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label='Tiền giữ xe'
            name='parking'
            rules={[{ required: true, message: 'Hãy nhập tiền xe!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\s?VNĐ|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label='Tiền rác'
            name='junkMoney'
            rules={[{ required: true, message: 'Hãy nhập tiền rác!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\s?VNĐ|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label='Thời gian'
            name='date'
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: 'Hãy chọn thời gian!' }]}
          >
            <DatePicker style={{ width: '100%' }} picker='month' format='MM/YYYY' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UnitPricePage;
