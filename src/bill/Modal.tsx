import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, Form, InputNumber, Input, DatePicker, Select, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { BillModalProps, BillModalRef } from './interface';

const BillModal = forwardRef<BillModalRef, BillModalProps>(
  ({ edit, foreignKey, onCancel, onOk }, ref) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm<
      Omit<IBill, 'formatDate' | 'id' | 'date'> & { date: moment.Moment }
    >();
    const db = window.roomManagementSystemDB;

    useImperativeHandle(ref, () => ({
      getForm: () => form,
      openModal: () => setVisible(true)
    }));

    const handleModalOk = () => {
      form.validateFields().then(async ({ date, ...rest }) => {
        const value = { date: date.valueOf(), ...rest };
        const data = await db!.bill!.where('code').equals(value.code).toArray();

        if (data.filter(({ id }) => (edit ? edit !== id : id)).length > 0) {
          message.error(`Hóa đơn ${value.code} đã tồn tại!`);
          return;
        }

        const formatDate = moment(value.date).format('MM/YYYY');
        const usedRoom = await db!.bill!.where({ roomId: value.roomId, formatDate }).toArray();

        if (usedRoom.filter(({ roomId }) => (edit ? roomId !== value.roomId : roomId)).length) {
          message.error('Có phòng đã được lập hóa đơn!');
          return;
        }

        if (edit) {
          db!.bill!.update(edit, { ...value }).then(updated => {
            if (updated) {
              message.success('Cập nhật thành công!');
              setVisible(false);
              form.resetFields();
              onOk();
            } else {
              message.error('Cập nhật thất bại!');
            }
          });
          return;
        }

        db!
          .bill!.add({
            id: uuidv4(),
            formatDate: moment(value.date).format('MM/YYYY'),
            ...value
          })
          .then(() => {
            message.success('Tạo thành công!');
            setVisible(false);
            form.resetFields();
            onOk();
          });
      });
    };

    const handleModalCancel = () => {
      setVisible(false);
      form.resetFields();
      onCancel();
    };

    return (
      <Modal
        visible={visible}
        title={edit ? 'Chỉnh sửa' : 'Thêm hóa đơn mới'}
        centered
        cancelText='Hủy'
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form name='add-form' form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item label='Mã' name='code' rules={[{ required: true, message: 'Hãy nhập mã!' }]}>
            <Input autoFocus />
          </Form.Item>

          <Form.Item
            label='Phòng'
            name='roomId'
            rules={[{ required: true, message: 'Hãy chọn phòng!' }]}
          >
            <Select>
              {foreignKey.room.map(room => (
                <Select.Option value={room.id} key={room.id}>
                  {room.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label='Số lượng điện tiêu thụ'
            name='amountOfElectricity'
            rules={[{ required: true, message: 'Hãy nhập số lượng điện tiêu thụ!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label='Số lượng nước tiêu thụ'
            name='amountOfWater'
            rules={[{ required: true, message: 'Hãy nhập số lượng nước tiêu thụ!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label='Số lượng xe'
            name='numberOfVehicles'
            rules={[{ required: true, message: 'Hãy nhập số lượng xe!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
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
    );
  }
);

export default BillModal;
