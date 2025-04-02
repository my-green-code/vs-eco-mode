# Eco Mode for VS Code and Cursor

A VS Code/Cursor extension that automatically pauses power-intensive features when you're inactive, helping to reduce energy consumption and improve battery life.

## Features

- 🚀 **Automatic Energy Saving**: Automatically detects when you're inactive and disables power-intensive features
- 💤 **Smart Feature Management**: Toggles various editor features to save energy:
  - Minimap
  - Smooth Scrolling
  - GPU Acceleration
  - Inline Completions
- ⚡ **Quick Toggle**: Manually enable/disable Eco Mode with a keyboard shortcut
- ⚙️ **Settings Panel**: Customize which features are affected by Eco Mode
- 🔄 **Auto-Recovery**: Automatically restores all features when you return to activity

## Installation

### VS Code

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "Eco Mode"
4. Click Install

### Cursor

1. Open Cursor
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "Eco Mode"
4. Click Install

## Usage

### Automatic Mode

- The extension automatically activates after 30 seconds of inactivity
- All power-intensive features are automatically disabled
- Features are restored when you return to activity

### Manual Control

- Use the command palette (Ctrl+Shift+P or Cmd+Shift+P) and type "Eco Mode"
- Select "Eco Mode: Toggle Eco Mode" to manually enable/disable
- Use the keyboard shortcut Ctrl+Shift+E (or Cmd+Shift+E on Mac)

### Settings

- Open the command palette (Ctrl+Shift+P or Cmd+Shift+P)
- Type "Eco Mode" and select "Eco Mode: Open Eco Mode Settings"
- Customize which features are affected by Eco Mode

## Features Affected by Eco Mode

- **Minimap**: Disabled to reduce rendering overhead
- **Smooth Scrolling**: Disabled to reduce GPU usage
- **GPU Acceleration**: Set to "off" in the terminal
- **Inline Completions**: Disabled to reduce CPU usage

## Requirements

- VS Code or Cursor version 1.85.0 or higher

## Extension Settings

The extension uses the following VS Code settings:

- `editor.minimap.enabled`
- `editor.smoothScrolling`
- `terminal.integrated.gpuAcceleration`
- `cursor.inlineCompletions.enabled`

## Known Issues

- None reported yet

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License - see the LICENSE file for details.

## Credits

Created by Christophe Bellec - my-green-code

## Support

If you encounter any issues or have suggestions, please open an issue on the GitHub repository.
