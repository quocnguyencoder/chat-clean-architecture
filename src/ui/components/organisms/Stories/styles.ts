import type { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  container: {
    position: 'relative',
    width: '100%',
  },
  carouselWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  scrollContainer: {
    display: 'flex',
    gap: '12px',
    transition: 'transform 0.3s ease',
    padding: '16px',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #e8e8e8',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
    fontSize: '10px',
    color: '#666',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(4px)',
  },
  navButtonVisible: {
    opacity: 1,
    visibility: 'visible',
  },
  navButtonLeft: {
    left: '8px',
  },
  navButtonRight: {
    right: '8px',
  },
  navButtonDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
};
