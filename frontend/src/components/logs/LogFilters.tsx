import { Form, Input, Select, Button, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

export interface LogFilterValues {
  source?: string;
  severity?: string;
  search?: string;
}

interface LogFiltersProps {
  onFilter: (values: LogFilterValues) => void;
  onReset: () => void;
  loading?: boolean;
}

export const LogFilters = ({ onFilter, onReset, loading }: LogFiltersProps) => {
  const [form] = Form.useForm();

  const handleFinish = (values: LogFilterValues) => {
    onFilter(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="inline"
        onFinish={handleFinish}
        style={{ gap: '12px 0' }}
      >
        <Form.Item name="search">
          <Input
            placeholder="Search log messages..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 260 }}
          />
        </Form.Item>

        <Form.Item name="source">
          <Select
            placeholder="Source"
            allowClear
            style={{ width: 140 }}
            options={[
              { label: 'Windows', value: 'windows' },
              { label: 'Android', value: 'android' },
              { label: 'Server', value: 'server' },
              { label: 'IoT', value: 'iot' },
              { label: 'Cloud', value: 'cloud' },
            ]}
          />
        </Form.Item>

        <Form.Item name="severity">
          <Select
            placeholder="Severity"
            allowClear
            style={{ width: 140 }}
            options={[
              { label: 'Info', value: 'info' },
              { label: 'Warning', value: 'warning' },
              { label: 'Error', value: 'error' },
              { label: 'Critical', value: 'critical' },
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Space direction="horizontal">
            <Button type="primary" htmlType="submit" loading={loading} icon={<SearchOutlined />}>
              Filter
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
