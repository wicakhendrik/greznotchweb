// Menerbitkan installer Kuncung yang dibangun di komputer lokal ke situs ini (tanpa GitHub Releases).
//
//   node scripts/publish-installer.mjs [folder-installer]
//
// Folder bawaan: ../GrezNotch/src-tauri/target/release/bundle/nsis (hasil `npm run tauri build`).
// Yang dilakukan:
//   1. memilih installer Kuncung_<versi>_x64-setup.exe dengan versi tertinggi,
//   2. menyalinnya ke downloads/ dan menghapus installer lama di folder itu (riwayat tetap ada di git),
//   3. menulis downloads/latest.json (versi, ukuran, SHA-256, tanggal),
//   4. memperbarui nama berkas, tombol unduh, ukuran, dan SHA-256 di index.html serta versi di README.md.
// Setelah itu tinggal: git add -A && git commit && git push.
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = resolve(process.argv[2] ?? join(root, "..", "GrezNotch", "src-tauri", "target", "release", "bundle", "nsis"));
const outDir = join(root, "downloads");
const NAME = /^Kuncung_(\d+)\.(\d+)\.(\d+)_x64-setup\.exe$/;

if (!existsSync(srcDir)) {
  console.error(`Folder installer tidak ditemukan: ${srcDir}\nBangun dulu aplikasinya (npm run tauri build) atau beri jalur folder sebagai argumen.`);
  process.exit(1);
}
const newest = readdirSync(srcDir)
  .map((f) => ({ f, m: NAME.exec(f) }))
  .filter((x) => x.m)
  .sort((a, b) => {
    for (let i = 1; i <= 3; i++) if (+a.m[i] !== +b.m[i]) return +b.m[i] - +a.m[i];
    return 0;
  })[0];
if (!newest) {
  console.error(`Tidak ada Kuncung_x.y.z_x64-setup.exe di ${srcDir}`);
  process.exit(1);
}

const version = `${newest.m[1]}.${newest.m[2]}.${newest.m[3]}`;
const file = newest.f;
mkdirSync(outDir, { recursive: true });
for (const f of readdirSync(outDir)) if (NAME.test(f) && f !== file) rmSync(join(outDir, f));
copyFileSync(join(srcDir, file), join(outDir, file));

const bytes = readFileSync(join(outDir, file));
const sha256 = createHash("sha256").update(bytes).digest("hex");
const size = statSync(join(outDir, file)).size;
const mb = (size / 1048576).toFixed(2).replace(".", ",");
const date = new Date().toISOString().slice(0, 10);
writeFileSync(join(outDir, "latest.json"), JSON.stringify({ version, file, size, sha256, date }, null, 2) + "\n");

// index.html
const htmlPath = join(root, "index.html");
let html = readFileSync(htmlPath, "utf8");
const rep = (re, to, label) => {
  if (!re.test(html)) {
    console.error(`Peringatan: penanda "${label}" tidak ditemukan di index.html`);
    return;
  }
  html = html.replace(re, to);
};
rep(/(<code id="dl-file">)[^<]*(<\/code>)/, `$1${file}$2`, "dl-file");
rep(/(<a class="btn primary" id="dl-btn" href=")[^"]*(" download>)[^<]*(<\/a>)/, `$1downloads/${file}$2Unduh v${version} (${mb} MB)$3`, "dl-btn");
rep(/(<span id="dl-meta">)[\s\S]*?(<\/span>)/, `$1Ukuran ${mb} MB · SHA-256: <code>${sha256}</code>$2`, "dl-meta");
writeFileSync(htmlPath, html);

// README.md
const readmePath = join(root, "README.md");
let readme = readFileSync(readmePath, "utf8");
readme = readme.replace(/\(versi terbaru \d+\.\d+\.\d+\)/, `(versi terbaru ${version})`);
writeFileSync(readmePath, readme);

console.log(`Kuncung ${version} (${mb} MB) diterbitkan ke downloads/${file}\nSHA-256 ${sha256}\nSelanjutnya: git add -A && git commit -m "Rilis ${version}" && git push`);
