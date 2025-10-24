import {
  AudioOutlined,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Input } from 'antd';

import { ActionButton } from '../../atoms/ActionButton';

import { styles } from './styles';

interface MessageInputProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'Aa',
}) => {
  return (
    <div style={styles.container}>
      <ActionButton icon={<PlusOutlined />} variant='primary' />
      <ActionButton icon={<PictureOutlined />} />
      <ActionButton icon={<AudioOutlined />} />

      <Input
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onPressEnter={onSend}
        style={styles.input}
        suffix={<ActionButton icon={<SmileOutlined />} />}
      />

      {value ? (
        <ActionButton
          icon={<SendOutlined />}
          onClick={onSend}
          variant='primary'
        />
      ) : (
        <ActionButton icon={<AudioOutlined />} />
      )}
    </div>
  );
};
