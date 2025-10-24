import { Layout } from 'antd';

import type { MainLayoutProps } from '@/types/chat';
import { layoutStyles } from '@/ui/styles/chatStyles';

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return <Layout style={layoutStyles.mainContainer}>{children}</Layout>;
};
