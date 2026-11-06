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

  /* ---- 鑑定メニュー（2段階） ----
     priceRegular / priceLimited : 数字（税込・円）。例 12000
     chars        : 鑑定書の文字数の目安。例 5000
     payUrl       : 限定期間中の決済リンク（未設定は '#'）
     payUrlRegular: 期限切れ後の決済リンク。null なら payUrl を使う          */
  menus: {
    lite: {
      name: 'ライト',
      priceRegular: null,   // ★通常価格
      priceLimited: null,   // ★限定価格
      chars: null,          // ★鑑定書の文字数
      payUrl: '#',          // ★決済リンク（限定価格）
      payUrlRegular: null   // ★決済リンク（通常価格）
    },
    main: {
      name: '本鑑定',
      priceRegular: null,   // ★通常価格
      priceLimited: null,   // ★限定価格
      chars: null,          // ★鑑定書の文字数
      payUrl: '#',          // ★決済リンク（限定価格）
      payUrlRegular: null   // ★決済リンク（通常価格）
    }
  },
  taxLabel: '税込',

  /* ---- 限定期間 ----
     days : 「ページを初めて開いた日」から何日間限定か。★必須
            開いた日を1日目として、days日目の24時（翌0時）に終了します。
            null の間は「★日間」と表示し、タイマーは previewDays で仮に動きます。
     storageKey : 初回訪問日時を保存する localStorage のキー。
                  キャンペーンを仕切り直したいときは末尾を変えると全員リセット。
     ※ 動作確認用：URL末尾に ?timer=reset を付けて開くと、自分の端末だけリセット。 */
  limit: {
    enabled: true,
    days: null,             // ★限定日数
    previewDays: 7,         // days 未設定時のプレビュー用（本番前に days を入れてください）
    storageKey: 'irumi_kantei_first_visit_v1'
  },

  /* ---- 希少性表示（「今月の鑑定枠 残りわずか」など） ----
     実際に枠が少ないときだけ true にしてください。                          */
  scarcity: {
    show: false,
    text: '今月の鑑定枠　残りわずか'
  },

  /* ---- 実績（第II章のカウンター） ----
     根拠のある数字だけを入れてください。空配列なら実績ブロックごと非表示。
     例：
     stats: [
       { value: 3000, suffix: '名以上', label: 'これまでに視てきた方' },
       { value: 5,    suffix: '年',     label: '鑑定歴' }
     ]                                                                       */
  stats: [],

  /* ---- お客様の声（第VII章） ----
     LINE感想のスクリーンショット画像のパス。並べたい順に書きます。
     画像ファイルを置くまでは、プレースホルダ枠が表示されます。               */
  voices: [
    'assets/img/voices/voice_01.jpg',
    'assets/img/voices/voice_02.jpg',
    'assets/img/voices/voice_03.jpg',
    'assets/img/voices/voice_04.jpg',
    'assets/img/voices/voice_05.jpg',
    'assets/img/voices/voice_06.jpg'
  ]
};
