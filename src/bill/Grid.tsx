import { createRef, useEffect, useState, forwardRef, RefObject, useImperativeHandle } from 'react';
import { EditOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Modal, message, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import { BillGridProps, BillGridRef, IPrintData } from './interface';

const BillGrid = forwardRef<BillGridRef, BillGridProps>(
  ({ foreignKey, getBillModalRef, onEdit }, ref) => {
    const [rowData, setRowData] = useState<IBill[]>([]);
    const db = window.roomManagementSystemDB;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND'
    });

    const fetchData = async () => {
      setRowData(await db!.bill!!.toArray());
    };

    useEffect(() => {
      fetchData();
      // eslint-disable-next-line
    }, []);

    useImperativeHandle(ref, () => ({
      fetchData
    }));

    const handleDelete = (data: IBill) => {
      Modal.warning({
        title: `Bạn có muốn xóa hóa đơn ${data.code}?`,
        onOk: () => {
          db!
            .bill!.where('code')
            .equals(data.code)
            .delete()
            .then(() => {
              message.success(`Xóa thành công!`);
              fetchData();
            });
        }
      });
    };

    const handleEdit = ({ date, ...rest }: IBill) => {
      const { getForm, openModal } = getBillModalRef();
      onEdit(rest.id);
      openModal();
      getForm().setFieldsValue({
        date: moment(date),
        ...rest
      });
    };

    const renderPrintPage = (params: any) => {
      const printData: IPrintData[] = params.node?.allLeafChildren?.map((child: any) => child.data);
      const printRef: RefObject<HTMLDivElement> = createRef();

      return (
        <>
          <ReactToPrint
            trigger={() => <Button icon={<PrinterOutlined />} />}
            content={() => printRef.current}
          />
          <div style={{ display: 'none' }}>
            <div ref={printRef}>
              <style>
                {`#print-container {
                  padding: 16px;
                }

                #print-container h2 {
                  font-weight: bold;
                  text-align: center;
                }

                #print-container table, #print-container th, #print-container td {
                  border: 1px solid black;
                  font-size: 14px;
                }

                #print-container table {
                  width: 100%;
                  border-collapse: collapse;
                }`}
              </style>
              <div id='print-container'>
                <h2>Tháng {params.node.key}</h2>

                <table cellPadding={8}>
                  <tr>
                    <th rowSpan={2}>SP</th>
                    <th colSpan={2}>TIỀN ĐIỆN</th>
                    <th colSpan={2}>TIỀN NƯỚC</th>
                    <th rowSpan={2}>TIỀN XE</th>
                    <th rowSpan={2}>TIỀN RÁC</th>
                    <th rowSpan={2}>TỔNG CỘNG</th>
                    <th rowSpan={2}>SP</th>
                  </tr>

                  <tr>
                    <th>TIÊU THỤ (kW)</th>
                    <th>THÀNH TIỀN</th>
                    <th>TIÊU THỤ (m3)</th>
                    <th>THÀNH TIỀN</th>
                  </tr>

                  {printData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.room}</td>
                      <td>{data.amountOfElectricity}</td>
                      <td>{data.electricityBill}</td>
                      <td>{data.amountOfWater}</td>
                      <td>{data.waterBill}</td>
                      <td>{data.parkingFee}</td>
                      <td>{data.junkMoney}</td>
                      <td>{data.total}</td>
                      <td>{data.room}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </>
      );
    };

    const cellRendererFramework = (params: any) => {
      if (!params.data) {
        return renderPrintPage(params);
      }

      if (!params.data || (params.data && moment().isAfter(moment(params.data.date)))) {
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
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(params.data)} />
          </Tooltip>
        </>
      );
    };

    const columnDefs = [
      { headerName: 'Thời gian', field: 'formatDate', rowGroup: true, hide: true },
      { headerName: 'Mã', field: 'code', filter: 'agTextColumnFilter' },
      {
        headerName: 'Phòng',
        field: 'room',
        filter: 'agTextColumnFilter'
      },
      {
        headerName: 'Số lượng điện tiêu thụ',
        field: 'amountOfElectricity',
        filter: 'agTextColumnFilter'
      },
      {
        headerName: 'Số lượng nước tiêu thụ',
        field: 'amountOfWater',
        filter: 'agTextColumnFilter'
      },
      {
        headerName: 'Số lượng xe',
        field: 'numberOfVehicles',
        filter: 'agTextColumnFilter'
      },
      {
        headerName: 'Tiền điện',
        field: 'electricityBill',
        filter: 'agTextColumnFilter'
      },
      {
        headerName: 'Tiền nước',
        field: 'waterBill',
        filter: 'agTextColumnFilter'
      },
      {
        headerName: 'Tiền giữ xe',
        field: 'parkingFee',
        filter: 'agTextColumnFilter'
      },
      {
        headerName: 'Tiền rác',
        field: 'junkMoney',
        filter: 'agTextColumnFilter'
      },
      {
        headerName: 'Tổng',
        field: 'total',
        filter: 'agTextColumnFilter'
      },
      {
        pinned: 'right',
        field: '',
        width: 100,
        floatingFilter: false,
        cellRendererFramework
      }
    ];

    return (
      <ProCard style={{ height: window.innerHeight - 168 }} className='ag-theme-alpine'>
        <AgGridReact
          animateRows
          defaultColDef={{ floatingFilter: true, sortable: true, filter: true, resizable: true }}
          groupMultiAutoColumn
          enableRangeSelection
          columnDefs={columnDefs}
          rowData={rowData.map(data => {
            const unitPrice = foreignKey.unitPrice.find(price => price.code === data.formatDate);
            const electricityBill = unitPrice
              ? unitPrice.electricity * data.amountOfElectricity
              : 0;
            const waterBill = unitPrice ? unitPrice.water * data.amountOfWater : 0;
            const parkingFee = unitPrice ? unitPrice.parking * data.numberOfVehicles : 0;
            const junkMoney = unitPrice?.junkMoney || 0;
            const room = foreignKey.room.find(room => room.id === data.roomId)?.name;
            const total = electricityBill + waterBill + parkingFee + junkMoney;

            return {
              room,
              electricityBill: formatter.format(electricityBill),
              waterBill: formatter.format(waterBill),
              parkingFee: formatter.format(parkingFee),
              junkMoney: formatter.format(junkMoney),
              total: formatter.format(total),
              ...data
            };
          })}
        />
      </ProCard>
    );
  }
);

export default BillGrid;
