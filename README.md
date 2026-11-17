# Kuncung — landing page

Situs promosi untuk [**Kuncung**](https://github.com/wicakhendrik/kuncung), notch yang hidup untuk Windows (versi terbaru 0.1.0).

**Tayang di:** <https://kuncung.grezly.app> (cadangan: <https://wicakhendrik.github.io/kuncungweb/>)

Situs statis (HTML, CSS, dan JavaScript murni, tanpa build) dengan replika notch interaktif: ganti **9 gaya** (termasuk tiga tema batik: Parang, Kawung, Mega Mendung), jelajahi 10 fitur (market, **olahraga** dengan hasil Race utama dan Sprint, musik, shalat, kalender, AI, Deck, fokus, **Translate**, notifikasi), dan coba simulasi deteksi tab. Semua data di halaman ini adalah **data contoh**, bukan hasil atau harga resmi.

## Menjalankan lokal

```bash
npx vite . --port 4173
```

Lalu buka <http://localhost:4173>. Bisa juga dengan server statis apa pun (mis. `python -m http.server`).

## Struktur

```
index.html          Halaman tunggal
assets/style.css    Sistem desain, 9 tema notch (termasuk batik), semua bagian halaman
assets/app.js       Notch live, tampilan interaktif (termasuk Olahraga), demo deteksi tab, gaya
assets/favicon.svg  Ikon
downloads/          Installer Windows (diunduh langsung dari situs ini, bukan dari GitHub Releases) dan latest.json
scripts/            publish-installer.mjs: menerbitkan installer hasil build lokal
.nojekyll           Menonaktifkan pemrosesan Jekyll di GitHub Pages
```

## Merilis versi baru (tanpa GitHub Releases)

Installer dihosting langsung di situs ini (folder `downloads/`), jadi rilis cukup dari komputer lokal:

```bash
# 1. di repo Kuncung: bangun installer
npm run tauri build

# 2. di repo situs ini: salin installer terbaru, perbarui tombol unduh, ukuran, dan SHA-256
node scripts/publish-installer.mjs

# 3. terbitkan
git add -A && git commit -m "Rilis x.y.z" && git push
```

Skrip memilih installer berversi tertinggi di `../Kuncung/src-tauri/target/release/bundle/nsis` (atau folder yang kamu beri sebagai argumen), menghapus installer lama dari `downloads/` (riwayatnya tetap ada di git), dan menulis `downloads/latest.json`. Batas GitHub: berkas maksimal 100 MB, dan situs Pages sebaiknya di bawah 1 GB, jadi installer sebesar ±3 MB aman untuk dirilis berkali-kali.

## Deploy (GitHub Pages)

**Settings > Pages > Build and deployment > Deploy from a branch**, pilih branch `main` dan folder `/ (root)`.

### Domain kustom (kuncung.grezly.app)

1. Di pengelola DNS `grezly.app`, buat rekaman **CNAME** untuk `notch` yang menunjuk ke `wicakhendrik.github.io`.
2. Di **Settings > Pages > Custom domain**, isi `kuncung.grezly.app`, simpan, lalu centang **Enforce HTTPS** setelah sertifikat siap.
3. GitHub membuat berkas `CNAME` di repo ini; tag `canonical` dan `og:url` di `index.html` sudah mengarah ke domain tersebut.

## Lisensi

[MIT](LICENSE) © 2026 Muhamad Hendrik Wicaksono.

## Catatan

- Font dimuat dari Google Fonts (Bricolage Grotesque, Hanken Grotesk, Geist Mono, Fraunces).
- Tidak ada pelacak atau analitik.
- Data olahraga dan pasar di replika adalah contoh statis; aplikasi sungguhan memakai data dari ESPN, Jolpica, MotoGP.com, dan Yahoo Finance.
- Nama dan merek lain milik pemiliknya masing-masing.
