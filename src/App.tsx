import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, MousePointer2, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type UIEvent } from "react";
import { CssHighlight } from "./cssHighlighter";
import { levels, type Level, type ValidationResult } from "./levels";
import { buildPreviewHtml } from "./previewHtml";

function cx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(" ");
}

const editorIndent = "  ";

type AppMode = "interactive" | "reading";

type ModeToggleProps = {
	mode: AppMode;
	onModeChange: (mode: AppMode) => void;
};

function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
	return (
		<div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
			<button
				type="button"
				onClick={() => onModeChange("interactive")}
				className={cx(
					"inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition",
					mode === "interactive" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
				)}
			>
				<MousePointer2 className="h-4 w-4" aria-hidden="true" />
				互動練習
			</button>
			<button
				type="button"
				onClick={() => onModeChange("reading")}
				className={cx(
					"inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition",
					mode === "reading" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
				)}
			>
				<BookOpen className="h-4 w-4" aria-hidden="true" />
				文字說明
			</button>
		</div>
	);
}

type HeaderProps = {
	level: Level;
	levels: Level[];
	mode: AppMode;
	currentLevelIndex: number;
	totalLevels: number;
	isCompleted: boolean;
	isLastLevel: boolean;
	onCheck: () => void;
	onReset: () => void;
	onNext: () => void;
	onModeChange: (mode: AppMode) => void;
	onSelectLevel: (index: number) => void;
};

function Header({ level, levels, mode, currentLevelIndex, totalLevels, isCompleted, isLastLevel, onCheck, onReset, onNext, onModeChange, onSelectLevel }: HeaderProps) {
	const progressPercent = ((currentLevelIndex + 1) / totalLevels) * 100;

	return (
		<header className="border-b border-slate-200 bg-white">
			<div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div className="max-w-3xl">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:block">
							<p className="text-sm font-semibold text-sky-700">網站是怎麼排版的？CSS Position 的使用</p>
							<div className="lg:hidden">
								<ModeToggle mode={mode} onModeChange={onModeChange} />
							</div>
						</div>
						<div className="mt-2 flex flex-wrap items-center gap-3">
							<h1 className="text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">{level.title}</h1>
							<label className="relative inline-flex items-center">
								<span className="sr-only">切換關卡</span>
								<select
									value={currentLevelIndex}
									onChange={event => onSelectLevel(Number(event.target.value))}
									className="h-8 appearance-none rounded-full border border-slate-200 bg-slate-50 pl-3 pr-8 text-sm font-semibold text-slate-700 outline-none transition hover:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
								>
									{levels.map((optionLevel, index) => (
										<option key={optionLevel.id} value={index}>
											Level {optionLevel.id} / {totalLevels}
										</option>
									))}
								</select>
								<ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-slate-500" aria-hidden="true" />
							</label>
						</div>
						<p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{level.instruction}</p>
						<div className="mt-4 max-w-3xl rounded-xl border border-slate-200 bg-slate-50 p-4">
							<h2 className="text-sm font-bold text-slate-950">觀念說明</h2>
							<p className="mt-2 text-sm leading-7 text-slate-600">{level.explanation}</p>
						</div>
					</div>
					<div className="flex flex-wrap gap-2 lg:justify-end">
						<div className="hidden w-full justify-end lg:flex">
							<ModeToggle mode={mode} onModeChange={onModeChange} />
						</div>
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
	const highlightLayerRef = useRef<HTMLElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (highlightLayerRef.current) {
			highlightLayerRef.current.style.transform = "translate(0px, 0px)";
		}

		if (textareaRef.current) {
			textareaRef.current.scrollLeft = 0;
			textareaRef.current.scrollTop = 0;
		}
	}, [level.id]);

	function handleEditorScroll(event: UIEvent<HTMLTextAreaElement>) {
		if (!highlightLayerRef.current) {
			return;
		}

		highlightLayerRef.current.style.transform = `translate(${-event.currentTarget.scrollLeft}px, ${-event.currentTarget.scrollTop}px)`;
	}

	function updateEditorValue(nextCss: string, selectionStart: number, selectionEnd = selectionStart) {
		onChange(nextCss);

		requestAnimationFrame(() => {
			const editor = textareaRef.current;

			if (!editor) {
				return;
			}

			editor.focus();
			editor.setSelectionRange(selectionStart, selectionEnd);
		});
	}

	function getLineStart(value: string, position: number) {
		return value.lastIndexOf("\n", position - 1) + 1;
	}

	function handleTabKey(editor: HTMLTextAreaElement, shouldOutdent: boolean) {
		const { selectionStart, selectionEnd, value } = editor;
		const selectedLineStart = getLineStart(value, selectionStart);
		const hasMultiLineSelection = value.slice(selectionStart, selectionEnd).includes("\n");

		if (!hasMultiLineSelection) {
			if (!shouldOutdent) {
				const nextCss = `${value.slice(0, selectionStart)}${editorIndent}${value.slice(selectionEnd)}`;
				updateEditorValue(nextCss, selectionStart + editorIndent.length);
				return;
			}

			const currentLine = value.slice(selectedLineStart, selectionStart);
			const removableSpaces = currentLine.endsWith(editorIndent) ? editorIndent.length : currentLine.endsWith(" ") ? 1 : 0;

			if (removableSpaces === 0) {
				return;
			}

			const removeStart = selectionStart - removableSpaces;
			const nextCss = `${value.slice(0, removeStart)}${value.slice(selectionStart)}`;
			updateEditorValue(nextCss, removeStart);
			return;
		}

		const selectedText = value.slice(selectedLineStart, selectionEnd);
		const lines = selectedText.split("\n");

		if (!shouldOutdent) {
			const nextSelectedText = lines.map(line => `${editorIndent}${line}`).join("\n");
			const nextCss = `${value.slice(0, selectedLineStart)}${nextSelectedText}${value.slice(selectionEnd)}`;
			updateEditorValue(nextCss, selectionStart + editorIndent.length, selectionEnd + editorIndent.length * lines.length);
			return;
		}

		let removedBeforeSelection = 0;
		let totalRemoved = 0;
		let lineOffset = selectedLineStart;
		const nextSelectedText = lines
			.map(line => {
				const removedCharacters = line.startsWith(editorIndent) ? editorIndent.length : line.startsWith(" ") || line.startsWith("\t") ? 1 : 0;

				if (lineOffset < selectionStart) {
					removedBeforeSelection += removedCharacters;
				}

				totalRemoved += removedCharacters;
				lineOffset += line.length + 1;

				return line.slice(removedCharacters);
			})
			.join("\n");

		const nextCss = `${value.slice(0, selectedLineStart)}${nextSelectedText}${value.slice(selectionEnd)}`;
		const nextSelectionStart = Math.max(selectedLineStart, selectionStart - removedBeforeSelection);
		updateEditorValue(nextCss, nextSelectionStart, Math.max(nextSelectionStart, selectionEnd - totalRemoved));
	}

	function handleEnterKey(editor: HTMLTextAreaElement) {
		const { selectionStart, selectionEnd, value } = editor;
		const lineStart = getLineStart(value, selectionStart);
		const lineEndIndex = value.indexOf("\n", selectionEnd);
		const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
		const beforeCaret = value.slice(lineStart, selectionStart);
		const afterCaretInLine = value.slice(selectionEnd, lineEnd);
		const currentIndent = beforeCaret.match(/^\s*/)?.[0] ?? "";
		const shouldIndentNextLine = beforeCaret.trimEnd().endsWith("{");
		const shouldPlaceClosingBrace = shouldIndentNextLine && afterCaretInLine.trimStart().startsWith("}");
		const nextIndent = `${currentIndent}${shouldIndentNextLine ? editorIndent : ""}`;

		if (shouldPlaceClosingBrace) {
			const insertion = `\n${nextIndent}\n${currentIndent}`;
			const nextCss = `${value.slice(0, selectionStart)}${insertion}${value.slice(selectionEnd)}`;
			updateEditorValue(nextCss, selectionStart + 1 + nextIndent.length);
			return;
		}

		const insertion = `\n${nextIndent}`;
		const nextCss = `${value.slice(0, selectionStart)}${insertion}${value.slice(selectionEnd)}`;
		updateEditorValue(nextCss, selectionStart + insertion.length);
	}

	function handleEditorKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key !== "Tab" && event.key !== "Enter") {
			return;
		}

		event.preventDefault();

		if (event.key === "Tab") {
			handleTabKey(event.currentTarget, event.shiftKey);
			return;
		}

		handleEnterKey(event.currentTarget);
	}

	return (
		<section className="flex min-h-[560px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-panel">
			<div className="border-b border-slate-800 px-4 py-3">
				<h2 className="text-sm font-semibold text-white">CSS 編輯器</h2>
			</div>
			<label className="sr-only" htmlFor="css-editor">
				輸入 CSS
			</label>
			<div className="relative min-h-[480px] flex-1 overflow-hidden bg-slate-950">
				<pre aria-hidden="true" className="pointer-events-none absolute inset-0 m-0 overflow-hidden px-4 py-4 font-mono text-sm leading-7">
					<code ref={highlightLayerRef} className="block min-h-full whitespace-pre-wrap break-words">
						<CssHighlight css={userCss} />
					</code>
				</pre>
				<textarea
					id="css-editor"
					ref={textareaRef}
					value={userCss}
					onChange={event => onChange(event.target.value)}
					onKeyDown={handleEditorKeyDown}
					onScroll={handleEditorScroll}
					spellCheck={false}
					className="absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent px-4 py-4 font-mono text-sm leading-7 text-transparent caret-slate-100 outline-none selection:bg-sky-500/40"
				/>
			</div>
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
			<div className="border-b border-slate-200 px-4 py-3">
				<h2 className="text-sm font-semibold text-slate-950">即時預覽</h2>
			</div>
			<iframe title={`Level ${level.id} preview`} sandbox="" srcDoc={previewHtml} className="h-[560px] w-full flex-1 bg-white" />
		</section>
	);
}

type StatusPanelProps = {
	level: Level;
	hintIndex: number;
	onPreviousHint: () => void;
	onNextHint: () => void;
	onSelectHint: (index: number) => void;
	validationResult: ValidationResult | null;
};

function StatusPanel({ level, hintIndex, onPreviousHint, onNextHint, onSelectHint, validationResult }: StatusPanelProps) {
	const visibleHint = level.hints[hintIndex] ?? level.hints[0];
	const isFirstHint = hintIndex === 0;
	const isLastHint = hintIndex === level.hints.length - 1;

	return (
		<section className="grid gap-4 lg:grid-cols-[1fr_1fr_1.25fr]">
			<div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
				<div className="flex items-start justify-between gap-3">
					<div>
						<h2 className="text-sm font-bold text-sky-950">目前提示</h2>
						<div className="mt-2 flex flex-wrap items-center gap-1.5" aria-label="提示序號">
							<span className="mr-1 text-xs font-semibold text-sky-800">提示</span>
							{level.hints.map((hint, index) => (
								<button
									key={hint}
									type="button"
									onClick={() => onSelectHint(index)}
									className={cx("grid h-6 w-6 place-items-center rounded-full text-xs font-bold transition", index === hintIndex ? "bg-sky-700 text-white" : "bg-white text-sky-800 hover:bg-sky-100")}
									aria-label={`查看提示 ${index + 1}`}
								>
									{index + 1}
								</button>
							))}
						</div>
					</div>
					<div className="flex gap-1">
						<button
							type="button"
							onClick={onPreviousHint}
							disabled={isFirstHint}
							className="grid h-8 w-8 place-items-center rounded-lg border border-sky-200 bg-white text-sky-800 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
							aria-label="上一個提示"
						>
							<ChevronLeft className="h-4 w-4" aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={onNextHint}
							disabled={isLastHint}
							className="grid h-8 w-8 place-items-center rounded-lg border border-sky-200 bg-white text-sky-800 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
							aria-label="下一個提示"
						>
							<ChevronRight className="h-4 w-4" aria-hidden="true" />
						</button>
					</div>
				</div>
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

type StaticResultPreviewProps = {
	levelId: number;
};

function StaticResultPreview({ levelId }: StaticResultPreviewProps) {
	if (levelId === 1) {
		return (
			<div className="grid min-h-64 place-items-center bg-slate-50 p-6">
				<div className="w-72 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
					<div className="flex items-center gap-3">
						<div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-200 via-emerald-100 to-violet-200" />
						<div>
							<div className="h-4 w-24 rounded bg-slate-900" />
							<div className="mt-2 h-3 w-36 rounded bg-slate-200" />
						</div>
					</div>
					<div className="mt-5 border-t border-slate-200 pt-4">
						<span className="relative -top-2 left-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]">NEW</span>
					</div>
				</div>
			</div>
		);
	}

	if (levelId === 2) {
		return (
			<div className="grid min-h-64 place-items-center bg-slate-50 p-6">
				<div className="relative w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
					<div className="grid h-32 place-items-center bg-gradient-to-br from-sky-100 via-amber-100 to-violet-100">
						<div className="h-16 w-28 rotate-[-8deg] rounded-xl bg-white shadow-md" />
					</div>
					<span className="absolute right-3 top-3 rounded-full bg-red-100 px-3 py-1 text-xs font-black tracking-wide text-red-800">SALE</span>
					<div className="p-4">
						<div className="h-4 w-36 rounded bg-slate-900" />
						<div className="mt-3 h-3 w-44 rounded bg-slate-200" />
						<div className="mt-5 h-4 w-20 rounded bg-emerald-500" />
					</div>
				</div>
			</div>
		);
	}

	if (levelId === 3) {
		return (
			<div className="relative h-64 overflow-hidden bg-white">
				<div className="absolute inset-x-0 top-0 z-10 flex h-12 items-center justify-between bg-slate-950 px-4 text-xs font-bold text-white">
					<span>STUDIO NOTES</span>
					<span className="text-slate-300">作品 文章 聯絡</span>
				</div>
				<div className="pt-12">
					<div className="grid h-28 place-items-center bg-gradient-to-br from-sky-100 to-amber-100">
						<div className="text-center text-sm font-bold text-slate-700">navbar 固定在 viewport 上方</div>
					</div>
					<div className="space-y-3 p-4">
						<div className="h-10 rounded-lg border border-slate-200 bg-slate-50" />
						<div className="h-10 rounded-lg border border-slate-200 bg-slate-50" />
						<div className="h-10 rounded-lg border border-slate-200 bg-slate-50" />
					</div>
				</div>
			</div>
		);
	}

	if (levelId === 4) {
		return (
			<div className="grid min-h-64 grid-cols-[120px_1fr] gap-4 bg-slate-50 p-5">
				<div className="sticky top-5 h-36 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
					<div className="h-3 w-16 rounded bg-slate-900" />
					<div className="mt-4 space-y-2">
						<div className="h-2 w-20 rounded bg-slate-200" />
						<div className="h-2 w-16 rounded bg-slate-200" />
						<div className="h-2 w-24 rounded bg-slate-200" />
					</div>
				</div>
				<div className="rounded-xl border border-slate-200 bg-white p-4">
					<div className="h-5 w-40 rounded bg-slate-900" />
					<div className="mt-5 space-y-3">
						{Array.from({ length: 8 }, (_, index) => (
							<div key={index} className="h-3 rounded bg-slate-200" />
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative min-h-64 overflow-hidden bg-slate-100 p-6">
			<div className="grid grid-cols-2 gap-3 opacity-70">
				{Array.from({ length: 4 }, (_, index) => (
					<div key={index} className="h-20 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
						<div className="h-3 w-20 rounded bg-slate-900" />
						<div className="mt-3 h-2 w-24 rounded bg-slate-200" />
					</div>
				))}
			</div>
			<div className="absolute inset-0 bg-slate-950/45" />
			<div className="absolute left-1/2 top-14 w-64 -translate-x-1/2 rounded-xl bg-white p-5 shadow-xl">
				<div className="h-5 w-28 rounded bg-slate-900" />
				<div className="mt-4 h-3 w-full rounded bg-slate-200" />
				<div className="mt-2 h-3 w-44 rounded bg-slate-200" />
				<div className="mt-5 flex justify-end">
					<div className="h-8 w-16 rounded-lg bg-slate-950" />
				</div>
			</div>
		</div>
	);
}

type ReadingVersionProps = {
	mode: AppMode;
	onModeChange: (mode: AppMode) => void;
};

function ReadingVersion({ mode, onModeChange }: ReadingVersionProps) {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-950">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
					<div className="max-w-3xl">
						<p className="text-sm font-semibold text-sky-700">網站是怎麼排版的？CSS Position 的使用</p>
						<h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">CSS Position 文字教學版</h1>
						<p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
							在網頁中，所有東西預設都是左到右，上到下。但有時候我們想把東西放在奇怪的地方：導覽列固定在畫面最上方、商品卡片右上角出現 SALE 標籤、彈出視窗蓋在頁面上方...這時就需要使用 CSS Position。
						</p>
					</div>
					<ModeToggle mode={mode} onModeChange={onModeChange} />
				</div>
			</header>
			<main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:px-8">
				{levels.map(level => (
					<article key={level.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-panel">
						<div className="border-b border-slate-200 px-5 py-4">
							<p className="text-sm font-semibold text-sky-700">
								Level {level.id} · {level.concept}
							</p>
							<h2 className="mt-1 text-xl font-bold text-slate-950">{level.title}</h2>
						</div>
						<div className="grid gap-0 lg:grid-cols-[1.1fr_0.95fr_1fr]">
							<section className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
								<h3 className="text-sm font-bold text-slate-950">文字說明</h3>
								<p className="mt-3 text-sm leading-7 text-slate-600">{level.explanation}</p>
								<p className="mt-4 text-sm leading-7 text-slate-600">{level.resultDescription}</p>
								<ul className="mt-4 space-y-2">
									{level.learningPoints.map(point => (
										<li key={point} className="flex gap-2 text-sm leading-6 text-slate-600">
											<span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" aria-hidden="true" />
											<span>{point}</span>
										</li>
									))}
								</ul>
							</section>
							<section className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
								<h3 className="text-sm font-bold text-slate-950">Code example</h3>
								<pre className="mt-3 overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-sm leading-7">
									<code>
										<CssHighlight css={level.codeExample} />
									</code>
								</pre>
							</section>
							<section className="p-5">
								<h3 className="text-sm font-bold text-slate-950">畫面結果</h3>
								<div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
									<StaticResultPreview levelId={level.id} />
								</div>
							</section>
						</div>
					</article>
				))}
			</main>
		</div>
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
	const [mode, setMode] = useState<AppMode>("interactive");
	const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
	const [userCss, setUserCss] = useState(levels[0].starterCss);
	const [hintIndex, setHintIndex] = useState(0);
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
		setHintIndex(0);
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

	function handlePreviousHint() {
		setHintIndex(previous => Math.max(previous - 1, 0));
	}

	function handleNextHint() {
		setHintIndex(previous => Math.min(previous + 1, currentLevel.hints.length - 1));
	}

	function handleSelectHint(index: number) {
		setHintIndex(index);
	}

	function handleSelectLevel(index: number) {
		moveToLevel(index);
	}

	function handleReset() {
		setUserCss(currentLevel.starterCss);
		setHintIndex(0);
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

	if (mode === "reading") {
		return <ReadingVersion mode={mode} onModeChange={setMode} />;
	}

	return (
		<div className="min-h-screen bg-slate-50 text-slate-950">
			<Header
				level={currentLevel}
				levels={levels}
				mode={mode}
				currentLevelIndex={currentLevelIndex}
				totalLevels={levels.length}
				isCompleted={isCompleted}
				isLastLevel={isLastLevel}
				onCheck={handleCheck}
				onReset={handleReset}
				onNext={handleNext}
				onModeChange={setMode}
				onSelectLevel={handleSelectLevel}
			/>
			<main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(360px,0.95fr)_minmax(480px,1.25fr)] lg:px-8">
				<EditorPanel level={currentLevel} userCss={userCss} onChange={handleCssChange} />
				<PreviewPanel level={currentLevel} userCss={userCss} />
			</main>
			<footer className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
				<StatusPanel level={currentLevel} hintIndex={hintIndex} onPreviousHint={handlePreviousHint} onNextHint={handleNextHint} onSelectHint={handleSelectHint} validationResult={validationResult} />
			</footer>
		</div>
	);
}

export default App;
