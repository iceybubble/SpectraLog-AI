import { useState } from 'react';
import { Space, Card, Modal, Descriptions, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { LogFilters } from '@/components/logs/LogFilters';
import { LogTable } from '@/components/logs/LogTable';
import { logsApi } from '@/services/api';
import type { Log } from '@/types';
import { format } from 'date-fns';

export const LogsExplorer = () => {
  const [filters, setFilters] = useState<any>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['logs', filters, page, pageSize],
    queryFn: () =>
      logsApi.getLogs({
        ...filters,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
  });

  const handleFilter = (values: any) => {
    setFilters(values);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({});
    setPage(1);
  };

  const handleViewDetails = (log: Log) => {
    setSelectedLog(log);
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Logs Explorer</h1>

      <LogFilters
        onFilter={handleFilter}
        onReset={handleReset}
        loading={isLoading}
      />

      <Card>
        <LogTable
          logs={data?.items || []}
          loading={isLoading}
          onViewDetails={handleViewDetails}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `Total ${total} logs`,
          }}
          onPageChange={handlePageChange}
        />
      </Card>

      {/* Log Details Modal */}
      <Modal
        title="Log Details"
        open={!!selectedLog}
        onCancel={() => setSelectedLog(null)}
        footer={null}
        width={800}
      >
        {selectedLog && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{selectedLog.id}</Descriptions.Item>
            <Descriptions.Item label="Timestamp">
              {format(new Date(selectedLog.timestamp), 'PPpp')}
            </Descriptions.Item>
            <Descriptions.Item label="Source">
              <Tag color="blue">{selectedLog.source.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Severity">
              <Tag
                color={
                  selectedLog.severity === 'critical'
                    ? 'red'
                    : selectedLog.severity === 'error'
                    ? 'orange'
                    : 'blue'
                }
              >
                {selectedLog.severity.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Event Type">
              {selectedLog.event_type}
            </Descriptions.Item>
            <Descriptions.Item label="Message">
              {selectedLog.message}
            </Descriptions.Item>
            {selectedLog.device_id && (
              <Descriptions.Item label="Device ID">
                {selectedLog.device_id}
              </Descriptions.Item>
            )}
            {selectedLog.user && (
              <Descriptions.Item label="User">{selectedLog.user}</Descriptions.Item>
            )}
            {selectedLog.ip_address && (
              <Descriptions.Item label="IP Address">
                <code>{selectedLog.ip_address}</code>
              </Descriptions.Item>
            )}
            {selectedLog.metadata && (
              <Descriptions.Item label="Metadata">
                <pre style={{ margin: 0, fontSize: '12px' }}>
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </Space>
  );
};