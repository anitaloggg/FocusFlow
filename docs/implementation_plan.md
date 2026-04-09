# 蕃茄時鐘 + 待辦清單 (Glassmorphism 版) 實作計畫

這個計畫旨在打造一個功能強大且視覺驚艷的生產力工具。

## 使用者回饋需求
> [!IMPORTANT]
> **關於 Google Tasks 整合**：真正的 Google Tasks 同步需要開發者 Client ID 才能運作。我將優先建立一個「風格與 Google Tasks 一致且體驗極佳的本地清單」。如果您未來需要同步到 Google 帳號，我可以再引導您設定 API 金鑰。

## 擬定變更

### 1. 視覺設計 (UI/UX)
- 使用 **Glassmorphism** 設計語言。
- 背景將採用深色漸層或抽象圖象。
- 玻璃容器將有細微的邊框亮光與陰影。
- **色彩規範**：
  - 專注狀態：深紅/珊瑚色系
  - 休息狀態：翡翠綠/薄荷色系

### 2. 核心組件

#### [NEW] [index.html](file:///c:/Labs/antiDemo/index.html)
- 頂部導航：設定與通知切換。
- 主區域：大型圓形計時器。
- 側邊/下方：Todo 清單面板。
- 設定彈窗：調整時間長度。

#### [NEW] [style.css](file:///c:/Labs/antiDemo/style.css)
- 定義 CSS Variables 處理顏色與模糊度。
- 實現響應式佈局。
- 添加 `fade-in` 與 `slide-up` 動畫。

#### [NEW] [app.js](file:///c:/Labs/antiDemo/app.js)
- `Timer` 類別：處理倒數、倒數暫停、狀態切換。
- `TodoManager` 類別：處理任務增刪改查。
- `AudioManager`：處理提醒鈴聲。

## 驗證計畫

### 自動與手動測試
- [ ] 驗證 40 分鐘專注與 5 分鐘休息的倒數準確度。
- [ ] **壓力測試**：將測試時間設為幾秒鐘，確認第 2 次循環是否正確變為 10 分鐘休息。
- [ ] 檢查瀏覽器內容縮放後的佈局穩定性。
- [ ] 測試 Todo 清單在重新整理後是否能正確從 LocalStorage 恢復。

### 瀏覽器測試
- 使用 Browser 工具開啟並操作 UI，確保動畫無殘影、按鈕反應靈敏。
