import {
  AudioOutlined,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Input } from 'antd';

import { ActionButton } from '../atoms/ActionButton';

import { messagesStyles } from '@/ui/styles/chatStyles';

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
    <div style={messagesStyles.inputContainer}>
      <ActionButton icon={<PlusOutlined />} variant='primary' />
      <ActionButton icon={<PictureOutlined />} />
      <ActionButton icon={<AudioOutlined />} />

      <Input
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onPressEnter={onSend}
        style={messagesStyles.messageInput}
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
