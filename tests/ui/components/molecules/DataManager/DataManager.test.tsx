import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { message } from 'antd';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DataManager } from '@/ui/components/molecules/DataManager';
import * as localStorageManager from '@/utils/localStorageManager';

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Mock localStorage manager utilities
vi.mock('@/utils/localStorageManager', () => ({
  downloadLocalStorageData: vi.fn(),
  loadLocalStorageFromFile: vi.fn(),
}));

describe('DataManager', () => {
  const mockReload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: mockReload },
    });
  });

  describe('Rendering', () => {
    it('should render export button', () => {
      render(<DataManager />);

      expect(screen.getByText('Export Data')).toBeInTheDocument();
    });

    it('should render import button', () => {
      render(<DataManager />);

      expect(screen.getByText('Import Data')).toBeInTheDocument();
    });

    it('should render both buttons', () => {
      render(<DataManager />);

      expect(screen.getByText('Export Data')).toBeInTheDocument();
      expect(screen.getByText('Import Data')).toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    it('should call downloadLocalStorageData when export button is clicked', async () => {
      const user = userEvent.setup();
      render(<DataManager />);

      const exportButton = screen.getByText('Export Data');
      await user.click(exportButton);

      expect(
        localStorageManager.downloadLocalStorageData
      ).toHaveBeenCalledTimes(1);
    });

    it('should handle export success', async () => {
      const user = userEvent.setup();
      vi.mocked(localStorageManager.downloadLocalStorageData).mockResolvedValue(
        undefined
      );

      render(<DataManager />);

      const exportButton = screen.getByText('Export Data');
      await user.click(exportButton);

      await waitFor(() => {
        expect(localStorageManager.downloadLocalStorageData).toHaveBeenCalled();
      });
    });

    it('should handle export error', async () => {
      const user = userEvent.setup();
      const error = new Error('Export failed');
      vi.mocked(
        localStorageManager.downloadLocalStorageData
      ).mockImplementation(() => {
        throw error;
      });

      render(<DataManager />);

      const exportButton = screen.getByText('Export Data');
      await user.click(exportButton);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('Failed to export data');
      });
    });
  });

  describe('Import Functionality', () => {
    it('should render upload component', () => {
      const { container } = render(<DataManager />);

      const upload = container.querySelector('.ant-upload');
      expect(upload).toBeInTheDocument();
    });

    it('should accept JSON files only', () => {
      const { container } = render(<DataManager />);

      const upload = container.querySelector('.ant-upload input');
      expect(upload).toHaveAttribute('accept', '.json');
    });

    it('should call loadLocalStorageFromFile on successful upload', async () => {
      vi.mocked(localStorageManager.loadLocalStorageFromFile).mockResolvedValue(
        undefined
      );

      const { container } = render(<DataManager />);

      const file = new File(['{"test": "data"}'], 'test.json', {
        type: 'application/json',
      });
      const input = container.querySelector(
        '.ant-upload input'
      ) as HTMLInputElement;

      if (input) {
        await userEvent.upload(input, file);

        await waitFor(() => {
          expect(
            localStorageManager.loadLocalStorageFromFile
          ).toHaveBeenCalledWith(file);
        });
      }
    });

    it('should show success message after successful import', async () => {
      vi.mocked(localStorageManager.loadLocalStorageFromFile).mockResolvedValue(
        undefined
      );

      const { container } = render(<DataManager />);

      const file = new File(['{"test": "data"}'], 'test.json', {
        type: 'application/json',
      });
      const input = container.querySelector(
        '.ant-upload input'
      ) as HTMLInputElement;

      if (input) {
        await userEvent.upload(input, file);

        await waitFor(() => {
          expect(message.success).toHaveBeenCalledWith(
            'Data imported successfully! Refreshing page...'
          );
        });
      }
    });

    it('should reload page after successful import', async () => {
      vi.mocked(localStorageManager.loadLocalStorageFromFile).mockResolvedValue(
        undefined
      );

      const { container } = render(<DataManager />);

      const file = new File(['{"test": "data"}'], 'test.json', {
        type: 'application/json',
      });
      const input = container.querySelector(
        '.ant-upload input'
      ) as HTMLInputElement;

      if (input) {
        await userEvent.upload(input, file);

        await waitFor(
          () => {
            expect(mockReload).toHaveBeenCalled();
          },
          { timeout: 2000 }
        );
      }
    });

    it('should show error message on import failure', async () => {
      const error = new Error('Import failed');
      vi.mocked(localStorageManager.loadLocalStorageFromFile).mockRejectedValue(
        error
      );

      const { container } = render(<DataManager />);

      const file = new File(['invalid'], 'test.json', {
        type: 'application/json',
      });
      const input = container.querySelector(
        '.ant-upload input'
      ) as HTMLInputElement;

      if (input) {
        await userEvent.upload(input, file);

        await waitFor(() => {
          expect(message.error).toHaveBeenCalledWith('Import failed');
        });
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple export clicks', async () => {
      const user = userEvent.setup();
      render(<DataManager />);

      const exportButton = screen.getByText('Export Data');
      await user.click(exportButton);
      await user.click(exportButton);

      expect(
        localStorageManager.downloadLocalStorageData
      ).toHaveBeenCalledTimes(2);
    });

    it('should handle non-JSON file upload attempt', async () => {
      const { container } = render(<DataManager />);

      const input = container.querySelector(
        '.ant-upload input'
      ) as HTMLInputElement;

      // The accept attribute should prevent non-JSON files
      expect(input).toHaveAttribute('accept', '.json');
    });

    it('should handle empty file upload', async () => {
      vi.mocked(localStorageManager.loadLocalStorageFromFile).mockResolvedValue(
        undefined
      );

      const { container } = render(<DataManager />);

      const file = new File([''], 'empty.json', { type: 'application/json' });
      const input = container.querySelector(
        '.ant-upload input'
      ) as HTMLInputElement;

      if (input) {
        await userEvent.upload(input, file);

        await waitFor(() => {
          expect(
            localStorageManager.loadLocalStorageFromFile
          ).toHaveBeenCalledWith(file);
        });
      }
    });
  });

  describe('Accessibility', () => {
    it('should have accessible export button', () => {
      render(<DataManager />);

      const exportButton = screen.getByText('Export Data');
      expect(exportButton).toBeVisible();
    });

    it('should have accessible import button', () => {
      render(<DataManager />);

      const importButton = screen.getByText('Import Data');
      expect(importButton).toBeVisible();
    });

    it('should have file input for screen readers', () => {
      const { container } = render(<DataManager />);

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });
  });
});
