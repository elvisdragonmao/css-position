type CssRule = {
	selectors: string[];
	declarations: Map<string, string>;
};

function stripComments(css: string) {
	return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function normalizeSelector(selector: string) {
	return selector.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeProperty(property: string) {
	return property.trim().toLowerCase();
}

function normalizeValue(value: string) {
	return value
		.trim()
		.replace(/\s*!important\s*$/i, "")
		.replace(/\s+/g, " ")
		.toLowerCase();
}

function selectorMatches(candidate: string, expectedSelector: string) {
	return candidate === expectedSelector || candidate.endsWith(` ${expectedSelector}`);
}

function isZeroValue(value: string) {
	return /^[-+]?0(?:\.0+)?(?:px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)?$/.test(value);
}

function valuesMatch(actual: string, expected: string) {
	const actualValue = normalizeValue(actual);
	const expectedValue = normalizeValue(expected);

	if (actualValue === expectedValue) {
		return true;
	}

	return isZeroValue(actualValue) && isZeroValue(expectedValue);
}

function parseDeclarations(block: string) {
	const declarations = new Map<string, string>();

	for (const rawDeclaration of block.split(";")) {
		const colonIndex = rawDeclaration.indexOf(":");

		if (colonIndex === -1) {
			continue;
		}

		const property = normalizeProperty(rawDeclaration.slice(0, colonIndex));
		const value = normalizeValue(rawDeclaration.slice(colonIndex + 1));

		if (property && value) {
			declarations.set(property, value);
		}
	}

	return declarations;
}

export function parseCssRules(css: string): CssRule[] {
	const cleanedCss = stripComments(css);
	const rules: CssRule[] = [];
	const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
	let match: RegExpExecArray | null;

	while ((match = rulePattern.exec(cleanedCss)) !== null) {
		const selectorPart = match[1].trim();

		if (!selectorPart || selectorPart.startsWith("@")) {
			continue;
		}

		const selectors = selectorPart.split(",").map(normalizeSelector).filter(Boolean);
		const declarations = parseDeclarations(match[2]);

		if (selectors.length > 0 && declarations.size > 0) {
			rules.push({ selectors, declarations });
		}
	}

	return rules;
}

export function getDeclaration(css: string, selector: string, property: string) {
	const expectedSelector = normalizeSelector(selector);
	const expectedProperty = normalizeProperty(property);
	let declaration: string | undefined;

	for (const rule of parseCssRules(css)) {
		if (rule.selectors.some(candidate => selectorMatches(candidate, expectedSelector)) && rule.declarations.has(expectedProperty)) {
			declaration = rule.declarations.get(expectedProperty);
		}
	}

	return declaration;
}

export function hasDeclaration(css: string, selector: string, property: string, expectedValue?: string): boolean {
	const declaration = getDeclaration(css, selector, property);

	if (!declaration) {
		return false;
	}

	return expectedValue === undefined || valuesMatch(declaration, expectedValue);
}

export function getNumericDeclaration(css: string, selector: string, property: string) {
	const declaration = getDeclaration(css, selector, property);

	if (!declaration) {
		return null;
	}

	const numericMatch = declaration.match(/^-?\d+(?:\.\d+)?$/);

	if (!numericMatch) {
		return null;
	}

	return Number(declaration);
}
