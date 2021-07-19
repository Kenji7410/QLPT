import { FC, useEffect, useState } from 'react';
import { Typography } from 'antd';
import Pie from '@ant-design/charts/es/pie';

const RoomStatus: FC = () => {
  const db = window.roomManagementSystemDB;
  const [roomData, setRoomData] = useState<IRoom[]>([]);
  const stillEmptyNumber = roomData.filter(room => !room.stillEmpty).length;

  const fetchRoomData = async () => {
    setRoomData(await db!.room!.toArray());
  };

  useEffect(() => {
    fetchRoomData();
    // eslint-disable-next-line
  }, []);

  const pieData = [
    {
      type: 'Còn trống',
      value: stillEmptyNumber
    },
    {
      type: 'Có khách ở',
      value: roomData.length - stillEmptyNumber
    }
  ];

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref: any) {
        var percent = _ref.percent;
        return ''.concat((percent * 100).toFixed(0), '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center'
      }
    },
    interactions: [{ type: 'element-active' }]
  };

  return (
    <>
      <Pie {...pieConfig} />

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Typography.Title level={4}>Tình trạng phòng</Typography.Title>
      </div>
    </>
  );
};

export default RoomStatus;
