# 無料鑑定お申し込み後の自動返信（イルミ版）

公開URLは、Netlify のサイト名を `irumi-akari` にした場合のものです（2026-10-21 時点で空いています）。
別の名前にしたときは、下の URL の `irumi-akari` の部分だけ差し替えてください。

```
無料鑑定のお申込み
ありがとうございます🌙

カード1枚引きによる簡易鑑定を
させていただきます。

順番に占っておりますので、
しばらくの間おまちくださいね。

無料鑑定の結果は
48時間以内にお届け予定です

お時間をいただきますので

「占いを味方にする受け取り方」

についてまとめた
限定ページをお送りします。

鑑定結果が届くまでに
ぜひ読んでみてくださいね🌙 

【鑑定が届く前に、そっと読んでほしい七つのおはなし】
https://irumi-akari.netlify.app/
```

## 公開のしかた（Netlify）
1. https://app.netlify.com/drop を開き、このフォルダ（`pages/irumi_nanatsu`）ごとドラッグ＆ドロップする
   （`index.html` と `img/` が一番上に来るように。`message.md`・`credits.md` は入っていても問題ありません）
2. 「Site configuration」→「Change site name」で `irumi-akari` にする
3. `https://irumi-akari.netlify.app/` を開いて表示を確かめる

## 公開前に差し替えてほしいところ
- `index.html` の一番下「公式LINEにもどる」のリンク先 `https://lin.ee/XXXXXXX` → イルミの公式LINEのURL
