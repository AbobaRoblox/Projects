import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");
const html = readFileSync(indexPath, "utf8");
const chunkSize = 6000;

const moduleScriptPattern =
  /<script type="module" crossorigin src="([^"]+)"><\/script>/;
const match = html.match(moduleScriptPattern);

if (!match) {
  console.warn("[netlify-chunk-loader] Vite module script was not found.");
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
  const chunkName = `${baseName}.part-${suffix}.txt`;
  const chunkUrl = appScriptSrc.replace(/[^/]+$/, chunkName);
  const chunkPath = join(distDir, ...chunkUrl.replace(/^\//, "").split("/"));

  writeFileSync(
    chunkPath,
    appScript.subarray(offset, offset + chunkSize).toString("base64"),
    "utf8",
  );
  chunkUrls.push(chunkUrl);
}

unlinkSync(appScriptPath);

const loader = `<script type="module">
const appChunks = ${JSON.stringify(chunkUrls)}.map((chunkUrl) =>
  new URL(chunkUrl, window.location.href).href
);
const maxAttempts = 5;

function showLoadError(error) {
  console.error("[RustLex] App script load failed", error);
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;background:#0b0d0c;color:#f3e7d0;font:16px/1.5 system-ui,sans-serif;padding:24px"><div style="max-width:520px;border:1px solid rgba(222,135,61,.35);background:rgba(21,23,22,.94);padding:22px;border-radius:14px;box-shadow:0 20px 80px rgba(0,0,0,.35)"><strong style="display:block;color:#f59e0b;font-size:20px;margin-bottom:8px">RustLex не загрузился до конца</strong><span>Netlify оборвал один из маленьких файлов. Обнови страницу: загрузчик повторит скачивание.</span></div></div>';
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function requestChunk(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.timeout = 12000;
    request.onload = () => {
      if (request.status >= 200 && request.status < 300 && request.responseText) {
        resolve(decodeBase64Chunk(request.responseText.trim()));
        return;
      }

      reject(new Error("Chunk request failed: " + request.status));
    };
    request.onerror = () => reject(new Error("Chunk network error"));
    request.ontimeout = () => reject(new Error("Chunk request timeout"));
    request.send();
  });
}

function decodeBase64Chunk(value) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function fetchChunk(url) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await requestChunk(url);
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      await wait(300 * attempt);
    }
  }

  throw new Error("Chunk request failed");
}

async function importAppScript() {
  const parts = [];

  for (const chunkUrl of appChunks) {
    parts.push(await fetchChunk(chunkUrl));
  }

  const blob = new Blob(parts, { type: "text/javascript" });
  const blobUrl = URL.createObjectURL(blob);

  try {
    await import(blobUrl);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

importAppScript().catch(showLoadError);
</script>`;

const nextHtml = html.replace(moduleScriptPattern, () => loader);
writeFileSync(indexPath, nextHtml, "utf8");

console.log(
  `[netlify-chunk-loader] Split ${appScriptSrc} into ${chunkUrls.length} text chunks.`,
);
