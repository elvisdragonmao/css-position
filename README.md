# CSS Position 互動式教材

這是一個給 HTML / CSS 初學者使用的互動式教材，主題是「網站是怎麼排版的？CSS Position 的使用」。

教材形式參考 Flexbox Froggy：學生會看到任務說明、提示、CSS 編輯器，以及即時預覽畫面。學生需要修改 CSS，讓預覽區中的網頁元素移動到正確位置。

> 這份專案是科學教育專題研究-認知多媒體研究期末報告，本教材設計主要結合以下理論：
>
> - Paivio：Dual Coding Theory
> - Chandler & Sweller：Split-attention Effect / Cognitive Load Theory
> - Mayer：Cognitive Theory of Multimedia Learning
> - Schnotz：Mental Model in Graphics Comprehension
> - She & Chen：Multimedia Effect and Eye Movement Evidence
>
> 這些理論共同支持：多媒體教材不只是加入圖片或動畫，而是要讓學生能有效分配注意力、降低認知負荷，並建立正確的心理模型。

## 學習目標

完成教材後，學生會練習到：

- `position: relative`
- `position: absolute`
- `position: fixed`
- `position: sticky`
- `z-index`
- `top`、`right`、`bottom`、`left`
- absolute 和父層 `position: relative` 的關係
- fixed 和 viewport 的關係
- sticky 和 scroll container 的關係
- positioned element 與堆疊順序

## 功能

- 五個互動式 CSS Position 關卡
- 即時 CSS 預覽
- CSS syntax highlight
- `Tab` 插入兩個空白、`Enter` 自動縮排
- 非完全字串比對的 CSS 驗證
- 每關多個提示，可用左右箭頭切換
- 關卡 dropdown 切換
- 完成全部關卡後顯示總結表
- 支援 GitHub Pages 部署

## 技術棧

- React
- TypeScript
- Vite
- Tailwind CSS
- lucide-react

## 開發

請使用 pnpm。

```bash
pnpm install
pnpm run dev
```

開發伺服器預設會啟動在：

```text
http://localhost:5173/
```

## 檢查與建置

```bash
pnpm test
pnpm build
```

格式化：

```bash
pnpm format
```

## 專案結構

```text
src/
  App.tsx              # 主要 UI 與互動狀態
  cssHighlighter.tsx   # CSS syntax highlight
  cssUtils.ts          # CSS 宣告解析與驗證工具
  levels.ts            # 關卡資料與驗證邏輯
  previewHtml.ts       # iframe 預覽畫面 HTML/CSS
```

## GitHub Actions

本專案包含兩個 workflow：

- `CI`：在 push / pull request 時檢查 Prettier、TypeScript 與 production build。
- `Deploy GitHub Pages`：在 push 到 `main` 後建置並部署 `dist/` 到 GitHub Pages。

GitHub Pages 設定請選：

```text
Source: GitHub Actions
```

因為這是 GitHub Pages project site，Vite 已設定：

```ts
base: "/css-position/";
```

## 授權

請參考 [LICENSE](./LICENSE)。
