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
