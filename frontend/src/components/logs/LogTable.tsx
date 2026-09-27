import { Table, Tag, Button, Space } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { EyeOutlined } from '@ant-design/icons';
import type { Log } from '@/types';
import { format } from 'date-fns';

interface LogTableProps {
  logs: Log[];
  loading?: boolean;
  onViewDetails: (log: Log) => void;
  pagination?: TablePaginationConfig;
  onPageChange?: (page: number, pageSize: number) => void;
}

export const LogTable = ({
  logs,
  loading,
  onViewDetails,
  pagination,
  onPageChange,
}: LogTableProps) => {
  const columns: ColumnsType<Log> = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (ts: string) => (
        <span style={{ fontSize: '12px' }}>
          {format(new Date(ts), 'yyyy-MM-dd HH:mm:ss')}
        </span>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      width: 110,
      render: (source: string) => (
        <Tag color="blue" style={{ textTransform: 'uppercase' }}>
          {source}
        </Tag>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 110,
      render: (severity: string) => {
        const color =
          severity === 'critical'
            ? 'red'
            : severity === 'error'
            ? 'orange'
            : severity === 'warning'
            ? 'gold'
            : 'blue';
        return <Tag color={color}>{severity.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Event Type',
      dataIndex: 'event_type',
      key: 'event_type',
      width: 140,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'IP Address',
      dataIndex: 'ip_address',
      key: 'ip_address',
      width: 140,
      render: (ip?: string) => ip ? <code>{ip}</code> : '-',
    },
    {
      title: 'Action',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={logs}
      loading={loading}
      pagination={
        pagination
          ? {
              ...pagination,
              onChange: (page, pageSize) => onPageChange?.(page, pageSize),
            }
          : false
      }
      size="middle"
    />
  );
};
