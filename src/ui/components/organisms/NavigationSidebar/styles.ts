import type { CSSProperties } from 'react';

import { navigationStyles } from '@/ui/styles/chatStyles';

export const styles = {
  container: navigationStyles.container,
  brand: navigationStyles.brand,
  brandContainer: {
    marginBottom: 20,
  } as CSSProperties,
  navigationMenu: {
    width: '100%',
  } as CSSProperties,
  userAvatarContainer: {
    marginTop: 'auto',
    marginBottom: 16,
  } as CSSProperties,
};
