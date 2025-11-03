export const theme = {
  colors: {
    primary: '#0084ff',
    success: '#44b700',
    warning: '#ffc107',
    background: {
      main: '#1a1a1a',
      secondary: '#1e1e1e',
      tertiary: '#2a2a2a',
      card: '#3a3b3c',
      hover: '#4e4f50',
      hoverLight: '#f0f0f0',
    },
    text: {
      primary: '#e4e6eb',
      secondary: '#b0b3b8',
      muted: '#8a8a8a',
      inverse: '#000',
    },
    border: '#4e4f50',
    gradient: {
      story:
        'linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    small: 8,
    medium: 18,
    large: 20,
    circle: '50%',
  },
  sizes: {
    sidebar: {
      navigation: 60,
      chatList: 320,
    },
    header: 64,
    avatar: {
      small: 28,
      medium: 40,
      large: 48,
      story: 52,
    },
    badge: {
      minWidth: 20,
      height: 20,
    },
    story: {
      itemWidth: 80,
    },
  },
} as const;
