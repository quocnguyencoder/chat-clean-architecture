/**
 * LocalStorage Manager
 *
 * Utility functions to export and import all chat application data from localStorage
 */

export interface LocalStorageExport {
  version: string;
  timestamp: string;
  data: {
    chats: string | null;
    userStatuses: string | null;
    messages: Record<string, string>;
    participants: Record<string, string>;
  };
}

const STORAGE_KEYS = {
  CHATS: 'chat-app-chats',
  USER_STATUSES: 'chat-user-statuses',
  MESSAGE_PREFIX: 'chat-messages-',
  PARTICIPANT_PREFIX: 'chat-participants-',
} as const;

/**
 * Export all localStorage data to a JSON object
 */
export function exportLocalStorageData(): LocalStorageExport {
  const messages: Record<string, string> = {};
  const participants: Record<string, string> = {};

  // Iterate through all localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    // Collect message data
    if (key.startsWith(STORAGE_KEYS.MESSAGE_PREFIX)) {
      const chatId = key.replace(STORAGE_KEYS.MESSAGE_PREFIX, '');
      const value = localStorage.getItem(key);
      if (value) {
        messages[chatId] = value;
      }
    }

    // Collect participant data
    if (key.startsWith(STORAGE_KEYS.PARTICIPANT_PREFIX)) {
      const chatId = key.replace(STORAGE_KEYS.PARTICIPANT_PREFIX, '');
      const value = localStorage.getItem(key);
      if (value) {
        participants[chatId] = value;
      }
    }
  }

  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    data: {
      chats: localStorage.getItem(STORAGE_KEYS.CHATS),
      userStatuses: localStorage.getItem(STORAGE_KEYS.USER_STATUSES),
      messages,
      participants,
    },
  };
}

/**
 * Export localStorage data and download as JSON file
 */
export function downloadLocalStorageData(filename?: string): void {
  const data = exportLocalStorageData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download =
    filename || `chat-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import and restore localStorage data from JSON object
 */
export function importLocalStorageData(data: LocalStorageExport): void {
  // Clear existing data first
  clearAllChatData();

  // Import chats
  if (data.data.chats) {
    localStorage.setItem(STORAGE_KEYS.CHATS, data.data.chats);
  }

  // Import user statuses
  if (data.data.userStatuses) {
    localStorage.setItem(STORAGE_KEYS.USER_STATUSES, data.data.userStatuses);
  }

  // Import messages
  Object.entries(data.data.messages || {}).forEach(([chatId, messageData]) => {
    localStorage.setItem(
      `${STORAGE_KEYS.MESSAGE_PREFIX}${chatId}`,
      messageData
    );
  });

  // Import participants
  Object.entries(data.data.participants || {}).forEach(
    ([chatId, participantData]) => {
      localStorage.setItem(
        `${STORAGE_KEYS.PARTICIPANT_PREFIX}${chatId}`,
        participantData
      );
    }
  );
}

/**
 * Load data from JSON file and restore to localStorage
 */
export function loadLocalStorageFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const data: LocalStorageExport = JSON.parse(content);

        // Validate data structure
        if (!data.data || typeof data.data !== 'object') {
          throw new Error('Invalid data format');
        }

        importLocalStorageData(data);
        resolve();
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error('Failed to parse JSON file')
        );
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Clear all chat-related data from localStorage
 */
export function clearAllChatData(): void {
  const keysToRemove: string[] = [];

  // Find all chat-related keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    if (
      key === STORAGE_KEYS.CHATS ||
      key === STORAGE_KEYS.USER_STATUSES ||
      key.startsWith(STORAGE_KEYS.MESSAGE_PREFIX) ||
      key.startsWith(STORAGE_KEYS.PARTICIPANT_PREFIX)
    ) {
      keysToRemove.push(key);
    }
  }

  // Remove all found keys
  keysToRemove.forEach(key => localStorage.removeItem(key));
}
