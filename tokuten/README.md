# イルミ 公式LINE登録特典ページ（tokuten/）

公式LINEに登録してくれた方へ渡す、読みもの形式の特典ページです。HTML・CSS・JSだけで、ビルドは要りません。
GitHub Pages では `https://<ユーザー名>.github.io/<リポジトリ名>/tokuten/` で公開されます。

```
tokuten/
├─ index.html            本文（コピー）
├─ COPY.md               コピー全文＋文体ルールのチェック結果
└─ assets/
   ├─ js/config.js       ★可変値（タイトル・LINE URL・無料鑑定の案内など）はすべてここ
   ├─ js/main.js         CONFIGの反映・画像の差し替え・フェードイン
   ├─ css/style.css      デザイン
   └─ img/               画像置き場（下記のファイル名で置くと自動で表示されます）
```

## プレビューの開き方

- いちばん簡単な方法：`tokuten/index.html` をブラウザにドラッグ＆ドロップします。
- ローカルサーバーで開く方法：リポジトリ直下で `python3 -m http.server 8000` を実行し、`http://localhost:8000/tokuten/` を開きます。
- スマホ表示の確認：Chrome の DevTools（F12）でデバイスツールバーを開き、iPhone などを選びます。

## 差し替えが必要な項目

| 項目 | 場所 | 現在の状態 |
|---|---|---|
| 無料鑑定の申し込み方法（LINEで送る内容など） | `config.js` → `freeReading.howTo` | ★未設定。ページ上には点線枠の「差し替え待ち」が出ています |
| 無料鑑定の補足（返信の目安・受付条件など） | `config.js` → `freeReading.note` | ★未設定。不要なら `''` にすると非表示になります |
| ファーストビューの画像 | `assets/img/fv.jpg` | ★未配置。静物（花・灯り・便箋など）で、縦長4:5・800×1000px以上 |
| 手紙の章のイルミのアイコン | `assets/img/irumi.jpg` | ★未配置。正方形・400×400px以上（丸く切り抜いて表示します） |
| 特典タイトル・サブコピー | `config.js` → `gift.title` / `gift.pageTitle` / `gift.subcopy` | 仮の文言が入っています。変えるときは `title`（改行あり）と `pageTitle`（1行）の両方を直してください |
| ボタンの文言 | `config.js` → `cta.label` / `cta.sub` | 「公式LINEを開く」 |
| LINE URL・Instagram | `config.js` → `links` | 設定済み（https://lin.ee/weEZDF0 ／ @irumi_uranai） |
| OGP画像（SNSで共有されたときの画像） | `index.html` の `<head>` | 未設定。必要になったら追加します |

※ `index.html` の `<title>` と本文の初期値は、JSが動かない環境のための予備です。正しい値は `config.js` のほうです。
