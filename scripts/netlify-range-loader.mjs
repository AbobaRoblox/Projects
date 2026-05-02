import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");
const html = readFileSync(indexPath, "utf8");
const chunkSize = 9000;

const moduleScriptPattern =
  /<script type="module" crossorigin src="([^"]+)"><\/script>/;
const match = html.match(moduleScriptPattern);

if (!match) {
  console.warn("[netlify-script-loader] Vite module script was not found.");
  process.exit(0);
}

const appScriptSrc = match[1];
const appScriptPath = join(distDir, ...appScriptSrc.replace(/^\//, "").split("/"));
const appScript = readFileSync(appScriptPath);
const originalExtension = extname(appScriptSrc);
const baseName = basename(appScriptSrc, originalExtension);
const chunkUrls = [];

for (let offset = 0, index = 0; offset < appScript.length; offset += chunkSize, index += 1) {
  const suffix = String(index).padStart(3, "0");
  const chunkName = `${baseName}.part-${suffix}.js`;
  const chunkUrl = appScriptSrc.replace(/[^/]+$/, chunkName);
  const chunkPath = join(distDir, ...chunkUrl.replace(/^\//, "").split("/"));
  const encoded = appScript.subarray(offset, offset + chunkSize).toString("base64");

  writeFileSync(
    chunkPath,
    `window.__RUSTLEX_CHUNKS=window.__RUSTLEX_CHUNKS||[];window.__RUSTLEX_CHUNKS[${index}]=${JSON.stringify(encoded)};\n`,
    "utf8",
  );
  chunkUrls.push(chunkUrl);
}

unlinkSync(appScriptPath);

const chunkScripts = chunkUrls
  .map((chunkUrl) => `<script src="${chunkUrl}"></script>`)
  .join("\n    ");

const bootScript = `<script>
window.__RUSTLEX_CHUNKS = window.__RUSTLEX_CHUNKS || [];
(function () {
  function showLoadError(error) {
    console.error("[RustLex] App script load failed", error);
    var root = document.getElementById("root");
    if (!root) return;
    root.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;background:#0b0d0c;color:#f3e7d0;font:16px/1.5 system-ui,sans-serif;padding:24px"><div style="max-width:520px;border:1px solid rgba(222,135,61,.35);background:rgba(21,23,22,.94);padding:22px;border-radius:14px;box-shadow:0 20px 80px rgba(0,0,0,.35)"><strong style="display:block;color:#f59e0b;font-size:20px;margin-bottom:8px">RustLex не загрузился до конца</strong><span>Один из маленьких файлов не дошёл с Netlify. Обнови страницу: браузер повторит загрузку.</span></div></div>';
  }

  function decodeBase64Chunk(value) {
    var binary = window.atob(value);
    var bytes = new Uint8Array(binary.length);
    for (var index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  async function bootRustLex() {
    var expected = ${chunkUrls.length};
    var chunks = window.__RUSTLEX_CHUNKS;
    if (!chunks || chunks.length < expected || chunks.some(function (chunk) { return !chunk; })) {
      throw new Error("Missing app chunk");
    }

    var parts = chunks.map(decodeBase64Chunk);
    var blob = new Blob(parts, { type: "text/javascript" });
    var blobUrl = URL.createObjectURL(blob);

    try {
      await import(blobUrl);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  function start() {
    bootRustLex().catch(showLoadError);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
</script>`;

const loader = `<script>window.__RUSTLEX_CHUNKS=[];</script>\n    ${chunkScripts}\n    ${bootScript}`;
const nextHtml = html.replace(moduleScriptPattern, () => loader);
writeFileSync(indexPath, nextHtml, "utf8");

console.log(
  `[netlify-script-loader] Split ${appScriptSrc} into ${chunkUrls.length} script chunks.`,
);
