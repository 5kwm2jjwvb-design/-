# 背景画像の出典

全5枚とも **Unsplash のフリー素材**（Unsplash License：商用利用可・クレジット表記不要）。
検索ページは `license=free`（無料のみ）で開き、Unsplash+（有料）の写真は使っていません。

## 取得方法
- Unsplash の検索ページは WebFetch で開けました。
- ダウンロード用URL（`/photos/<ID>/download`）はボット確認の画面（401）が返ったため、1回で切り替えました。検索ページに載っている画像配信サーバーのURL（images.unsplash.com）から、同じ写真を取得しています。
- Pexels・Pixabay・Wikimedia Commons は、Unsplash で全枚そろったため試していません。

## 使った写真
| 枚 | ファイル | 写っているもの | 指定の撮り方 | 出典URL | ライセンス |
|---|---|---|---|---|---|
| 1 | bg/01.jpg | 扉の鍵穴に差さった鍵と、壁に落ちた影 | 寄り／夕方の光／くすみ色 | https://unsplash.com/photos/0juktkOTkpU | Unsplash License |
| 2 | bg/02.jpg | 夕日がカーテン越しに差す寝室 | 目線の高さ／夕方の光／暖色 | https://unsplash.com/photos/VPFi-s-xyXU | Unsplash License |
| 3 | bg/03.jpg | 暗い中で灯るガラス器のキャンドル | 寄り／夕方の光／くすみ色 | https://unsplash.com/photos/Nn-KHurJ1RY | Unsplash License |
| 4 | bg/04.jpg | 暮れた紺色の空と、窓に灯りのともる集合住宅 | 目線の高さ／夕方の光／寒色 | https://unsplash.com/photos/_ElhRrxZNVQ | Unsplash License |
| 5 | bg/05.jpg | ノートに万年筆で書いている手元 | 寄り／夕方の光／生成り・白っぽい | https://unsplash.com/photos/wcMysLw5ROM | Unsplash License |

## トリミング
どれも 1080×1920（9:16）に切り出しています。中央基準から外したものは次のとおりです。
- 1枚目：鍵を画面の右端に寄せ、文字を置く左〜中央を壁の暗い部分にしました。
- 3枚目：キャンドルが上に来るよう、下寄りを切り出しました。
- 4枚目：建物を右下に寄せ、上の空を文字の置き場所にしました。
- 5枚目：ノートと手元が上に来るよう、下寄りを切り出しました。

## 指定とのずれ（いちばん近いものを選んだ枚）
- 3枚目：「占いの場」に合うタロットの写真は、白いカードが画面の中央に来て文字と重なるものばかりでした。そのため、占いの雰囲気に近いキャンドルの写真を選んでいます。
- 5枚目：生成り色のノートが写っていますが、画面全体は暗めです。光も、夕日というより手元を照らす灯りに見えます。文字と右下のハートの位置を暗い部分に取れることを優先しました。
- 紫の指定：紫が中心の写真はありません。配色テーマ（紺×黄色い灯り）と枚ごとの撮り方の指定を優先しました。

## フォント
Zen Old Mincho Regular 400／SemiBold 600（SIL Open Font License。github.com/google/fonts から取得）
