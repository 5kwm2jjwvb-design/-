# 背景画像の出典

## 画像の用意のしかた
1. **画像生成**：Claude Code から使える画像生成の手段（画像生成のMCPツール、Codex CLI など）が設定されていなかったため、使えないものとして次へ。
2. **Unsplash**：検索ページは開けたが、ダウンロード用URL（`/photos/<ID>/download`）が 401 で断られたため、1回でやめて次へ。
3. **Pexels**：検索・ダウンロードとも問題なし。全3枚を Pexels から選びました。

全3枚とも **Pexels のフリー素材**（Pexels License：商用利用可・クレジット表記不要）。人物の顔・ブランドロゴ・文字の写り込みがないものを選びました。
どれも 1080×1920 にトリミングしています（1・2枚目は中央基準。3枚目は本文とキャンドルの炎が重ならないよう 1.2 倍に拡大し、上端に合わせて切り抜き）。

| 枚 | ファイル | 写っているもの | 撮り方 | 出典URL | ライセンス |
|---|---|---|---|---|---|
| 1 | bg/01.jpg | 夜の寝室。黄色いランプの灯り、白いシーツのベッド、紺がかった壁 | 引き（空間）／夜の灯り／生成り・白っぽい | https://www.pexels.com/photo/a-lamp-beside-a-bed-6940348/ | Pexels License |
| 2 | bg/02.jpg | 朝の光が差す窓辺、小さな花瓶の野の花と紫のギンガムリボン | 目線の高さ／朝の光／くすみ色 | https://www.pexels.com/photo/charming-floral-arrangement-on-windowsill-38791259/ | Pexels License |
| 3 | bg/03.jpg | 紺の闇に浮かぶ、ガラス皿のキャンドルの列 | 真上から（やや斜め上）／夜の灯り／くすみ色（紺） | https://www.pexels.com/photo/lighted-candles-in-dark-room-7121497/ | Pexels License |

被写体は ランプと寝室／窓辺の花とリボン／キャンドル で、3枚ともかぶりはありません。

## フォント
- Zen Old Mincho Regular 400／SemiBold 600（SIL Open Font License、github.com/google/fonts から取得したもの）
