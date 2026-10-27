# Abiting Pokédex 維護

## 已完成：底部錨定廣告與 favicon

- [x] 在中英文寶可夢詳細頁面底部加入可點擊、可關閉的錨定廣告，關閉後同步移除內容預留空間。
- [x] 依實際 PokéAPI 圖鑑編號正確分流中英文廣告素材與外部連結。
- [x] 中文 #0001–#0200 使用 Fonelora Pokémon GO 橫幅，#0201–#0500 使用中文 AbiPaint，#0501 之後使用中文 AbiURL。
- [x] 英文 #0001–#0500 使用英文 AbiPaint，#0501 之後使用英文 AbiURL。
- [x] 建立符合 Google 尺寸與 MIME 類型要求的 PNG favicon、Apple Touch Icon 與自訂 manifest。

## 首頁效能優化

- [x] 分析首頁目前的 PokéAPI 請求、渲染與圖片載入瓶頸。
- [x] 改為先載入基本名單與首批卡片，避免首次進站等待所有完整資料。
- [x] 僅為畫面中已顯示的卡片延後取得屬性資料，並加入快取與分批顯示機制。
- [x] 建置、實機檢查首頁首屏與搜尋功能，並建立可發布 checkpoint。

## #1001–#1004 繁中特性修正

- [x] 依神奇寶貝百科核對 #1001–#1004 的特性繁中譯名。
- [x] 修正本地特性翻譯資料並驗證四個繁中詳細頁。
- [x] 完成建置與建立可發布 checkpoint。

## 品牌圖片連結更新

- [x] 將首頁主視覺與詳細頁品牌圖片更換為使用者指定連結。
- [x] 驗證兩張圖片在桌面與行動版正確載入，並完成建置。

## Ahrefs 原始 HTML 與內部連結修正

- [x] 設計中英文共用的靜態 SEO 頁面模板，提供 title、description、canonical、H1、基本資料與內部連結。
- [x] 在建置階段產生 1,025 個英文與 1,025 個繁中寶可夢路由的 index.html。
- [x] 在首頁的原始 HTML 提供可被爬蟲發現的完整圖鑑內部連結。
- [x] 建置後檢查 sitemap、英文頁、繁中頁與首頁的原始 HTML 結構。
- [x] 完成正式建置、畫面回歸測試與可發布 checkpoint。

## 繁中 AbiPaint／AbiURL 廣告移除

- [x] 僅移除繁中 #0201 之後的 AbiPaint 與 AbiURL 底部廣告。
- [x] 保留繁中 #0001–#0200 Fonelora 廣告與所有英文廣告設定。
- [x] 完成建置與中英文分流回歸測試。

## 英文 CPA Ceramics 廣告更新

- [x] 將英文 #0001–#0100 的底部廣告換為指定 Ceramics Practice Alliance 圖片並連至 cpaceramics.com。
- [x] 保留英文 #0101–#0500 的 AbiPaint、英文 #0501 之後的 AbiURL 與所有繁中廣告分流。
- [x] 驗證廣告圖片可載入、完成建置與邊界路由回歸測試。

## Ceramics Practice Alliance 橫幅比例調整

- [x] 比較現用與新 Ceramics Practice Alliance 圖片的尺寸與比例。
- [x] 僅替換英文 #0001–#0100 的 Ceramics Practice Alliance 廣告圖片，保留連結與其他分流。
- [x] 完成建置與廣告尺寸回歸測試。

## Ceramics Practice Alliance 新橫幅替換

- [x] 檢查使用者提供的新 Ceramics Practice Alliance 圖片尺寸與比例。
- [x] 僅替換英文 #0001–#0100 的 Ceramics Practice Alliance 廣告圖片，保留連結與其他分流。
- [x] 完成建置與廣告顯示回歸測試。

## GitHub Pages 尾斜線網址一致性

- [x] 評估資料夾式尾斜線與 `.html` 輸出的 GitHub Pages 行為，選定不產生 canonical 轉址的方案。
- [x] 將靜態頁 canonical、og:url、hreflang（如有）、sitemap 與站內連結統一為選定格式。
- [x] 同步 React 路由與動態 SEO 產生的站內連結／canonical，避免 client 與靜態 HTML 不一致。
- [x] 建置後驗證 sitemap、原始 HTML 與實際直連路由皆為 200 且沒有不必要轉址。

## 首頁 Open Graph 分享圖

- [x] 驗證首頁白底主視覺圖片的公開 URL、格式與尺寸。
- [x] 將圖片加入首頁與所有靜態頁共用的 Open Graph／Twitter 預覽標籤。
- [x] 建置、推送 GitHub Pages 並驗證正式首頁原始 HTML 的分享圖片設定。

## 首頁分享標題重複修正

- [x] 檢查正式首頁與靜態產頁的 title、Open Graph 與 Twitter 標題來源。
- [x] 移除分享預覽中重複的 Pokédex 品牌字樣，保留網站 SEO title 與其他中英文頁設定。
- [x] 建置、推送 GitHub Pages 並驗證正式首頁分享標籤。

## 多形態舊網址相容路由

- [x] 為 `pumpkaboo`、`toxtricity`、`wormadam` 建立 GitHub Pages 相容路由，導向保留的型態頁。
- [x] 在相容頁提供 canonical、即時重新導向與可供無 JavaScript 使用者點擊的目標連結。
- [x] 建置、推送 GitHub Pages 並確認三個舊網址不再回傳 404。

## 靜態 SEO 頁面載入交接

- [x] 保留爬蟲與無 JavaScript 使用者可讀取的原始靜態 SEO 內容。
- [x] 防止一般瀏覽器在 React 詳細頁接手前短暫顯示純 HTML 頁面。
- [x] 建置並驗證英文、繁中與相容導向頁的靜態輸出及 React 載入結果。

## 廣告無閃現與首頁載入量優化

- [x] 以本機 `slug → 實際圖鑑編號` 對照取代廣告元件的 PokéAPI 查詢，避免素材先以錯誤預設版本顯示。
- [x] 將底部廣告改為僅在詳細頁延後下載，首頁不再載入廣告程式與編號對照資料。
- [x] 移除首頁未使用的全域 Tooltip／Toast 依賴，將首頁主 JavaScript 由約 100 KB gzip 降至約 74 KB gzip。
- [x] 移除首頁靜態輸出中 GitHub Pages 不需要的 Manus runtime，將首頁 HTML 由約 136 KB gzip 降至約 30 KB gzip。
- [x] 建置並驗證中英文廣告分流邊界、型態 slug 與首頁靜態 SEO 輸出。

## 詳細頁兩階段載入與當次瀏覽快取

- [x] 讓中英文詳細頁在寶可夢基本資料回傳後立即顯示名稱、圖片、屬性、特性與種族值。
- [x] 將性別比例與進化鏈改為背景補齊，不再阻塞整頁首次呈現。
- [x] 新增記憶體與 sessionStorage 雙層快取，讓當次瀏覽中重新進入已看過的詳細頁立即顯示。
- [x] 驗證英文與繁中 Pikachu 首次載入可建立完整快取，回訪時不顯示頁內 loading 且不發出新的 PokéAPI 請求。
