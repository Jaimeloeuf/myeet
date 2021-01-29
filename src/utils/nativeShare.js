// Wrapper module to simplify navigator.share's API
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
export const nativeShareAvailable = !!navigator.share;
export function nativeShare(
  content = {
    url: "",
    text: "",
    title: "",
  }
) {
  // Additional safe gaurd here
  if (!navigator.share)
    return alert("[ERR] Native sharing not available on your device");

  // Catch block with a no-op because if the user cancels/quits the share UI, it is treated as an error
  navigator.share(content).catch(() => {});
}
