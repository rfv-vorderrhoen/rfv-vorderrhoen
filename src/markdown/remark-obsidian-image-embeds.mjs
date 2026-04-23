import fs from "node:fs";
import path from "node:path";

const EMBED_PATTERN = /!\[\[([^\]]+)\]\]/g;
const IMAGE_EXTENSION_PATTERN =
    /\.(avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
const PDF_EXTENSION_PATTERN = /\.pdf(?:[?#].*)?$/i;
const REMOTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;
const BASE_PATH =
    process.env.PUBLIC_BASE_PATH ??
    (process.env.NODE_ENV === "development" ? "/" : "/rfv-vorderrhoen");
const NORMALIZED_BASE = BASE_PATH === "/" ? "" : BASE_PATH.replace(/\/$/, "");
const PROJECT_ROOT = process.cwd();
const PUBLIC_ROOT = path.join(PROJECT_ROOT, "public");

function withBase(url) {
    if (
        !url ||
        REMOTE_URL_PATTERN.test(url) ||
        url.startsWith("mailto:") ||
        url.startsWith("tel:") ||
        url.startsWith("#")
    ) {
        return url;
    }

    if (!url.startsWith("/")) {
        return url;
    }

    if (!NORMALIZED_BASE) {
        return url;
    }

    if (url === NORMALIZED_BASE || url.startsWith(`${NORMALIZED_BASE}/`)) {
        return url;
    }

    if (url === "/") {
        return NORMALIZED_BASE;
    }

    return `${NORMALIZED_BASE}${url}`;
}

function toPosixPath(filePath) {
    return filePath.split(path.sep).join("/");
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function parseEmbedTarget(rawTarget) {
    const [urlPart, ...optionParts] = rawTarget.split("|");
    const url = urlPart?.trim();
    const options = optionParts.map((part) => part.trim()).filter(Boolean);

    return { url, options };
}

function resolveLocalAssetPath(url, sourceFilePath) {
    if (
        !url ||
        !sourceFilePath ||
        REMOTE_URL_PATTERN.test(url) ||
        url.startsWith("/")
    ) {
        return null;
    }

    const absolutePath = path.resolve(path.dirname(sourceFilePath), url);
    const relativeToProject = path.relative(PROJECT_ROOT, absolutePath);

    if (relativeToProject.startsWith("..") || !fs.existsSync(absolutePath)) {
        return null;
    }

    return absolutePath;
}

function ensurePublicPdfUrl(url, sourceFilePath) {
    if (!url || !PDF_EXTENSION_PATTERN.test(url)) {
        return null;
    }

    if (REMOTE_URL_PATTERN.test(url)) {
        return url;
    }

    if (url.startsWith("/")) {
        return withBase(url);
    }

    const absolutePath = resolveLocalAssetPath(url, sourceFilePath);

    if (!absolutePath) {
        return null;
    }

    const sourceInPublic = path.relative(PUBLIC_ROOT, absolutePath);

    if (!sourceInPublic.startsWith("..")) {
        return withBase(`/${toPosixPath(sourceInPublic)}`);
    }

    const relativeToProject = path.relative(PROJECT_ROOT, absolutePath);
    const publicRelativePath = path.join("_markdown-assets", relativeToProject);
    const publicFilePath = path.join(PUBLIC_ROOT, publicRelativePath);
    const publicDirectory = path.dirname(publicFilePath);
    const shouldCopy =
        !fs.existsSync(publicFilePath) ||
        fs.statSync(publicFilePath).mtimeMs < fs.statSync(absolutePath).mtimeMs;

    if (shouldCopy) {
        fs.mkdirSync(publicDirectory, { recursive: true });
        fs.copyFileSync(absolutePath, publicFilePath);
    }

    return withBase(`/${toPosixPath(publicRelativePath)}`);
}

function createTextNode(value) {
    return { type: "text", value };
}

function createImageNode(rawTarget) {
    const { url, options: optionParts } = parseEmbedTarget(rawTarget);

    if (!url || !IMAGE_EXTENSION_PATTERN.test(url)) {
        return null;
    }

    let alt = "";
    let width;
    let height;

    for (const option of optionParts.map((part) => part.trim()).filter(Boolean)) {
        if (/^\d+$/.test(option)) {
            width = Number(option);
            continue;
        }

        const sizeMatch = option.match(/^(\d+)x(\d+)$/i);

        if (sizeMatch) {
            width = Number(sizeMatch[1]);
            height = Number(sizeMatch[2]);
            continue;
        }

        if (!alt) {
            alt = option;
        }
    }

    const hProperties = {
        loading: "lazy",
        decoding: "async",
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
    };

    return {
        type: "image",
        url,
        alt,
        data: {
            hProperties,
        },
    };
}

function createPdfNode(rawTarget, sourceFilePath) {
    const { url, options } = parseEmbedTarget(rawTarget);

    if (!url || !PDF_EXTENSION_PATTERN.test(url)) {
        return null;
    }

    const resolvedUrl = ensurePublicPdfUrl(url, sourceFilePath);

    if (!resolvedUrl) {
        return null;
    }

    const fileName = url.split("/").at(-1) ?? "Dokument.pdf";
    const titleText = options.find((option) => !/^\d+(x\d+)?$/i.test(option));
    const title = titleText || fileName.replace(/\.pdf$/i, "");
    const escapedTitleText = escapeHtml(title);
    let width;
    let height;

    for (const option of options) {
        if (/^\d+$/.test(option)) {
            height = Number(option);
            continue;
        }

        const sizeMatch = option.match(/^(\d+)x(\d+)$/i);

        if (sizeMatch) {
            width = Number(sizeMatch[1]);
            height = Number(sizeMatch[2]);
        }
    }

    const styleParts = [];

    if (width) {
        styleParts.push(`--pdf-embed-max-width:${width}px`);
    }

    if (height) {
        styleParts.push(`--pdf-embed-height:${height}px`);
    }

    const inlinePreviewRequested = Boolean(width || height);
    const styleAttribute = styleParts.length
        ? ` style="${escapeHtml(styleParts.join(";"))}"`
        : "";
    const escapedUrl = escapeHtml(encodeURI(resolvedUrl));
    const escapedTitle = escapeHtml(`PDF: ${title}`);
    const downloadAttribute = REMOTE_URL_PATTERN.test(resolvedUrl)
        ? ""
        : " download";
    const actionsMarkup =
        `<span class="markdown-pdf-embed__actions">` +
        `<a class="markdown-pdf-embed__link" href="${escapedUrl}" target="_blank" rel="noreferrer">PDF öffnen</a>` +
        `<a class="markdown-pdf-embed__link" href="${escapedUrl}"${downloadAttribute}>PDF herunterladen</a>` +
        `</span>`;

    if (!inlinePreviewRequested) {
        return {
            type: "html",
            value:
                `<span class="markdown-pdf-embed markdown-pdf-embed--card">` +
                `<span class="markdown-pdf-embed__summary">` +
                `<span class="markdown-pdf-embed__eyebrow">Dokument</span>` +
                `<span class="markdown-pdf-embed__title">${escapedTitleText}</span>` +
                `</span>` +
                actionsMarkup +
                `</span>`,
        };
    }

    return {
        type: "html",
        value:
            `<span class="markdown-pdf-embed markdown-pdf-embed--inline"${styleAttribute}>` +
            `<span class="markdown-pdf-embed__viewer">` +
            `<object class="markdown-pdf-embed__frame" data="${escapedUrl}" type="application/pdf" title="${escapedTitle}">` +
            `<span class="markdown-pdf-embed__fallback">` +
            `<span class="markdown-pdf-embed__fallback-title">${escapedTitleText}</span>` +
            `<span class="markdown-pdf-embed__fallback-copy">PDF-Vorschau nicht verfuegbar. Bitte die Links darunter verwenden.</span>` +
            `</span>` +
            `</object>` +
            `</span>` +
            actionsMarkup +
            `</span>`,
    };
}

function replaceEmbedsInTextNode(node, sourceFilePath) {
    if (node.type !== "text" || !node.value.includes("![[")) {
        return null;
    }

    const segments = [];
    let lastIndex = 0;

    for (const match of node.value.matchAll(EMBED_PATTERN)) {
        const matchIndex = match.index ?? 0;

        if (matchIndex > lastIndex) {
            segments.push(createTextNode(node.value.slice(lastIndex, matchIndex)));
        }

        const embedNode =
            createImageNode(match[1]) ?? createPdfNode(match[1], sourceFilePath);
        segments.push(embedNode ?? createTextNode(match[0]));
        lastIndex = matchIndex + match[0].length;
    }

    if (lastIndex === 0) {
        return null;
    }

    if (lastIndex < node.value.length) {
        segments.push(createTextNode(node.value.slice(lastIndex)));
    }

    return segments.filter((segment) => segment.type !== "text" || segment.value);
}

function transformChildren(node, sourceFilePath) {
    if (!node || !Array.isArray(node.children)) {
        return;
    }

    const nextChildren = [];

    for (const child of node.children) {
        const replacedChildren = replaceEmbedsInTextNode(child, sourceFilePath);

        if (replacedChildren) {
            nextChildren.push(...replacedChildren);
            continue;
        }

        transformChildren(child, sourceFilePath);
        nextChildren.push(child);
    }

    node.children = nextChildren;
}

export default function remarkObsidianImageEmbeds() {
    return (tree, file) => {
        transformChildren(tree, file?.path ?? file?.history?.[0]);
    };
}
