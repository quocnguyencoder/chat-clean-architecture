import type { CSSProperties } from 'react';

import { navigationStyles } from '@/ui/styles/chatStyles';

export const getNavigationContainerStyles = () => navigationStyles.container;
export const getNavigationBrandStyles = () => navigationStyles.brand;

export const getBrandContainerStyles = (): CSSProperties => ({
  marginBottom: 20,
});

export const getNavigationMenuStyles = (): CSSProperties => ({
  width: '100%',
});

export const getUserAvatarContainerStyles = (): CSSProperties => ({
  marginTop: 'auto',
  marginBottom: 16,
});
