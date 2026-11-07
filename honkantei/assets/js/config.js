/* =====================================================================
   CONFIG ― イルミ本鑑定LP の可変値はすべてここに集約しています。
   このファイルだけ直せば、ページ全体に反映されます。

   ★ = まだ決まっていない値（プレースホルダ）。
       null のままだとページ上には「★」と表示されます。
   ===================================================================== */
window.CONFIG = {

  /* ---- ブランド ---- */
  brand: {
    name: 'イルミ',
    tagline: 'ご縁を結ぶ霊視占い',
    methods: '霊視タロット／四柱推命／波動鑑定'
  },

  /* ---- 外部リンク ---- */
  links: {
    line: 'https://lin.ee/weEZDF0',
    instagram: 'https://www.instagram.com/irumi_uranai/',
    instagramHandle: '@irumi_uranai',
    tokushoho: 'legal/tokushoho.html',   // 特定商取引法に基づく表記
    privacy: 'legal/privacy.html'        // プライバシーポリシー
  },

  /* ---- 鑑定メニュー（松竹梅の3段階：元の鑑定ページと同じ内容） ----
     priceRegular / priceLimited : 数字（税込・円）
     chars  : 鑑定文の文字数の目安
     payUrl : 限定期間中の決済リンク。'#' の間は、ボタンは公式LINEを開きます
     payUrlRegular : 期限切れ後の決済リンク。null なら payUrl を使う        */
  menus: {
    a: {
      plan: 'Aプラン',
      name: '本音の扉',
      cards: '3枚「スリーカード」',
      priceRegular: 5980,
      priceLimited: 4980,
      chars: 2000,
      payUrl: '#',          // ★決済リンク
      payUrlRegular: null
    },
    b: {
      plan: 'Bプラン',
      name: '未来の扉',
      cards: '7枚「ヘキサグラム」',
      priceRegular: 7980,
      priceLimited: 5980,
      chars: 3000,
      payUrl: '#',          // ★決済リンク
      payUrlRegular: null
    },
    c: {
      plan: 'Cプラン',
      name: '運命の扉',
      cards: '10枚「ケルト十字」',
      priceRegular: 12980,
      priceLimited: 9980,
      chars: 5000,
      payUrl: '#',          // ★決済リンク
      payUrlRegular: null
    }
  },
  taxLabel: '税込',

  /* ---- 限定期間 ----
     hours: 「ページを初めて開いた瞬間」から何時間限定か（今は24時間）。
            hours を入れると days より優先されます。日数で区切りたいときは null に。
     days : hours が null のときに使う。開いた日を1日目として、days日目の24時に終了。
     storageKey : 初回訪問日時を保存する localStorage のキー。
                  キャンペーンを仕切り直したいときは末尾を変えると全員リセット。
     ※ 動作確認用：URL末尾に ?timer=reset を付けて開くと、自分の端末だけリセット。 */
  limit: {
    enabled: true,
    hours: 24,              // 初めて開いてから24時間
    days: null,
    previewDays: 7,
    storageKey: 'irumi_kantei_first_visit_v2'
  },

  /* ---- 希少性表示（「今月の鑑定枠 残りわずか」など） ----
     実際に枠が少ないときだけ true にしてください。                          */
  scarcity: {
    show: false,
    text: '今月の鑑定枠　残りわずか'
  },

  /* ---- 実績（第II章のカウンター） ----
     根拠のある数字だけを入れてください。空配列なら実績ブロックごと非表示。
     例：{ value: 3000, suffix: '名以上', label: 'これまでに視てきた方' }     */
  stats: [],

  /* ---- お客様の声（第VII章） ----
     空配列 [] の間は、第VII章ごと非表示になります（今は非表示）。
     例：voices: ['assets/img/voices/voice_01.jpg', 'assets/img/voices/voice_02.jpg'] */
  voices: []
};
