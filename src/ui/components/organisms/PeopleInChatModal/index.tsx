import { CrownOutlined } from '@ant-design/icons';
import { List, Modal, Tag, Typography } from 'antd';
import { useMemo } from 'react';

import { AvatarWithStatus } from '../../molecules/AvatarWithStatus';

import { styles } from './styles';

import { theme } from '@/constants/theme';
import type { ChatParticipant } from '@/domain/entities/ChatParticipant';

const { Text } = Typography;

interface PeopleInChatModalProps {
  open: boolean;
  onClose: () => void;
  participants: ChatParticipant[];
  chatName: string;
}

export const PeopleInChatModal: React.FC<PeopleInChatModalProps> = ({
  open,
  onClose,
  participants,
  chatName,
}) => {
  // Separate admins and members
  const { admins, members } = useMemo(() => {
    const admins = participants.filter(p => p.isAdmin());
    const members = participants.filter(p => !p.isAdmin());
    return { admins, members };
  }, [participants]);

  const renderParticipant = (participant: ChatParticipant) => (
    <List.Item style={styles.participantItem}>
      <List.Item.Meta
        avatar={
          <AvatarWithStatus
            size={48}
            src={participant.avatar}
            isOnline={participant.isOnline}
            statusSize='small'
          />
        }
        title={
          <div style={styles.participantTitle}>
            <Text strong style={styles.participantName}>
              {participant.name}
            </Text>
            {participant.isAdmin() && (
              <Tag
                icon={<CrownOutlined />}
                color='gold'
                style={styles.adminTag}
              >
                Admin
              </Tag>
            )}
          </div>
        }
        description={
          <Text
            style={
              participant.isOnline ? styles.statusOnline : styles.statusText
            }
          >
            {participant.isOnline ? 'Online' : 'Offline'}
          </Text>
        }
      />
    </List.Item>
  );

  return (
    <Modal
      title={<span style={styles.modalTitle}>People in {chatName}</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      closeIcon={<span style={styles.closeIcon}>✕</span>}
      styles={{
        content: {
          backgroundColor: theme.colors.background.secondary,
          color: theme.colors.text.primary,
        },
        header: {
          backgroundColor: theme.colors.background.secondary,
          color: theme.colors.text.primary,
        },
      }}
    >
      <div style={styles.container}>
        <Text style={styles.participantCount}>
          {participants.length} participant
          {participants.length !== 1 ? 's' : ''}
        </Text>

        {admins.length > 0 && (
          <div style={styles.section}>
            <Text strong style={styles.sectionTitle}>
              Admins
            </Text>
            <List
              dataSource={admins}
              renderItem={renderParticipant}
              style={styles.list}
            />
          </div>
        )}

        {members.length > 0 && (
          <div style={styles.section}>
            <Text strong style={styles.sectionTitle}>
              Members
            </Text>
            <List
              dataSource={members}
              renderItem={renderParticipant}
              style={styles.list}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
