# Media Operations Hook

This documentation explains how to use the `useMediaOperations` hook for handling audio, video, and screen recording operations throughout the application.

## Overview

The `useMediaOperations` hook provides a consistent way to view and download media files (audio, video, and screen recordings) across different components in the application.

## Installation

To use the hook in any component:

```javascript
import { useMediaOperations } from '../hooks/useMediaOperations';
```

Then in your component:

```javascript
const MyComponent = () => {
  const { mediaOperations, viewAudio, downloadAudio, viewVideo, downloadVideo, extractFileKey } = useMediaOperations();
  
  // ... rest of your component
};
```

## Available Functions

### `viewAudio(audioPath, index)`
- **Description**: Opens the audio file in a new tab for playback
- **Parameters**:
  - `audioPath` (string): The full path to the audio file
  - `index` (number): Index for tracking the operation state
- **Returns**: Promise

### `downloadAudio(audioPath, index)`
- **Description**: Downloads the audio file
- **Parameters**:
  - `audioPath` (string): The full path to the audio file
  - `index` (number): Index for tracking the operation state
- **Returns**: Promise

### `viewVideo(type, filePath)`
- **Description**: Opens the video or screen recording in a new tab for playback
- **Parameters**:
  - `type` (string): Either 'video' or 'screen'
  - `filePath` (string): The full path to the video file
- **Returns**: Promise

### `downloadVideo(type, filePath)`
- **Description**: Downloads the video or screen recording
- **Parameters**:
  - `type` (string): Either 'video' or 'screen'
  - `filePath` (string): The full path to the video file
- **Returns**: Promise

### `extractFileKey(filePath)`
- **Description**: Extracts the file key from a full file path
- **Parameters**:
  - `filePath` (string): The full path to the file
- **Returns**: string or null

## State Management

The hook provides a `mediaOperations` state object to track the status of media operations:

```javascript
mediaOperations: {
  video: { viewing: boolean, downloading: boolean },
  screen: { viewing: boolean, downloading: boolean },
  audio: {
    [index]: { viewing: boolean, downloading: boolean }
  }
}
```

## Usage Examples

### In a table component:

```javascript
const TableRow = ({ recording, index }) => {
  const { mediaOperations, viewVideo, downloadVideo } = useMediaOperations();
  
  return (
    <tr>
      <td>
        {recording.videoPath && (
          <button 
            onClick={() => viewVideo('video', recording.videoPath)}
            disabled={mediaOperations.video?.viewing}
          >
            {mediaOperations.video?.viewing ? 'Viewing...' : 'View Video'}
          </button>
        )}
      </td>
      <td>
        {recording.videoPath && (
          <button 
            onClick={() => downloadVideo('video', recording.videoPath)}
            disabled={mediaOperations.video?.downloading}
          >
            {mediaOperations.video?.downloading ? 'Downloading...' : 'Download Video'}
          </button>
        )}
      </td>
    </tr>
  );
};
```

### For audio files:

```javascript
const AudioPlayer = ({ audioPath, index }) => {
  const { mediaOperations, viewAudio, downloadAudio } = useMediaOperations();
  
  return (
    <div>
      <button 
        onClick={() => viewAudio(audioPath, index)}
        disabled={mediaOperations.audio[index]?.viewing}
      >
        {mediaOperations.audio[index]?.viewing ? 'Playing...' : 'Play Audio'}
      </button>
      <button 
        onClick={() => downloadAudio(audioPath, index)}
        disabled={mediaOperations.audio[index]?.downloading}
      >
        {mediaOperations.audio[index]?.downloading ? 'Downloading...' : 'Download Audio'}
      </button>
    </div>
  );
};
```

## Error Handling

The hook automatically handles errors and displays appropriate toast notifications using react-toastify. All functions include try/catch blocks and proper cleanup in finally blocks.

## Best Practices

1. Always check if a file path exists before calling media operations
2. Use the provided state to disable buttons during operations to prevent duplicate requests
3. Provide visual feedback to users during loading states
4. Handle errors gracefully and inform users when operations fail

## Components Using This Hook

- `CandidateTable` - For candidate assessment media
- `ScheduledTestDetails` - For scheduled test recordings
- `ResponseTable` - For response media files
- `ScheduledTestsList` - For scheduled test listings
- `History` - For historical assessment media
- `Reports` - For assessment reports with media