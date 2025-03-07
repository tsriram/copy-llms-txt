# CopyLlmsTxt

A lightweight JavaScript library that lets you copy the content of a webpage as
clean markdown with a simple keyboard shortcut.

## Features

- One-key shortcut to copy page content as markdown
- Automatically removes navigation, ads, and other non-content elements
- Customizable options

## Installation

```bash
npm install copy-llms-txt
```

## Basic Usage

```javascript
import CopyLlmsTxt from "copy-llms-txt";

// Initialize with default options
CopyLlmsTxt.init();

// Now use Cmd+C (Mac) or Ctrl+C (Windows/Linux) to copy page content as markdown
```

## Advanced Usage

```javascript
import CopyLlmsTxt from "copy-llms-txt";

// Initialize with custom options
CopyLlmsTxt.init({
  key: "m", // Change shortcut to Cmd+M or Ctrl+M
  meta: true, // Force Meta (Cmd) key even on non-Mac
  turndownOptions: {
    // Turndown service options
    headingStyle: "atx",
    codeBlockStyle: "fenced"
  },
  selectorsToRemove: [
    // Custom selectors to remove
    ".sidebar",
    ".comments",
    "#recommendations"
  ]
});

// Manually trigger copy
document.getElementById("copyBtn").addEventListener("click", () => {
  CopyLlmsTxt.copy();
});

// Clean up when no longer needed
CopyLlmsTxt.destroy();
```

## API Reference

### `init(options?)`

Initializes the library with optional configuration.

Options:

- `key` (string): Keyboard shortcut key. Default: 'c'
- `meta` (boolean): Use Meta key (Cmd on Mac) instead of Ctrl. Default:
  auto-detected
- `turndownOptions` (object): Options for TurndownService HTML-to-markdown
  conversion
- `selectorsToRemove` (string[]): DOM selectors to remove before conversion

### `copy()`

Manually copies the current page content as markdown.

### `destroy()`

Removes event listeners and cleans up the library instance.

## Credits / Dependencies

- [Turndown](https://github.com/domchristie/turndown)

## License

MIT
