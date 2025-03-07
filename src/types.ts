import TurndownService from "turndown";

/**
 * Options for the CopyLlmsTxt library
 */
export interface CopyLlmsTxtOptions {
  /** Keyboard shortcut key (e.g., 'c' for Ctrl+C or Meta+C) */
  key?: string;
  /** Whether to use the Meta key instead of Ctrl key */
  meta?: boolean;
  /** Options to pass to the TurndownService */
  turndownOptions?: TurndownService.Options;
  /** Selectors to remove from the DOM before conversion (e.g., 'nav', '.ads') */
  selectorsToRemove?: string[];
}
