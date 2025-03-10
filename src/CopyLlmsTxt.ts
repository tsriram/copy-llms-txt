import TurndownService from "turndown";
import { CopyLlmsTxtOptions } from "./types";

/**
 * A library to copy the content of the current page as markdown
 */
class CopyLlmsTxt {
  // Initialize with default values to fix the "no initializer" error
  private options: CopyLlmsTxtOptions = {
    key: "c",
    meta: false,
    turndownOptions: {},
    selectorsToRemove: [
      "nav",
      "header",
      "footer",
      "aside",
      ".navigation",
      ".nav",
      ".menu",
      ".sidebar",
      ".ad",
      ".ads",
      ".advertisement",
      "script",
      "style",
      "noscript",
      "iframe"
    ]
  };
  private turndownService: TurndownService;
  private initialized: boolean = false;

  constructor() {
    // Initialize turndown service with empty options until init is called
    this.turndownService = new TurndownService();
  }

  /**
   * Determine if the current platform is macOS
   */
  private isMac(): boolean {
    return (
      navigator.platform.toLowerCase().includes("mac") ||
      navigator.userAgent.toLowerCase().includes("mac")
    );
  }

  /**
   * Initialize the CopyLlmsTxt library
   * @param options Configuration options (optional)
   */
  public init(options?: CopyLlmsTxtOptions): void {
    if (this.initialized) {
      console.warn(
        "CopyLlmsTxt is already initialized. Call destroy() before reinitializing."
      );
      return;
    }

    // Set default options based on platform (Mac or non-Mac)
    const defaultOptions: CopyLlmsTxtOptions = {
      key: "c",
      meta: this.isMac(), // Use meta (Cmd) on Mac, Ctrl elsewhere
      turndownOptions: {},
      selectorsToRemove: [
        "nav",
        "header",
        "footer",
        "aside",
        ".navigation",
        ".nav",
        ".menu",
        ".sidebar",
        ".ad",
        ".ads",
        ".advertisement",
        "script",
        "style",
        "noscript",
        "iframe"
      ]
    };

    // Merge provided options with defaults
    this.options = {
      ...defaultOptions,
      ...options
    };

    // Initialize turndown service
    this.turndownService = new TurndownService(this.options.turndownOptions);

    // Add event listener
    document.addEventListener("keydown", this.handleKeyDown);
    this.initialized = true;

    console.log(
      `CopyLlmsTxt initialized. Press ${
        this.options.meta ? "Meta/Cmd" : "Ctrl"
      }+${this.options.key} to copy content as markdown.`
    );
  }

  /**
   * Destroy the CopyLlmsTxt instance and remove event listeners
   */
  public destroy(): void {
    if (!this.initialized) {
      return;
    }

    document.removeEventListener("keydown", this.handleKeyDown);
    this.initialized = false;
    console.log("CopyLlmsTxt destroyed.");
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const isModifierPressed = this.options.meta ? event.metaKey : event.ctrlKey;

    if (
      isModifierPressed &&
      event.key.toLowerCase() === this.options.key!.toLowerCase()
    ) {
      event.preventDefault();
      this.copyPageContent();
    }
  };

  /**
   * Copy the current page content as markdown
   */
  private copyPageContent(): void {
    try {
      // Get the entire page content
      const clonedBodyElement = document.body.cloneNode(true) as HTMLElement;

      // Remove any unwanted elements (navigation, ads, etc.)
      this.cleanupDOM(clonedBodyElement);

      // Convert to markdown
      const markdown = this.turndownService.turndown(clonedBodyElement);

      // Copy to clipboard
      navigator.clipboard
        .writeText(markdown)
        .then(() => {
          console.log("Page content copied as markdown!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } catch (error) {
      console.error("Error copying page content:", error);
    }
  }

  private removeNonVisibleElements(clonedBody: HTMLElement): void {
    // Get all elements in the cloned body and original body
    const originalElements = document.body.querySelectorAll("*");
    const clonedElements = clonedBody.querySelectorAll("*");

    // Ensure we have the same number of elements in both trees
    if (originalElements.length !== clonedElements.length) {
      console.warn("Element count mismatch between original and clone");
    } else {
      // Iterate through each element (backwards to handle removals)
      for (let i = clonedElements.length - 1; i >= 0; i--) {
        const originalElement = originalElements[i];
        const clonedElement = clonedElements[i];

        // Check visibility based on the original element
        const computedStyle = window.getComputedStyle(originalElement);
        const rect = originalElement.getBoundingClientRect();

        const isHidden =
          computedStyle.display === "none" ||
          computedStyle.visibility === "hidden" ||
          computedStyle.opacity === "0" ||
          rect.height === 0 ||
          rect.width === 0;

        // Remove the corresponding cloned element if original is not visible
        if (isHidden && clonedElement.parentNode) {
          clonedElement.parentNode.removeChild(clonedElement);
        }
      }
    }
  }

  private removeElementsBySelector(bodyElement: HTMLElement): void {
    // Remove common non-content elements
    const selectorsToRemove = [
      "nav",
      "header",
      "footer",
      "aside",
      ".navigation",
      ".nav",
      ".menu",
      ".sidebar",
      ".ad",
      ".ads",
      ".advertisement",
      "script",
      "style",
      "noscript",
      "iframe"
    ];

    selectorsToRemove.forEach((selector) => {
      const elements = bodyElement.querySelectorAll(selector);
      elements.forEach((el) => el.parentNode?.removeChild(el));
    });
  }

  /**
   * Clean up the DOM element by removing unwanted elements
   */
  private cleanupDOM(clonedBodyElement: HTMLElement): void {
    // this needs to be run first before we mutate cloned body
    this.removeNonVisibleElements(clonedBodyElement);
    this.removeElementsBySelector(clonedBodyElement);
  }

  /**
   * Manually copy the current page content as markdown
   */
  public copy(): void {
    this.copyPageContent();
  }
}

// Export as a singleton
export default new CopyLlmsTxt();
