// Wrapper module to simplify navigator.clipboard.writeText's API
// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
export const clipboardAvailable =
  navigator.clipboard && navigator.clipboard.writeText;

// Async as the writeText method is aync, it's result is also returned by this function, so await to ensure it is successful
export async function writeToClipboard(string = "") {
  // Additional safe gaurd here
  if (!clipboardAvailable)
    return alert("[ERR] Cannot copy text to your clipboard");

  return navigator.clipboard.writeText(string);
}
