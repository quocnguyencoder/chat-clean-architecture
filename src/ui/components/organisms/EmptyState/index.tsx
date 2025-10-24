import { MessageOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

import { styles } from './styles';

const { Title } = Typography;

export const EmptyState: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <MessageOutlined style={styles.icon} />
        <Title level={4} style={styles.title}>
          Select a chat to start messaging
        </Title>
      </div>
    </div>
  );
};
