# Data Export/Import Feature

This document describes the localStorage data export/import functionality added to the chat application.

## Overview

The application now includes the ability to:

- **Export** all chat data from localStorage to a JSON file
- **Import** chat data from a JSON file back into localStorage

This feature is useful for:

- Backing up your chat data
- Transferring data between different browsers or devices
- Testing with specific data sets
- Sharing conversation histories

## Components

### LocalStorage Manager Utility (`src/utils/localStorageManager.ts`)

Core utility functions for managing localStorage data:

- `exportLocalStorageData()`: Exports all chat data to a JavaScript object
- `downloadLocalStorageData(filename?)`: Downloads data as a JSON file
- `loadLocalStorageFromFile(file)`: Loads data from a JSON file
- `importLocalStorageData(data)`: Imports data into localStorage
- `clearAllChatData()`: Clears all chat-related data

### DataManager Component (`src/ui/components/molecules/DataManager`)

UI component providing export/import buttons:

- **Export Data**: Downloads all localStorage data as a JSON file
- **Import Data**: Opens file picker to load a JSON backup file

## Usage

### Exporting Data

1. Click the "Export Data" button in the chat list sidebar
2. A JSON file will be downloaded with the naming pattern: `chat-backup-YYYY-MM-DD.json`
3. Save the file to your desired location

### Importing Data

1. Click the "Import Data" button in the chat list sidebar
2. Select a previously exported JSON file
3. The application will:
   - Clear existing localStorage data
   - Import the data from the file
   - Automatically refresh the page to show the imported data

## Data Structure

The exported JSON file contains:

```json
{
  "version": "1.0.0",
  "timestamp": "2025-11-03T...",
  "data": {
    "chats": "...",
    "userStatuses": "...",
    "messages": {
      "chat-id-1": "...",
      "chat-id-2": "..."
    },
    "participants": {
      "chat-id-1": "...",
      "chat-id-2": "..."
    }
  }
}
```

### Storage Keys

The following localStorage keys are managed:

- `chat-app-chats`: All chat conversations
- `chat-user-statuses`: User online/offline statuses
- `chat-messages-{chatId}`: Messages for each chat
- `chat-participants-{chatId}`: Participants for each chat

## Implementation Details

### Clean Architecture

The feature follows the clean architecture principles:

- **Utilities**: Pure functions in `utils/localStorageManager.ts`
- **UI Components**: Presentational component in `molecules/DataManager`
- **Repository Integration**: Works with existing repository implementations

### Error Handling

- Invalid JSON files are rejected with user-friendly error messages
- Only `.json` files can be uploaded
- Data validation ensures proper structure before import
- All errors are shown via Ant Design message notifications

## Location in UI

The DataManager component is integrated into the ChatList sidebar, positioned:

- Below the "Chats" header
- Above the search input
- Visible on all chat pages

## Future Enhancements

Potential improvements:

- Selective export (specific chats only)
- Data encryption for security
- Cloud backup integration
- Import preview before applying changes
- Merge option (instead of replace)
- Version migration support
