import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");
const html = readFileSync(indexPath, "utf8");
const chunkSize = 12000;

const moduleScriptPattern =
  /<script type="module" crossorigin src="([^"]+)"><\/script>/;
const match = html.match(moduleScriptPattern);

if (!match) {
  console.warn("[netlify-range-loader] Vite module script was not found.");
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

  writeFileSync(chunkPath, appScript.subarray(offset, offset + chunkSize));
  chunkUrls.push(chunkUrl);
}

unlinkSync(appScriptPath);

const loader = `<script type="module">
const appChunks = ${JSON.stringify(chunkUrls)}.map((chunkUrl) =>
  new URL(chunkUrl, window.location.href).href
);
const parallelLoads = 4;
const maxAttempts = 4;

function showLoadError(error) {
  console.error("[RustLex] App script load failed", error);
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;background:#0b0d0c;color:#f3e7d0;font:16px/1.5 system-ui,sans-serif;padding:24px"><div style="max-width:520px;border:1px solid rgba(222,135,61,.35);background:rgba(21,23,22,.94);padding:22px;border-radius:14px;box-shadow:0 20px 80px rgba(0,0,0,.35)"><strong style="display:block;color:#f59e0b;font-size:20px;margin-bottom:8px">RustLex не загрузился до конца</strong><span>Netlify отдал страницу, но один из маленьких файлов приложения оборвался. Обнови страницу: браузер повторит загрузку чанков.</span></div></div>';
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function fetchChunk(url) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, { cache: "force-cache" });

      if (!response.ok) {
        throw new Error("Chunk request failed: " + response.status);
      }

      return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      await wait(250 * attempt);
    }
  }

  throw new Error("Chunk request failed");
}

async function importAppScript() {
  const parts = [];

  for (let index = 0; index < appChunks.length; index += parallelLoads) {
    const batch = appChunks
      .slice(index, index + parallelLoads)
      .map((chunkUrl) => fetchChunk(chunkUrl));
    parts.push(...(await Promise.all(batch)));
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

const nextHtml = html.replace(moduleScriptPattern, loader);
writeFileSync(indexPath, nextHtml, "utf8");

console.log(
  `[netlify-range-loader] Split ${appScriptSrc} into ${chunkUrls.length} small chunks.`,
);
