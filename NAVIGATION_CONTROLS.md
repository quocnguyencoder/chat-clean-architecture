# Navigation Sidebar Controls

The Navigation Sidebar now includes two utility buttons for managing development/demo features:

## Features Added

### 1. **Reset Data Button** 🔄

- **Icon**: Reload icon (blue)
- **Function**: Clears all LocalStorage and seeds default data
- **Action**: Click to reset data, then automatically refreshes the page
- **Use Case**: Quickly reset to a clean state during development/testing

### 2. **Toggle Mock Responses Button** ⏯️

- **Icon**:
  - Pause icon (orange) when active
  - Play icon (green) when paused
- **Function**: Pause/resume automatic mock responses
- **Actions**:
  - Pauses both automatic responses to your messages
  - Pauses auto-send messages (unread badge testing)
- **Use Case**:
  - Test without interruption from mock responses
  - Debug message flow without automatic replies
  - Control when you want demo interactions

## Technical Implementation

### MockResponseService Updates

Added pause/resume functionality:

- `pause()` - Stop responding to messages and auto-sending
- `resume()` - Resume mock responses
- `toggle()` - Toggle between paused and active states
- `isPausedState()` - Check current pause state

### ChatContext Updates

- Exposed `mockResponseService` in context
- Allows components to access and control the mock service

### UI Updates

- Added two interactive buttons with tooltips
- Keyboard accessible (Enter/Space keys work)
- Visual feedback on hover
- Ant Design message notifications for user feedback

## How to Use

1. **Reset Data**:
   - Click the blue reload icon
   - Confirm the success message
   - Page will auto-refresh with clean data

2. **Pause/Resume Mock Responses**:
   - Click the pause/play icon
   - Orange pause icon = currently active (click to pause)
   - Green play icon = currently paused (click to resume)
   - Toast notification confirms the action

## Benefits

✅ **Quick Data Reset**: No need to manually clear LocalStorage
✅ **Control Mock Responses**: Test scenarios without interference
✅ **Better Development Experience**: Easy access to common dev tasks
✅ **Visual Feedback**: Icons change to show current state
✅ **Keyboard Accessible**: Follows a11y best practices
