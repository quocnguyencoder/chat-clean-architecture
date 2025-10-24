import { BookOutlined, MenuOutlined, MessageOutlined } from '@ant-design/icons';
import { Avatar, Space, Typography } from 'antd';

import { NavigationItem } from '../../molecules/NavigationItem';

import { styles } from './styles';

const { Title } = Typography;

export const NavigationSidebar: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.brandContainer}>
        <Title level={4} style={styles.brand}>
          Q
        </Title>
      </div>

      <Space direction='vertical' size={16} style={styles.navigationMenu}>
        <NavigationItem
          icon={<MessageOutlined />}
          label='Chats'
          isActive={true}
          badge={3}
          badgeType='count'
        />

        <NavigationItem
          icon={<BookOutlined />}
          label='Stories'
          isActive={false}
        />

        <NavigationItem
          icon={<MenuOutlined />}
          label='Menu'
          isActive={false}
          badge={true}
          badgeType='dot'
        />
      </Space>

      <div style={styles.userAvatarContainer}>
        <Avatar size={32} src='/api/placeholder/32/32' />
      </div>
    </div>
  );
};
