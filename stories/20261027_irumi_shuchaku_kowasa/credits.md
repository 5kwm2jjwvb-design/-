# 背景画像の出典

全5枚とも **Unsplash のフリー素材**（Unsplash License：商用利用可・クレジット表記不要）。
検索ページは `license=free`（無料のみ）で開き、Unsplash+（有料）の写真は使っていません。

## 取得方法
- Unsplash の検索ページは WebFetch で開けました。
- ダウンロード用URL（`/photos/<ID>/download`）は、前回（10/24）ボット確認の画面（401）が返っていました。そのため今回は試さず、検索ページに載っている画像配信サーバーのURL（images.unsplash.com）から、同じ写真を取得しています。
- Pexels・Pixabay・Wikimedia Commons は、Unsplash で全枚そろったため試していません。

## 使った写真
| 枚 | ファイル | 写っているもの | 指定の撮り方 | 出典URL | ライセンス |
|---|---|---|---|---|---|
| 1 | bg/01.jpg | 暗い布の上の無地のカードとドライの草花 | 真上から／昼の自然光／くすみ色 | https://unsplash.com/photos/Nj9JD8y5vPQ | Unsplash License |
| 2 | bg/02.jpg | 朝の光が差し込む、レンガ壁のがらんとした部屋 | 引き／朝の光／暖色 | https://unsplash.com/photos/LIMsbquHur0 | Unsplash License |
| 3 | bg/03.jpg | 暗がりで灯るフィラメント電球のアップ | 寄り／夜の灯り／暖色 | https://unsplash.com/photos/RCw5oZPCHiY | Unsplash License |
| 4 | bg/04.jpg | 夕日と川、灯台のある街のシルエット | 引き／夕方の光／暖色 | https://unsplash.com/photos/04Av-6vot54 | Unsplash License |
| 5 | bg/05.jpg | グレーの壁の前のドライローズ（画面の下） | 寄り／朝の光／くすみ色 | https://unsplash.com/photos/7-vwc5XvkCs | Unsplash License |

## トリミング
どれも 1080×1920（9:16）に切り出しています。中央基準から外したものは次のとおりです。
- 3枚目：電球が上に来るよう、下寄りを切り出して少し拡大しました。
- 1枚目：カードと草花を左下に寄せ、文字を置く右上を暗い布にしました。
- 5枚目：バラが画面の下に来るよう、上寄りを切り出しました。上の壁に文字、文字とバラのあいだに質問ボックスの余白を取っています。

## 指定とのずれ（いちばん近いものを選んだ枚）
- 4枚目：夕日の写真で、空に紫が少し入っています。
- 5枚目：文字量が多く質問ボックスの余白も要るため、上が無地の写真に替えました（第4版）。光は朝というより、やわらかい室内光です。
- 1枚目と5枚目はどちらも乾いた植物が写っていますが、主役はカード（1枚目）とバラ（5枚目）で、別のものです。
- 紫の指定：紫が中心の写真はありません。配色テーマ（テラコッタ）と枚ごとの撮り方の指定を優先しました。4枚目の空だけ紫寄りです。

## フォント
Noto Sans JP（SIL Open Font License。github.com/google/fonts から取得）
