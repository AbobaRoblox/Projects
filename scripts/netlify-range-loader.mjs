import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");
const html = readFileSync(indexPath, "utf8");

const moduleScriptPattern =
  /<script type="module" crossorigin src="([^"]+)"><\/script>/;
const match = html.match(moduleScriptPattern);

if (!match) {
  console.warn("[netlify-inline-loader] Vite module script was not found.");
  process.exit(0);
}

const appScriptSrc = match[1];
const appScriptPath = join(distDir, ...appScriptSrc.replace(/^\//, "").split("/"));
const appScript = readFileSync(appScriptPath, "utf8")
  .replaceAll("</script", "<\\/script");

const inlineScript = `<script type="module">\n${appScript}\n</script>`;
const nextHtml = html.replace(moduleScriptPattern, () => inlineScript);

writeFileSync(indexPath, nextHtml, "utf8");
unlinkSync(appScriptPath);

console.log(`[netlify-inline-loader] Inlined ${appScriptSrc} into index.html.`);
