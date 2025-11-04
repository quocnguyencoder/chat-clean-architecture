import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { messagesStyles } from '@/ui/styles/chatStyles';

export const styles = {
  container: messagesStyles.inputContainer,
  input: {
    ...messagesStyles.messageInput,
    '::placeholder': {
      color: `${theme.colors.text.primary} !important`,
      opacity: 0.6,
    },
    '& .ant-input::placeholder': {
      color: `${theme.colors.text.primary} !important`,
      opacity: 0.6,
    },
  } as CSSProperties,
};
