// Logger utility for webview
class Logger {
  static log(message) {
    const el = document.getElementById("log");
    if (el) {
      el.innerText = message;
      // Show log container when content is added
      el.style.display = 'block';
    }
    console.log(message);
  }
}

// Global log function for backward compatibility
const log = (message) => Logger.log(message);