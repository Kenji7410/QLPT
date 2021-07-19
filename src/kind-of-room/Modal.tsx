import { forwardRef, useImperativeHandle, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Modal, Form, InputNumber, Input, message } from 'antd';
import { KindOfRoomModalProps, KindOfRoomModalRef } from './interface';

const KindOfRoomModal = forwardRef<KindOfRoomModalRef, KindOfRoomModalProps>(
  ({ edit, onOk, onCancel }, ref) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm<Omit<IKindOfRoom, 'id'>>();
    const db = window.roomManagementSystemDB;

    useImperativeHandle(ref, () => ({
      getForm: () => form,
      openModal: () => setVisible(true)
    }));

    const handleOk = () => {
      form.validateFields().then(async value => {
        const data = await db!.kindOfRoom!.where('code').equals(value.code).toArray();

        if (data.filter(({ id }) => (edit ? edit !== id : id)).length > 0) {
          message.error(`Loại phòng ${value.name} đã tồn tại!`);
          return;
        }

        if (edit) {
          db!.kindOfRoom!.update(edit, value).then(updated => {
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
          .kindOfRoom!.add({
            id: uuidv4(),
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

    const handleCancel = () => {
      setVisible(false);
      form.resetFields();
      onCancel();
    };

    return (
      <Modal
        visible={visible}
        title={edit ? 'Chỉnh sửa' : 'Thêm loại phòng mới'}
        centered
        cancelText='Hủy'
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form name='add-form' form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label='Mã' name='code' rules={[{ required: true, message: 'Hãy nhập mã!' }]}>
            <Input autoFocus />
          </Form.Item>

          <Form.Item label='Tên' name='name' rules={[{ required: true, message: 'Hãy nhập tên!' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label='Giá'
            name='price'
            rules={[{ required: true, message: 'Hãy nhập giá!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\s?VNĐ|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label='Tiền cọc'
            name='deposit'
            rules={[{ required: true, message: 'Hãy nhập tiền cọc!' }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\s?VNĐ|(,*)/g, '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default KindOfRoomModal;
