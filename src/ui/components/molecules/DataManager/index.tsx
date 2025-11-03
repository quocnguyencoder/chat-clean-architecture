import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Button, message, Space, Upload } from 'antd';

import { styles } from './styles';

import {
  downloadLocalStorageData,
  loadLocalStorageFromFile,
} from '@/utils/localStorageManager';

export const DataManager: React.FC = () => {
  const handleExport = () => {
    try {
      downloadLocalStorageData();
      message.success('Data exported successfully!');
    } catch {
      message.error('Failed to export data');
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      await loadLocalStorageFromFile(file);
      message.success('Data imported successfully! Refreshing page...');

      // Refresh the page to reload data from localStorage
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'Failed to import data'
      );
    }
  };

  const uploadProps = {
    beforeUpload: (file: UploadFile) => {
      if (file.type !== 'application/json') {
        message.error('Please upload a JSON file');
        return false;
      }

      handleFileSelect(file as unknown as File);
      return false; // Prevent auto upload
    },
    showUploadList: false,
    accept: '.json',
  };

  return (
    <Space style={styles.container}>
      <Button
        type='default'
        icon={<DownloadOutlined />}
        onClick={handleExport}
        style={styles.button}
      >
        Export Data
      </Button>

      <Upload {...uploadProps}>
        <Button type='default' icon={<UploadOutlined />} style={styles.button}>
          Import Data
        </Button>
      </Upload>
    </Space>
  );
};
