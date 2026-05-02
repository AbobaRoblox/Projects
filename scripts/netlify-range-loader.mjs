import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");
const html = readFileSync(indexPath, "utf8");

const moduleScriptPattern =
  /<script type="module" crossorigin src="([^"]+)"><\/script>/;
const match = html.match(moduleScriptPattern);

if (!match) {
  console.warn("[netlify-range-loader] Vite module script was not found.");
  process.exit(0);
}

const appScriptSrc = match[1];

const loader = `<script type="module">
const appScriptSrc = ${JSON.stringify(appScriptSrc)};
const chunkSize = 16000;
const parallelLoads = 4;

function showLoadError(error) {
  console.error("[RustLex] App script load failed", error);
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;background:#0b0d0c;color:#f3e7d0;font:16px/1.5 system-ui,sans-serif;padding:24px"><div style="max-width:520px;border:1px solid rgba(222,135,61,.35);background:rgba(21,23,22,.94);padding:22px;border-radius:14px;box-shadow:0 20px 80px rgba(0,0,0,.35)"><strong style="display:block;color:#f59e0b;font-size:20px;margin-bottom:8px">RustLex не загрузился до конца</strong><span>Netlify отдал страницу, но большой файл приложения оборвался. Обнови страницу или открой сайт позже, когда CDN отдаст файл нормально.</span></div></div>';
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

async function getScriptSize() {
  const response = await fetchWithTimeout(appScriptSrc, {
    method: "HEAD",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("HEAD failed: " + response.status);
  }

  const length = Number(response.headers.get("content-length"));
  if (!Number.isFinite(length) || length <= 0) {
    throw new Error("Missing content-length for app script");
  }

  return length;
}

async function fetchRange(start, end) {
  const response = await fetchWithTimeout(appScriptSrc, {
    headers: { Range: "bytes=" + start + "-" + end },
    cache: "force-cache",
  });

  if (response.status !== 206) {
    throw new Error("Range request failed: " + response.status);
  }

  return new Uint8Array(await response.arrayBuffer());
}

async function importAppScript() {
  const size = await getScriptSize();
  const ranges = [];

  for (let start = 0; start < size; start += chunkSize) {
    ranges.push([start, Math.min(size - 1, start + chunkSize - 1)]);
  }

  const parts = [];
  for (let index = 0; index < ranges.length; index += parallelLoads) {
    const batch = ranges
      .slice(index, index + parallelLoads)
      .map(([start, end]) => fetchRange(start, end));
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
  `[netlify-range-loader] Replaced ${appScriptSrc} with inline Range loader.`,
);
