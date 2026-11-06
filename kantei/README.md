# イルミ本鑑定LP（kantei/）

公式LINEで無料ワンポイント鑑定を受け取った方向けの、有料鑑定の案内ページです。
HTML / CSS / JavaScript だけで動きます（ビルド不要）。

## ファイル
- `index.html` … ページ本体
- `assets/js/config.js` … **価格・日数・URL・実績などの可変値はここだけ**
- `assets/js/main.js` … タイマー・カウンター・FAQ・固定バーなどの動き
- `assets/css/style.css` … デザイン
- `assets/img/` … 画像（置き場所は `assets/img/README.md`）
- `legal/` … 特定商取引法に基づく表記・プライバシーポリシー（ひな形）
- `COPY.md` … コピー原稿

## プレビュー
- 手元：`kantei/index.html` をブラウザで開く。
  またはリポジトリ直下で `python3 -m http.server 8000` を実行し、http://localhost:8000/kantei/ を開く。
- GitHub Pages：公開URLの末尾に `/kantei/` を付けて開く。

## タイマー
- 初めて開いた日を1日目として、`limit.days` 日目の24時に終了します（localStorage に保存）。
- 自分の端末だけリセットしたいときは、URLの末尾に `?timer=reset` を付けて開きます。
- 期限が切れると「限定料金は終了し、通常料金でのご案内です」が表示され、価格と決済リンクは通常のものに切り替わります。
