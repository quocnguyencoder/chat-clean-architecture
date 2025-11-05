import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearAllChatData,
  downloadLocalStorageData,
  exportLocalStorageData,
  importLocalStorageData,
  loadLocalStorageFromFile,
  type LocalStorageExport,
} from '@/utils/localStorageManager';

describe('localStorageManager utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('exportLocalStorageData', () => {
    it('should export empty data when localStorage is empty', () => {
      const result = exportLocalStorageData();

      expect(result.version).toBe('1.0.0');
      expect(result.timestamp).toBeDefined();
      expect(result.data.chats).toBeNull();
      expect(result.data.userStatuses).toBeNull();
      expect(result.data.messages).toEqual({});
      expect(result.data.participants).toEqual({});
    });

    it('should export chats data', () => {
      const chatsData = JSON.stringify([{ id: '1', name: 'Chat 1' }]);
      localStorage.setItem('chat-app-chats', chatsData);

      const result = exportLocalStorageData();

      expect(result.data.chats).toBe(chatsData);
    });

    it('should export user statuses data', () => {
      const statusesData = JSON.stringify([{ userId: '1', online: true }]);
      localStorage.setItem('chat-user-statuses', statusesData);

      const result = exportLocalStorageData();

      expect(result.data.userStatuses).toBe(statusesData);
    });

    it('should export messages data', () => {
      const messagesData = JSON.stringify([{ id: 'm1', text: 'Hello' }]);
      localStorage.setItem('chat-messages-chat1', messagesData);
      localStorage.setItem('chat-messages-chat2', messagesData);

      const result = exportLocalStorageData();

      expect(result.data.messages).toHaveProperty('chat1');
      expect(result.data.messages).toHaveProperty('chat2');
      expect(result.data.messages.chat1).toBe(messagesData);
      expect(result.data.messages.chat2).toBe(messagesData);
    });

    it('should export participants data', () => {
      const participantsData = JSON.stringify([{ id: 'p1', name: 'User 1' }]);
      localStorage.setItem('chat-participants-chat1', participantsData);
      localStorage.setItem('chat-participants-chat2', participantsData);

      const result = exportLocalStorageData();

      expect(result.data.participants).toHaveProperty('chat1');
      expect(result.data.participants).toHaveProperty('chat2');
      expect(result.data.participants.chat1).toBe(participantsData);
      expect(result.data.participants.chat2).toBe(participantsData);
    });

    it('should export all data types together', () => {
      localStorage.setItem('chat-app-chats', '[]');
      localStorage.setItem('chat-user-statuses', '[]');
      localStorage.setItem('chat-messages-chat1', '[]');
      localStorage.setItem('chat-participants-chat1', '[]');

      const result = exportLocalStorageData();

      expect(result.data.chats).toBe('[]');
      expect(result.data.userStatuses).toBe('[]');
      expect(result.data.messages.chat1).toBe('[]');
      expect(result.data.participants.chat1).toBe('[]');
    });

    it('should include valid timestamp', () => {
      const result = exportLocalStorageData();
      const timestamp = new Date(result.timestamp);

      expect(timestamp.toISOString()).toBe(result.timestamp);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should ignore non-chat related localStorage keys', () => {
      localStorage.setItem('some-other-key', 'value');
      localStorage.setItem('chat-app-chats', '[]');

      const result = exportLocalStorageData();

      expect(result.data.chats).toBe('[]');
      // Other keys should not appear in messages or participants
      expect(Object.keys(result.data.messages).length).toBe(0);
    });
  });

  describe('importLocalStorageData', () => {
    it('should import chats data', () => {
      const data: LocalStorageExport = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          chats: JSON.stringify([{ id: '1' }]),
          userStatuses: null,
          messages: {},
          participants: {},
        },
      };

      importLocalStorageData(data);

      expect(localStorage.getItem('chat-app-chats')).toBe(data.data.chats);
    });

    it('should import user statuses data', () => {
      const data: LocalStorageExport = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          chats: null,
          userStatuses: JSON.stringify([{ userId: '1' }]),
          messages: {},
          participants: {},
        },
      };

      importLocalStorageData(data);

      expect(localStorage.getItem('chat-user-statuses')).toBe(
        data.data.userStatuses
      );
    });

    it('should import messages data', () => {
      const data: LocalStorageExport = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          chats: null,
          userStatuses: null,
          messages: {
            chat1: JSON.stringify([{ id: 'm1' }]),
            chat2: JSON.stringify([{ id: 'm2' }]),
          },
          participants: {},
        },
      };

      importLocalStorageData(data);

      expect(localStorage.getItem('chat-messages-chat1')).toBe(
        data.data.messages.chat1
      );
      expect(localStorage.getItem('chat-messages-chat2')).toBe(
        data.data.messages.chat2
      );
    });

    it('should import participants data', () => {
      const data: LocalStorageExport = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          chats: null,
          userStatuses: null,
          messages: {},
          participants: {
            chat1: JSON.stringify([{ id: 'p1' }]),
            chat2: JSON.stringify([{ id: 'p2' }]),
          },
        },
      };

      importLocalStorageData(data);

      expect(localStorage.getItem('chat-participants-chat1')).toBe(
        data.data.participants.chat1
      );
      expect(localStorage.getItem('chat-participants-chat2')).toBe(
        data.data.participants.chat2
      );
    });

    it('should clear existing data before importing', () => {
      localStorage.setItem('chat-app-chats', 'old-data');
      localStorage.setItem('chat-messages-old', 'old-messages');

      const data: LocalStorageExport = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          chats: 'new-data',
          userStatuses: null,
          messages: {},
          participants: {},
        },
      };

      importLocalStorageData(data);

      expect(localStorage.getItem('chat-app-chats')).toBe('new-data');
      expect(localStorage.getItem('chat-messages-old')).toBeNull();
    });

    it('should handle empty messages and participants', () => {
      const data: LocalStorageExport = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          chats: null,
          userStatuses: null,
          messages: {},
          participants: {},
        },
      };

      expect(() => importLocalStorageData(data)).not.toThrow();
    });
  });

  describe('clearAllChatData', () => {
    it('should clear all chat-related data', () => {
      localStorage.setItem('chat-app-chats', '[]');
      localStorage.setItem('chat-user-statuses', '[]');
      localStorage.setItem('chat-messages-chat1', '[]');
      localStorage.setItem('chat-participants-chat1', '[]');

      clearAllChatData();

      expect(localStorage.getItem('chat-app-chats')).toBeNull();
      expect(localStorage.getItem('chat-user-statuses')).toBeNull();
      expect(localStorage.getItem('chat-messages-chat1')).toBeNull();
      expect(localStorage.getItem('chat-participants-chat1')).toBeNull();
    });

    it('should not clear non-chat related data', () => {
      localStorage.setItem('other-app-data', 'keep-me');
      localStorage.setItem('chat-app-chats', 'remove-me');

      clearAllChatData();

      expect(localStorage.getItem('other-app-data')).toBe('keep-me');
      expect(localStorage.getItem('chat-app-chats')).toBeNull();
    });

    it('should handle empty localStorage', () => {
      expect(() => clearAllChatData()).not.toThrow();
    });

    it('should clear multiple message entries', () => {
      localStorage.setItem('chat-messages-1', '[]');
      localStorage.setItem('chat-messages-2', '[]');
      localStorage.setItem('chat-messages-3', '[]');

      clearAllChatData();

      expect(localStorage.getItem('chat-messages-1')).toBeNull();
      expect(localStorage.getItem('chat-messages-2')).toBeNull();
      expect(localStorage.getItem('chat-messages-3')).toBeNull();
    });

    it('should clear multiple participant entries', () => {
      localStorage.setItem('chat-participants-1', '[]');
      localStorage.setItem('chat-participants-2', '[]');
      localStorage.setItem('chat-participants-3', '[]');

      clearAllChatData();

      expect(localStorage.getItem('chat-participants-1')).toBeNull();
      expect(localStorage.getItem('chat-participants-2')).toBeNull();
      expect(localStorage.getItem('chat-participants-3')).toBeNull();
    });
  });

  describe('downloadLocalStorageData', () => {
    beforeEach(() => {
      // Mock URL.createObjectURL and revokeObjectURL
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();
    });

    it('should create download link with default filename', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      downloadLocalStorageData();

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should use custom filename when provided', () => {
      let capturedDownload = '';
      const realCreateElement = document.createElement.bind(document);

      const createElementSpy = vi
        .spyOn(document, 'createElement')
        .mockImplementation((tagName: string) => {
          const element = realCreateElement(tagName) as HTMLAnchorElement;
          if (tagName === 'a') {
            Object.defineProperty(element, 'download', {
              set: (value: string) => {
                capturedDownload = value;
              },
              get: () => capturedDownload,
            });
          }
          return element;
        });

      vi.spyOn(document.body, 'appendChild').mockImplementation(
        () => null as any
      );
      vi.spyOn(document.body, 'removeChild').mockImplementation(
        () => null as any
      );

      downloadLocalStorageData('custom-backup.json');

      expect(capturedDownload).toBe('custom-backup.json');

      createElementSpy.mockRestore();
    });
  });

  describe('loadLocalStorageFromFile', () => {
    it('should load and import data from valid JSON file', async () => {
      const mockData: LocalStorageExport = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          chats: JSON.stringify([{ id: '1' }]),
          userStatuses: null,
          messages: {},
          participants: {},
        },
      };

      const blob = new Blob([JSON.stringify(mockData)], {
        type: 'application/json',
      });
      const file = new File([blob], 'backup.json', {
        type: 'application/json',
      });

      await loadLocalStorageFromFile(file);

      expect(localStorage.getItem('chat-app-chats')).toBe(mockData.data.chats);
    });

    it('should reject invalid JSON', async () => {
      const blob = new Blob(['invalid json'], { type: 'application/json' });
      const file = new File([blob], 'invalid.json', {
        type: 'application/json',
      });

      await expect(loadLocalStorageFromFile(file)).rejects.toThrow();
    });

    it('should reject file with invalid data structure', async () => {
      const invalidData = { invalid: 'structure' };
      const blob = new Blob([JSON.stringify(invalidData)], {
        type: 'application/json',
      });
      const file = new File([blob], 'invalid.json', {
        type: 'application/json',
      });

      await expect(loadLocalStorageFromFile(file)).rejects.toThrow(
        'Invalid data format'
      );
    });

    it('should handle file read errors', async () => {
      const file = new File([], 'test.json');

      // Mock FileReader to simulate error
      const originalFileReader = globalThis.FileReader;
      globalThis.FileReader = class extends originalFileReader {
        readAsText() {
          setTimeout(() => {
            if (this.onerror) {
              const event = new ProgressEvent(
                'error'
              ) as ProgressEvent<FileReader>;
              this.onerror(event);
            }
          }, 0);
        }
      } as any;

      await expect(loadLocalStorageFromFile(file)).rejects.toThrow(
        'Failed to read file'
      );

      globalThis.FileReader = originalFileReader;
    });
  });
});
