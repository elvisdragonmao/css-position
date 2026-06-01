import { getNumericDeclaration, hasDeclaration } from "./cssUtils";

export type ValidationResult = {
	success: boolean;
	message: string;
};

export type Level = {
	id: number;
	title: string;
	concept: string;
	instruction: string;
	explanation: string;
	targetSelectors: string[];
	starterCss: string;
	codeExample: string;
	resultDescription: string;
	hints: string[];
	successMessage: string;
	learningPoints: string[];
	validate: (css: string) => ValidationResult;
};

const pass = (message: string): ValidationResult => ({ success: true, message });
const fail = (message: string): ValidationResult => ({ success: false, message });

export const levels: Level[] = [
	{
		id: 1,
		title: "讓標籤微調位置",
		concept: "position: relative",
		instruction: "這是一張個人資料卡。請使用 position: relative，讓 NEW 標籤從原本位置稍微往右上方移動。",
		explanation:
			"relative 最適合用在「看起來只差一點點」的微調。它不會讓元素離開原本的排版流程，所以旁邊的文字、卡片高度和其他元素仍然會像 NEW 標籤還在原地一樣計算。這一關的重點是觀察：畫面上的標籤移動了，但它原本佔的位置沒有消失。",
		targetSelectors: [".badge"],
		starterCss: `.badge {
  /* 讓 NEW 從原本位置往右上方移動 */
}`,
		codeExample: `.badge {
  position: relative;
  top: -8px;
  left: 12px;
}`,
		resultDescription: "NEW 標籤會從原本所在位置往右上方偏移，但個人資料卡的排版空間仍維持原本配置。",
		hints: ["relative 不會把元素移出原本的排版流程。", "先寫 position: relative，再用 top 調整垂直偏移。", "往上可以用負的 top，往右可以用 left。"],
		successMessage: "做得好！relative 會讓元素相對於自己原本的位置移動。雖然你看到 NEW 標籤往右上方移動了，但它原本在排版中佔據的空間仍然保留著。",
		learningPoints: ["relative 是相對於元素原本位置移動。", "元素仍然保留原本佔據的空間。", "top 和 left 是相對於原本位置偏移。"],
		validate: css => {
			if (!hasDeclaration(css, ".badge", "position", "relative")) {
				return fail("還需要在 .badge 裡設定 position: relative。");
			}

			if (!hasDeclaration(css, ".badge", "top")) {
				return fail("已經開始定位了，接著請在 .badge 裡加入 top 來往上或往下微調。");
			}

			if (!hasDeclaration(css, ".badge", "left")) {
				return fail("還差 left。用 left 可以讓 NEW 往右偏移。");
			}

			return pass("Level 1 完成。");
		}
	},
	{
		id: 2,
		title: "把 SALE 放到商品卡片右上角",
		concept: "position: absolute",
		instruction: "請把 SALE 標籤固定在商品卡片的右上角。注意：absolute 需要找到定位參考點。",
		explanation:
			"absolute 會讓元素離開 normal flow，接著用 top、right、bottom、left 放到某個參考框裡。最容易混淆的是「參考框是誰」：它會找最近有設定 position 的祖先元素。如果商品卡片沒有 position: relative，SALE 可能會跑去對齊整個頁面，而不是卡片。",
		targetSelectors: [".card", ".sale-badge"],
		starterCss: `.card {
  /* 讓商品卡片成為 absolute 的定位參考點 */
}

.sale-badge {
  /* 把 SALE 放到卡片右上角 */
}`,
		codeExample: `.card {
  position: relative;
}

.sale-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}`,
		resultDescription: "SALE 標籤會脫離原本排版，貼到商品卡片內部右上角，並以卡片作為定位基準。",
		hints: ["absolute 會找最近的 positioned ancestor 當定位參考。", "通常會在父層寫 position: relative。", "SALE 本身需要 position: absolute，然後用 top 和 right 指定距離。"],
		successMessage: "很好！.card 變成定位參考點後，.sale-badge 的 top 和 right 就會以商品卡片為基準，而不是以整個畫面為基準。",
		learningPoints: ["absolute 會脫離 normal flow。", "absolute 會參考最近的 positioned ancestor。", "父層常常需要設定 position: relative。"],
		validate: css => {
			if (!hasDeclaration(css, ".card", "position", "relative")) {
				return fail("先讓 .card 成為定位參考點：在 .card 裡加入 position: relative。");
			}

			if (!hasDeclaration(css, ".sale-badge", "position", "absolute")) {
				return fail("SALE 標籤本身需要 position: absolute，才會脫離一般排版並定位到卡片角落。");
			}

			if (!hasDeclaration(css, ".sale-badge", "top")) {
				return fail("還需要在 .sale-badge 裡設定 top，指定離卡片上方的距離。");
			}

			if (!hasDeclaration(css, ".sale-badge", "right")) {
				return fail("還需要在 .sale-badge 裡設定 right，指定離卡片右側的距離。");
			}

			return pass("Level 2 完成。");
		}
	},
	{
		id: 3,
		title: "固定導覽列",
		concept: "position: fixed",
		instruction: "這是一個簡單網站。請讓導覽列固定在畫面最上方，即使右側預覽區捲動時也不會離開。",
		explanation:
			"fixed 的參考點是 viewport，也就是使用者目前看到的視窗。當內容捲動時，fixed 元素不會跟著文件內容一起走，這就是固定導覽列、固定按鈕和全頁通知常用 fixed 的原因。因為它會離開 normal flow，實務上常要替內容加上上方留白，避免被導覽列蓋住。",
		targetSelectors: [".navbar"],
		starterCss: `.navbar {
  /* 讓導覽列固定在預覽視窗最上方 */
}`,
		codeExample: `.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}`,
		resultDescription: "導覽列會固定在預覽視窗最上方，往下捲動內容時仍然保持可見。",
		hints: ["fixed 是相對 viewport 固定，不是相對父層。", "先把 .navbar 設成 position: fixed。", "固定到左上角通常會搭配 top: 0、left: 0 和 width: 100%。"],
		successMessage: "完成！fixed 會讓導覽列相對於預覽視窗固定。當內容捲動時，它已經離開 normal flow，所以會一直停在視窗上方。",
		learningPoints: ["fixed 是相對於 viewport 固定。", "fixed 元素會脫離 normal flow。", "fixed 元素可能遮住內容，需要額外留白。"],
		validate: css => {
			if (!hasDeclaration(css, ".navbar", "position", "fixed")) {
				return fail("請在 .navbar 裡設定 position: fixed。");
			}

			if (!hasDeclaration(css, ".navbar", "top", "0")) {
				return fail("導覽列需要貼齊預覽視窗上方，請設定 top: 0。");
			}

			if (!hasDeclaration(css, ".navbar", "left", "0")) {
				return fail("導覽列需要從視窗左側開始，請設定 left: 0。");
			}

			if (!hasDeclaration(css, ".navbar", "width", "100%")) {
				return fail("導覽列固定後會離開 normal flow，請設定 width: 100% 讓它撐滿寬度。");
			}

			return pass("Level 3 完成。");
		}
	},
	{
		id: 4,
		title: "讓側邊目錄吸附在上方",
		concept: "position: sticky",
		instruction: "這是一篇文章頁面。請讓側邊目錄在捲動到上方時固定住。",
		explanation:
			"sticky 可以想成「先照一般排版走，捲到指定位置後暫時固定」。它需要 top 這類門檻值，瀏覽器才知道什麼時候開始吸附。sticky 不是永遠 fixed，它仍然受父層容器範圍限制，所以常用在文章目錄、表格表頭和列表分類標題。",
		targetSelectors: [".sidebar"],
		starterCss: `.sidebar {
  /* 讓目錄捲到指定位置後吸附 */
}`,
		codeExample: `.sidebar {
  position: sticky;
  top: 20px;
}`,
		resultDescription: "側邊目錄一開始跟著文章排列，捲到距離預覽視窗上方 20px 時會吸附住。",
		hints: ["sticky 一開始像 relative，捲到指定位置後才像 fixed。", "sticky 必須搭配 top、bottom、left 或 right 其中之一。", "這一關只需要讓 .sidebar 使用 position: sticky 並指定 top。"],
		successMessage: "很好！sticky 讓側邊目錄先跟著文章正常排列，捲到 top 指定的位置後就吸附住。它仍然會受到父層容器範圍影響。",
		learningPoints: ["sticky 介於 relative 和 fixed 之間。", "sticky 需要指定 top。", "sticky 會受到父層容器範圍影響。"],
		validate: css => {
			if (!hasDeclaration(css, ".sidebar", "position", "sticky")) {
				return fail("請在 .sidebar 裡加入 position: sticky。");
			}

			if (!hasDeclaration(css, ".sidebar", "top")) {
				return fail("sticky 需要一個吸附門檻，請在 .sidebar 裡加入 top。");
			}

			return pass("Level 4 完成。");
		}
	},
	{
		id: 5,
		title: "讓彈出視窗顯示在最上層",
		concept: "z-index",
		instruction: "頁面上出現了一個彈出視窗，但它被其他內容蓋住了。請使用 position 和 z-index，讓 modal 顯示在遮罩和頁面內容上方。",
		explanation:
			"z-index 控制的是堆疊順序，但它通常需要搭配 positioned element 才可靠。modal 場景通常有三層：頁面內容、遮罩 overlay、彈出視窗 modal。overlay 要蓋住頁面內容，modal 又要蓋住 overlay，所以 modal 的 z-index 必須比 overlay 大。",
		targetSelectors: [".overlay", ".modal"],
		starterCss: `.overlay {
  /* 讓遮罩覆蓋整個預覽視窗 */
}

.modal {
  /* 讓彈出視窗排在遮罩上方 */
}`,
		codeExample: `.overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
}

.modal {
  position: fixed;
  z-index: 20;
}`,
		resultDescription: "遮罩會固定覆蓋整個預覽視窗，modal 會顯示在遮罩上方，捲動畫面時也不會離開視窗。",
		hints: ["z-index 只會對 positioned element 形成可靠的堆疊控制。", "overlay 常用 position: fixed 搭配 inset: 0 覆蓋 viewport。", "modal 的 z-index 數值要大於 overlay。"],
		successMessage: "漂亮！overlay 和 modal 都成為 fixed 元素後，z-index 可以清楚控制堆疊順序。modal 的數值比較大，所以會顯示在遮罩之上。",
		learningPoints: ["z-index 控制堆疊順序。", "z-index 通常需要搭配 positioned element。", "modal、dropdown、tooltip 都常用到 position 和 z-index。"],
		validate: css => {
			if (!hasDeclaration(css, ".overlay", "position", "fixed")) {
				return fail("遮罩要覆蓋預覽視窗，請在 .overlay 裡設定 position: fixed。");
			}

			if (!hasDeclaration(css, ".overlay", "z-index")) {
				return fail("還需要替 .overlay 設定 z-index，讓遮罩蓋住頁面內容。");
			}

			if (!hasDeclaration(css, ".modal", "position", "fixed")) {
				return fail("彈出視窗也需要 position: fixed，才能穩定疊在視窗上方。");
			}

			const overlayZIndex = getNumericDeclaration(css, ".overlay", "z-index");
			const modalZIndex = getNumericDeclaration(css, ".modal", "z-index");

			if (modalZIndex === null) {
				return fail("還需要替 .modal 設定數字形式的 z-index。");
			}

			if (overlayZIndex === null) {
				return fail(".overlay 的 z-index 需要是數字，像 z-index: 10。");
			}

			if (modalZIndex <= overlayZIndex) {
				return fail(".modal 的 z-index 必須大於 .overlay，這樣彈出視窗才會在遮罩上方。");
			}

			return pass("Level 5 完成。");
		}
	}
];
