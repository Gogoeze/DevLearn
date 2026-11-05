/**
 * Runs inside the preview iframe and forwards console output and errors to the parent window.
 */
const CONSOLE_BRIDGE = `<script>
(function () {
  function send(kind, text) {
    parent.postMessage({ type: 'devlearn-console', kind: kind, text: text }, '*');
  }
  ['log', 'warn', 'error'].forEach(function (kind) {
    var original = console[kind];
    console[kind] = function () {
      var text = Array.prototype.map.call(arguments, function (arg) {
        try { return typeof arg === 'object' ? JSON.stringify(arg) : String(arg); }
        catch (e) { return String(arg); }
      }).join(' ');
      send(kind, text);
      original.apply(console, arguments);
    };
  });
  window.addEventListener('error', function (e) { send('error', e.message); });
})();
</script>`

const BASE_STYLES = `<style>
  body { margin: 16px; font-family: Inter, system-ui, sans-serif; line-height: 1.5; color: #0f172a; }
</style>`

/** Wraps the student's code (a body fragment) in a full document for the preview iframe. */
export function buildSrcDoc(code: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${CONSOLE_BRIDGE}${BASE_STYLES}</head><body>${code}</body></html>`
}
