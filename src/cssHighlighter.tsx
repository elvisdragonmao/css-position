type HighlightKind = "comment" | "selector" | "property" | "value" | "number" | "color" | "string" | "punctuation" | "plain";

type HighlightToken = {
	text: string;
	kind: HighlightKind;
};

const tokenClassNames: Record<HighlightKind, string> = {
	comment: "text-slate-500",
	selector: "text-emerald-300",
	property: "text-sky-300",
	value: "text-amber-200",
	number: "text-fuchsia-300",
	color: "text-rose-300",
	string: "text-lime-300",
	punctuation: "text-slate-400",
	plain: "text-slate-100"
};

const cssValueKeywords = new Set(["absolute", "auto", "block", "border-box", "fixed", "flex", "grid", "hidden", "inline-flex", "none", "relative", "sticky", "transparent"]);

function pushToken(tokens: HighlightToken[], text: string, kind: HighlightKind) {
	if (!text) {
		return;
	}

	const previousToken = tokens[tokens.length - 1];

	if (previousToken?.kind === kind) {
		previousToken.text += text;
		return;
	}

	tokens.push({ text, kind });
}

function findCommentEnd(css: string, startIndex: number) {
	const endIndex = css.indexOf("*/", startIndex + 2);
	return endIndex === -1 ? css.length : endIndex + 2;
}

function findStringEnd(css: string, startIndex: number) {
	const quote = css[startIndex];
	let index = startIndex + 1;

	while (index < css.length) {
		if (css[index] === "\\") {
			index += 2;
			continue;
		}

		if (css[index] === quote) {
			return index + 1;
		}

		index += 1;
	}

	return css.length;
}

function highlightValueSegment(segment: string, tokens: HighlightToken[]) {
	const valuePattern = /#[0-9a-f]{3,8}\b|-?\d*\.?\d+(?:px|rem|em|%|vh|vw|vmin|vmax|s|ms)?\b|[a-z-]+(?=\()|[a-z-]+\b|["'][\s\S]*?["']/gi;
	let index = 0;
	let match: RegExpExecArray | null;

	while ((match = valuePattern.exec(segment)) !== null) {
		const text = match[0];

		pushToken(tokens, segment.slice(index, match.index), "value");

		if (text.startsWith("#")) {
			pushToken(tokens, text, "color");
		} else if (text.startsWith('"') || text.startsWith("'")) {
			pushToken(tokens, text, "string");
		} else if (/^-?\d/.test(text)) {
			pushToken(tokens, text, "number");
		} else if (cssValueKeywords.has(text.toLowerCase()) || text.endsWith("(")) {
			pushToken(tokens, text, "value");
		} else {
			pushToken(tokens, text, "value");
		}

		index = match.index + text.length;
	}

	pushToken(tokens, segment.slice(index), "value");
}

export function highlightCss(css: string) {
	const tokens: HighlightToken[] = [];
	let index = 0;
	let isInsideRule = false;
	let expectsProperty = true;

	while (index < css.length) {
		if (css.startsWith("/*", index)) {
			const endIndex = findCommentEnd(css, index);
			pushToken(tokens, css.slice(index, endIndex), "comment");
			index = endIndex;
			continue;
		}

		const char = css[index];

		if (char === "{" || char === "}") {
			pushToken(tokens, char, "punctuation");
			isInsideRule = char === "{";
			expectsProperty = true;
			index += 1;
			continue;
		}

		if (!isInsideRule) {
			const nextRuleIndex = css.indexOf("{", index);
			const nextCommentIndex = css.indexOf("/*", index);
			const stopIndexes = [nextRuleIndex, nextCommentIndex].filter(stopIndex => stopIndex !== -1);
			const endIndex = stopIndexes.length > 0 ? Math.min(...stopIndexes) : css.length;
			pushToken(tokens, css.slice(index, endIndex), "selector");
			index = endIndex;
			continue;
		}

		if (char === ";") {
			pushToken(tokens, char, "punctuation");
			expectsProperty = true;
			index += 1;
			continue;
		}

		if (char === ":") {
			pushToken(tokens, char, "punctuation");
			expectsProperty = false;
			index += 1;
			continue;
		}

		if (char === '"' || char === "'") {
			const endIndex = findStringEnd(css, index);
			pushToken(tokens, css.slice(index, endIndex), "string");
			index = endIndex;
			continue;
		}

		if (expectsProperty) {
			const nextColonIndex = css.indexOf(":", index);
			const nextCommentIndex = css.indexOf("/*", index);
			const nextBraceIndex = css.indexOf("}", index);
			const stopIndexes = [nextColonIndex, nextCommentIndex, nextBraceIndex].filter(stopIndex => stopIndex !== -1);
			const endIndex = stopIndexes.length > 0 ? Math.min(...stopIndexes) : css.length;
			const segment = css.slice(index, endIndex);
			const propertyMatch = segment.match(/^(\s*)([a-z-]+)([\s\S]*)$/i);

			if (propertyMatch) {
				pushToken(tokens, propertyMatch[1], "plain");
				pushToken(tokens, propertyMatch[2], "property");
				pushToken(tokens, propertyMatch[3], "plain");
			} else {
				pushToken(tokens, segment, "plain");
			}

			index = endIndex;
			continue;
		}

		const nextSemicolonIndex = css.indexOf(";", index);
		const nextCommentIndex = css.indexOf("/*", index);
		const nextBraceIndex = css.indexOf("}", index);
		const stopIndexes = [nextSemicolonIndex, nextCommentIndex, nextBraceIndex].filter(stopIndex => stopIndex !== -1);
		const endIndex = stopIndexes.length > 0 ? Math.min(...stopIndexes) : css.length;

		highlightValueSegment(css.slice(index, endIndex), tokens);
		index = endIndex;
	}

	return tokens;
}

type CssHighlightProps = {
	css: string;
};

export function CssHighlight({ css }: CssHighlightProps) {
	const tokens = highlightCss(css.endsWith("\n") ? `${css} ` : css);

	return (
		<>
			{tokens.map((token, index) => (
				<span key={`${index}-${token.kind}`} className={tokenClassNames[token.kind]}>
					{token.text}
				</span>
			))}
		</>
	);
}
