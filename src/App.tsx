import { ArrowRight, CheckCircle2, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { levels, type Level, type ValidationResult } from "./levels";
import { buildPreviewHtml } from "./previewHtml";

function cx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(" ");
}

type HeaderProps = {
	level: Level;
	currentLevelIndex: number;
	totalLevels: number;
	isCompleted: boolean;
	isLastLevel: boolean;
	onCheck: () => void;
	onHint: () => void;
	onReset: () => void;
	onNext: () => void;
};

function Header({ level, currentLevelIndex, totalLevels, isCompleted, isLastLevel, onCheck, onHint, onReset, onNext }: HeaderProps) {
	const progressPercent = ((currentLevelIndex + 1) / totalLevels) * 100;

	return (
		<header className="border-b border-slate-200 bg-white">
			<div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div className="max-w-3xl">
						<p className="text-sm font-semibold text-sky-700">網站是怎麼排版的？CSS Position 的使用</p>
						<div className="mt-2 flex flex-wrap items-center gap-3">
							<h1 className="text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">{level.title}</h1>
							<span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
								Level {level.id} / {totalLevels}
							</span>
						</div>
						<p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{level.instruction}</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={onHint}
							className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800 transition hover:bg-sky-100"
						>
							<Lightbulb className="h-4 w-4" aria-hidden="true" />
							提示
						</button>
						<button type="button" onClick={onCheck} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
							<CheckCircle2 className="h-4 w-4" aria-hidden="true" />
							檢查答案
						</button>
						<button
							type="button"
							onClick={onReset}
							className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
						>
							<RotateCcw className="h-4 w-4" aria-hidden="true" />
							重設
						</button>
						{isCompleted ? (
							<button type="button" onClick={onNext} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
								{isLastLevel ? "查看總結" : "下一關"}
								<ArrowRight className="h-4 w-4" aria-hidden="true" />
							</button>
						) : null}
					</div>
				</div>
				<div className="h-2 overflow-hidden rounded-full bg-slate-100">
					<div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progressPercent}%` }} />
				</div>
			</div>
		</header>
	);
}

type EditorPanelProps = {
	level: Level;
	userCss: string;
	onChange: (css: string) => void;
};

function EditorPanel({ level, userCss, onChange }: EditorPanelProps) {
	return (
		<section className="flex min-h-[560px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-panel">
			<div className="border-b border-slate-800 px-4 py-3">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h2 className="text-sm font-semibold text-white">CSS 編輯器</h2>
						<p className="mt-1 text-xs text-slate-400">目前要修改的 selector</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{level.targetSelectors.map(selector => (
							<code key={selector} className="rounded-md bg-slate-800 px-2 py-1 text-xs font-semibold text-emerald-300">
								{selector}
							</code>
						))}
					</div>
				</div>
			</div>
			<label className="sr-only" htmlFor="css-editor">
				輸入 CSS
			</label>
			<textarea
				id="css-editor"
				value={userCss}
				onChange={event => onChange(event.target.value)}
				spellCheck={false}
				className="min-h-[480px] flex-1 resize-none bg-slate-950 px-4 py-4 font-mono text-sm leading-7 text-slate-100 outline-none selection:bg-sky-500/40"
			/>
		</section>
	);
}

type PreviewPanelProps = {
	level: Level;
	userCss: string;
};

function PreviewPanel({ level, userCss }: PreviewPanelProps) {
	const previewHtml = useMemo(() => buildPreviewHtml(level.id, userCss), [level.id, userCss]);

	return (
		<section className="flex min-h-[560px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-panel">
			<div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
				<div>
					<h2 className="text-sm font-semibold text-slate-950">即時預覽</h2>
					<p className="mt-1 text-xs text-slate-500">修改左側 CSS 後會立即更新</p>
				</div>
				<span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{level.concept}</span>
			</div>
			<iframe title={`Level ${level.id} preview`} sandbox="" srcDoc={previewHtml} className="h-[560px] w-full flex-1 bg-white" />
		</section>
	);
}

type StatusPanelProps = {
	level: Level;
	hintIndex: number;
	validationResult: ValidationResult | null;
};

function StatusPanel({ level, hintIndex, validationResult }: StatusPanelProps) {
	const visibleHint = hintIndex >= 0 ? level.hints[hintIndex] : "按「提示」可以逐步取得方向。";

	return (
		<section className="grid gap-4 lg:grid-cols-[1fr_1fr_1.25fr]">
			<div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
				<h2 className="text-sm font-bold text-sky-950">目前提示</h2>
				<p className="mt-2 text-sm leading-6 text-sky-900">{visibleHint}</p>
			</div>
			<div className={cx("rounded-xl border p-4", validationResult?.success ? "border-emerald-200 bg-emerald-50" : validationResult ? "border-red-200 bg-red-50" : "border-slate-200 bg-white")}>
				<h2 className={cx("text-sm font-bold", validationResult?.success ? "text-emerald-950" : validationResult ? "text-red-950" : "text-slate-950")}>
					{validationResult?.success ? "成功訊息" : validationResult ? "錯誤訊息" : "檢查結果"}
				</h2>
				<p className={cx("mt-2 text-sm leading-6", validationResult?.success ? "text-emerald-900" : validationResult ? "text-red-900" : "text-slate-600")}>
					{validationResult?.success ? level.successMessage : (validationResult?.message ?? "按「檢查答案」後，這裡會顯示結果。")}
				</p>
			</div>
			<div className="rounded-xl border border-slate-200 bg-white p-4">
				<h2 className="text-sm font-bold text-slate-950">這一關學到的概念</h2>
				<ul className="mt-2 space-y-2">
					{level.learningPoints.map(point => (
						<li key={point} className="flex gap-2 text-sm leading-6 text-slate-600">
							<span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" aria-hidden="true" />
							<span>{point}</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

type SummaryScreenProps = {
	onRestart: () => void;
};

function SummaryScreen({ onRestart }: SummaryScreenProps) {
	const rows = [
		["relative", "相對原本位置微調"],
		["absolute", "相對父層定位"],
		["fixed", "相對視窗固定"],
		["sticky", "捲動到指定位置後固定"],
		["z-index", "控制堆疊順序"]
	];

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
			<section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-panel sm:p-8">
				<div className="flex items-center gap-3">
					<div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
						<Sparkles className="h-5 w-5" aria-hidden="true" />
					</div>
					<div>
						<p className="text-sm font-semibold text-emerald-700">完成全部關卡</p>
						<h1 className="text-2xl font-bold tracking-normal sm:text-3xl">你完成了 CSS Position 挑戰！</h1>
					</div>
				</div>
				<p className="mt-5 text-base leading-8 text-slate-600">你已經練習了 relative、absolute、fixed、sticky 和 z-index。現在你不只是記住 position 的定義，而是能在真實網頁情境中判斷它們的用途。</p>
				<div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
					<table className="w-full border-collapse text-left text-sm">
						<thead className="bg-slate-100 text-slate-700">
							<tr>
								<th className="px-4 py-3 font-bold">Position</th>
								<th className="px-4 py-3 font-bold">主要用途</th>
							</tr>
						</thead>
						<tbody>
							{rows.map(row => (
								<tr key={row[0]} className="border-t border-slate-200">
									<td className="px-4 py-3 font-mono font-semibold text-slate-950">{row[0]}</td>
									<td className="px-4 py-3 text-slate-600">{row[1]}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<button type="button" onClick={onRestart} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
					<RotateCcw className="h-4 w-4" aria-hidden="true" />
					重新開始
				</button>
			</section>
		</main>
	);
}

function App() {
	const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
	const [userCss, setUserCss] = useState(levels[0].starterCss);
	const [hintIndex, setHintIndex] = useState(-1);
	const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
	const [completedLevels, setCompletedLevels] = useState<number[]>([]);
	const [showSummary, setShowSummary] = useState(false);

	const currentLevel = levels[currentLevelIndex];
	const isCompleted = completedLevels.includes(currentLevel.id);
	const isLastLevel = currentLevelIndex === levels.length - 1;

	function moveToLevel(nextIndex: number) {
		const nextLevel = levels[nextIndex];
		setCurrentLevelIndex(nextIndex);
		setUserCss(nextLevel.starterCss);
		setHintIndex(-1);
		setValidationResult(null);
	}

	function handleCssChange(css: string) {
		setUserCss(css);
		setValidationResult(null);
	}

	function handleCheck() {
		const result = currentLevel.validate(userCss);
		setValidationResult(result);

		if (result.success) {
			setCompletedLevels(previous => (previous.includes(currentLevel.id) ? previous : [...previous, currentLevel.id]));
		}
	}

	function handleHint() {
		setHintIndex(previous => Math.min(previous + 1, currentLevel.hints.length - 1));
	}

	function handleReset() {
		setUserCss(currentLevel.starterCss);
		setHintIndex(-1);
		setValidationResult(null);
	}

	function handleNext() {
		if (!isCompleted) {
			return;
		}

		if (isLastLevel) {
			setShowSummary(true);
			return;
		}

		moveToLevel(currentLevelIndex + 1);
	}

	function handleRestart() {
		setCompletedLevels([]);
		setShowSummary(false);
		moveToLevel(0);
	}

	if (showSummary) {
		return <SummaryScreen onRestart={handleRestart} />;
	}

	return (
		<div className="min-h-screen bg-slate-50 text-slate-950">
			<Header
				level={currentLevel}
				currentLevelIndex={currentLevelIndex}
				totalLevels={levels.length}
				isCompleted={isCompleted}
				isLastLevel={isLastLevel}
				onCheck={handleCheck}
				onHint={handleHint}
				onReset={handleReset}
				onNext={handleNext}
			/>
			<main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(360px,0.95fr)_minmax(480px,1.25fr)] lg:px-8">
				<EditorPanel level={currentLevel} userCss={userCss} onChange={handleCssChange} />
				<PreviewPanel level={currentLevel} userCss={userCss} />
			</main>
			<footer className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
				<StatusPanel level={currentLevel} hintIndex={hintIndex} validationResult={validationResult} />
			</footer>
		</div>
	);
}

export default App;
