# GitHub Pages 部署計畫

此計畫將引導您將「FocusFlow」專案部署到 GitHub Pages，讓您可以透過專屬網址隨時隨地開啟計時器。

## 部署流程

### 階段 1：本地 Git 初始化
我將在您的本機環境執行以下操作：
1. **初始化 Git 儲存庫**：執行 `git init`。
2. **建立 .gitignore**：排除不需要上傳的暫存檔案或說明文件。
3. **提交程式碼**：將 `index.html`, `style_v2.css`, `app.js` 與 `assets` 提交至本地分支。

### 階段 2：建立遠端 GitHub 儲存庫（需您的協助）
請您按照以下步驟操作：
1. 登入您的 [GitHub 帳號](https://github.com/)。
2. 點擊右上角的 **+** 號，選擇 **New repository**。
3. 儲存庫名稱建議設定為 `FocusFlow`。
4. 設定為 **Public**，然後點擊 **Create repository**。
5. **重要**：建立後請將儲存庫的網址（例如 `https://github.com/您的用戶名/FocusFlow.git`）貼回對話框告訴我。

### 階段 3：推送至 GitHub 與啟用 Pages
當我收到您的網址後，我會：
1. **連結遠端**：執行 `git remote add origin [網址]`。
2. **推送程式碼**：執行 `git push -u origin main`。
3. **啟用 GitHub Pages**：引導您在 GitHub 儲存庫設定中開啟託管。

## 驗證計畫
- [ ] 確認 GitHub 儲存庫已出現所有專案檔案。
- [ ] 存取 `https://[您的用戶名].github.io/FocusFlow/` 確認網頁是否能正確開啟且樣式正確。

---
**準備好了嗎？如果您同意這個流程，請回覆 OK 或直接提供您的 GitHub 儲存庫網址！**
