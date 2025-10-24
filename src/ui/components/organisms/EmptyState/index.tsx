import { MessageOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

import {
  getEmptyStateContainerStyles,
  getEmptyStateContentStyles,
  getEmptyStateIconStyles,
  getEmptyStateTitleStyles,
} from './styles';

const { Title } = Typography;

export const EmptyState: React.FC = () => {
  return (
    <div style={getEmptyStateContainerStyles()}>
      <div style={getEmptyStateContentStyles()}>
        <MessageOutlined style={getEmptyStateIconStyles()} />
        <Title level={4} style={getEmptyStateTitleStyles()}>
          Select a chat to start messaging
        </Title>
      </div>
    </div>
  );
};
