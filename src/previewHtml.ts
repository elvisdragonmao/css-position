const commonCss = `
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
}

body {
  color: #172033;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f8fafc;
}

button,
input,
textarea {
  font: inherit;
}
`;

const previewCssByLevel: Record<number, string> = {
	1: `
.level-1-preview {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background:
    linear-gradient(135deg, rgba(14, 165, 233, 0.14), rgba(34, 197, 94, 0.12)),
    #f8fafc;
}

.profile-card {
  width: min(360px, calc(100vw - 48px));
  padding: 24px;
  border: 1px solid #dbe4ee;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.13);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 76px;
  height: 76px;
  flex: 0 0 auto;
  border: 4px solid #ffffff;
  border-radius: 999px;
  background:
    radial-gradient(circle at 50% 36%, #fde68a 0 16%, transparent 17%),
    radial-gradient(circle at 50% 84%, #0f766e 0 34%, transparent 35%),
    linear-gradient(135deg, #bae6fd, #c4b5fd);
  box-shadow: 0 0 0 1px #cbd5e1, 0 10px 22px rgba(15, 23, 42, 0.13);
}

.profile-copy h2 {
  margin: 0;
  color: #0f172a;
  font-size: 24px;
  line-height: 1.15;
}

.profile-copy p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.55;
}

.badge-row {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #e2e8f0;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.22);
}

.target-copy {
  margin-left: 10px;
  color: #64748b;
  font-size: 12px;
}
`,
	2: `
.level-2-preview {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background:
    linear-gradient(135deg, rgba(251, 191, 36, 0.13), rgba(14, 165, 233, 0.12)),
    #f8fafc;
}

.card {
  width: min(340px, calc(100vw - 48px));
  overflow: hidden;
  border: 1px solid #dbe4ee;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.13);
}

.product-media {
  height: 188px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 65% 35%, rgba(248, 113, 113, 0.85) 0 12%, transparent 13%),
    radial-gradient(circle at 36% 52%, rgba(59, 130, 246, 0.72) 0 18%, transparent 19%),
    linear-gradient(135deg, #e0f2fe, #fef3c7 58%, #ede9fe);
}

.product-box {
  width: 138px;
  height: 94px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  background: linear-gradient(145deg, #ffffff, #dbeafe);
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.16);
  transform: rotate(-8deg);
}

.sale-badge {
  display: inline-flex;
  margin: 16px 20px 0;
  padding: 7px 12px;
  border-radius: 999px;
  background: #fee2e2;
  color: #991b1b;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.22);
}

.card-body {
  padding: 16px 20px 22px;
}

.card-body h2 {
  margin: 0;
  color: #0f172a;
  font-size: 22px;
  line-height: 1.2;
}

.card-body p {
  margin: 8px 0 14px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.55;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #0f172a;
  font-weight: 800;
}

.price-row span:last-child {
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
}
`,
	3: `
.level-3-preview {
  min-height: 1180px;
  background: #ffffff;
}

.navbar {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  background: rgba(15, 23, 42, 0.96);
  color: #ffffff;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.18);
  z-index: 4;
}

.brand {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.nav-links {
  display: flex;
  gap: 14px;
  color: #cbd5e1;
  font-size: 13px;
}

.hero {
  min-height: 320px;
  display: grid;
  align-content: center;
  gap: 14px;
  padding: 44px 28px;
  background:
    radial-gradient(circle at 78% 26%, rgba(34, 197, 94, 0.25), transparent 28%),
    linear-gradient(135deg, #dbeafe, #f8fafc 52%, #fde68a);
}

.hero-kicker {
  width: max-content;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  color: #334155;
  font-size: 12px;
  font-weight: 800;
}

.hero h1 {
  max-width: 560px;
  margin: 0;
  color: #0f172a;
  font-size: 42px;
  line-height: 1.05;
}

.hero p {
  max-width: 560px;
  margin: 0;
  color: #475569;
  font-size: 16px;
  line-height: 1.7;
}

.content {
  max-width: 760px;
  margin: 0 auto;
  padding: 34px 24px 90px;
}

.content-section {
  margin-bottom: 24px;
  padding: 22px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #ffffff;
}

.content-section h2 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 22px;
}

.content-section p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.8;
}
`,
	4: `
.level-4-preview {
  min-height: 1320px;
  padding: 28px;
  background: #f8fafc;
}

.article-shell {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.sidebar {
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.sidebar h2 {
  margin: 0 0 12px;
  color: #0f172a;
  font-size: 15px;
}

.sidebar a {
  display: block;
  padding: 8px 0;
  border-top: 1px solid #eef2f7;
  color: #475569;
  font-size: 13px;
  text-decoration: none;
}

.article {
  padding: 28px;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #ffffff;
}

.article h1 {
  margin: 0 0 14px;
  color: #0f172a;
  font-size: 34px;
  line-height: 1.15;
}

.article h2 {
  margin: 34px 0 10px;
  color: #0f172a;
  font-size: 22px;
}

.article p {
  margin: 0 0 16px;
  color: #475569;
  font-size: 15px;
  line-height: 1.85;
}

@media (max-width: 640px) {
  .article-shell {
    grid-template-columns: 1fr;
  }
}
`,
	5: `
.level-5-preview {
  min-height: 1180px;
  position: relative;
  padding: 28px 28px 90px;
  background:
    radial-gradient(circle at 85% 18%, rgba(14, 165, 233, 0.14), transparent 28%),
    #f8fafc;
}

.dashboard {
  max-width: 720px;
  margin: 0 auto;
}

.dashboard h1 {
  margin: 0 0 18px;
  color: #0f172a;
  font-size: 28px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.dashboard-card {
  min-height: 128px;
  padding: 18px;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.dashboard-card.tall {
  min-height: 180px;
}

.dashboard-card strong {
  display: block;
  margin-bottom: 8px;
  color: #0f172a;
}

.dashboard-card span {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.46);
  z-index: 12;
}

.modal {
  position: absolute;
  top: 96px;
  left: 50%;
  width: min(360px, calc(100vw - 48px));
  padding: 22px;
  transform: translateX(-50%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.26);
  z-index: 4;
}

.modal h2 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 22px;
}

.modal p {
  margin: 0 0 18px;
  color: #475569;
  font-size: 14px;
  line-height: 1.7;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-actions span {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 10px;
  background: #0f172a;
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
}
`
};

const previewHtmlByLevel: Record<number, string> = {
	1: `
<section class="level-1-preview">
  <article class="profile-card">
    <div class="profile-header">
      <div class="avatar" aria-hidden="true"></div>
      <div class="profile-copy">
        <h2>Lin Mei</h2>
        <p>前端新手，正在練習把畫面排得更精準。</p>
      </div>
    </div>
    <div class="badge-row">
      <span class="badge">NEW</span>
      <span class="target-copy">目標：往右上移動</span>
    </div>
  </article>
</section>
`,
	2: `
<section class="level-2-preview">
  <article class="card">
    <div class="product-media">
      <div class="product-box" aria-hidden="true"></div>
    </div>
    <span class="sale-badge">SALE</span>
    <div class="card-body">
      <h2>Daily Carry Pouch</h2>
      <p>輕量收納包，適合通勤與短途旅行。</p>
      <div class="price-row">
        <span>NT$ 890</span>
        <span>剩 3 件</span>
      </div>
    </div>
  </article>
</section>
`,
	3: `
<section class="level-3-preview">
  <nav class="navbar">
    <div class="brand">STUDIO NOTES</div>
    <div class="nav-links">
      <span>作品</span>
      <span>文章</span>
      <span>聯絡</span>
    </div>
  </nav>
  <header class="hero">
    <div class="hero-kicker">捲動預覽區</div>
    <h1>固定導覽列讓頁面移動時仍可操作。</h1>
    <p>當導覽列改成 fixed，它會相對於預覽視窗定位。捲動下面內容時，觀察它是否保持在最上方。</p>
  </header>
  <main class="content">
    <section class="content-section">
      <h2>第一段內容</h2>
      <p>一般元素會依照 normal flow 往下排列。fixed 元素則會離開這個流程，直接相對 viewport 固定。</p>
    </section>
    <section class="content-section">
      <h2>第二段內容</h2>
      <p>固定導覽列常見於網站首頁、管理後台和文件頁面。完成後請繼續往下捲動觀察效果。</p>
    </section>
    <section class="content-section">
      <h2>第三段內容</h2>
      <p>因為 fixed 不再佔據原本空間，它可能遮住後面的內容。實務上常需要替主內容補 padding 或 margin。</p>
    </section>
    <section class="content-section">
      <h2>第四段內容</h2>
      <p>如果導覽列仍跟著內容一起離開畫面，代表還沒有正確套用 position: fixed。</p>
    </section>
  </main>
</section>
`,
	4: `
<section class="level-4-preview">
  <div class="article-shell">
    <aside class="sidebar">
      <h2>文章目錄</h2>
      <a href="#intro">定位情境</a>
      <a href="#flow">normal flow</a>
      <a href="#sticky">sticky 行為</a>
      <a href="#finish">實務提醒</a>
    </aside>
    <article class="article">
      <h1 id="intro">長文章中的吸附目錄</h1>
      <p>文件頁面常把目錄放在側邊，讓讀者在閱讀長內容時仍能快速跳到不同章節。</p>
      <p>一開始，sidebar 就像一般元素一樣待在自己的位置。當頁面捲動到指定距離後，它才會吸附在上方。</p>
      <h2 id="flow">normal flow</h2>
      <p>normal flow 是瀏覽器預設的排版方式。區塊元素會一個接一個往下排，行內元素會沿著文字方向排列。</p>
      <p>relative、absolute、fixed 和 sticky 都是在不同程度上改變元素與 normal flow 的關係。</p>
      <h2 id="sticky">sticky 行為</h2>
      <p>sticky 很適合用於表格標題、章節目錄或重要工具列。它的定位範圍不是無限的，而是受到父層容器限制。</p>
      <p>如果 sticky 沒有效果，通常是忘了指定 top，或父層的 overflow 設定讓它的捲動容器不是你以為的那一個。</p>
      <h2 id="finish">實務提醒</h2>
      <p>請在預覽區中往下捲動。當目錄接近上方時，它應該停在你設定的 top 位置。</p>
      <p>這就是 sticky 介於 relative 與 fixed 之間的地方：它在不同捲動狀態下有不同定位行為。</p>
      <p>多加一些內容可以讓你更清楚看見 sticky 的邊界。目錄不會永遠固定，它會跟著父層結束而停止。</p>
    </article>
  </div>
</section>
`,
	5: `
<section class="level-5-preview">
  <main class="dashboard">
    <h1>專案儀表板</h1>
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <strong>今日流量</strong>
        <span>訪客數比昨天增加 18%，需要確認公告是否正確顯示。</span>
      </div>
      <div class="dashboard-card">
        <strong>待辦事項</strong>
        <span>更新首頁文案、檢查導覽列、整理互動教材素材。</span>
      </div>
      <div class="dashboard-card">
        <strong>訊息</strong>
        <span>目前有 4 則未讀訊息等待回覆。</span>
      </div>
      <div class="dashboard-card">
        <strong>部署狀態</strong>
        <span>最新版本正在預覽環境等待驗收。</span>
      </div>
      <div class="dashboard-card tall">
        <strong>活動紀錄</strong>
        <span>這個區塊讓預覽頁變長。先不要寫 fixed，往下捲動時觀察 modal 會不會跟著內容離開視窗。</span>
      </div>
      <div class="dashboard-card tall">
        <strong>排程</strong>
        <span>fixed 元素應該相對 viewport 固定，不會跟著這些頁面內容一起捲走。</span>
      </div>
      <div class="dashboard-card">
        <strong>通知中心</strong>
        <span>遮罩和 modal 都是常見需要固定在視窗上的 UI。</span>
      </div>
      <div class="dashboard-card">
        <strong>頁面底部</strong>
        <span>完成後再往下捲動，modal 應該仍停在預覽視窗上方。</span>
      </div>
    </div>
  </main>
  <div class="overlay"></div>
  <section class="modal" role="dialog" aria-label="確認視窗">
    <h2>確認發布？</h2>
    <p>這個 modal 應該顯示在遮罩上方。現在它的堆疊順序太低，所以被遮罩蓋住了。</p>
    <div class="modal-actions">
      <span>發布</span>
    </div>
  </section>
</section>
`
};

function sanitizeStyleContent(css: string) {
	return css.replace(/<\/style/gi, "<\\/style");
}

export function buildPreviewHtml(levelId: number, userCss: string) {
	const levelCss = previewCssByLevel[levelId] ?? "";
	const body = previewHtmlByLevel[levelId] ?? "";

	return `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${commonCss}</style>
    <style>${levelCss}</style>
    <style>${sanitizeStyleContent(userCss)}</style>
  </head>
  <body>${body}</body>
</html>`;
}
