import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = [
  "index.html",
  "suporte/index.html",
  "legal/privacy-policy/index.html",
  "legal/terms-of-use/index.html",
  "privacy.html",
  "terms.html",
];
const legalJsonFiles = [
  "src/legal/privacy-policy.json",
  "src/legal/terms-of-use.json",
];
const errors = [];

function resolveFrom(file, value) {
  const pathname = value.split("#")[0].split("?")[0];

  return path.resolve(root, path.dirname(file), pathname);
}

function assertFile(file) {
  const target = path.resolve(root, file);

  if (!existsSync(target) || !statSync(target).isFile()) {
    errors.push(`Missing file: ${file}`);
  }
}

function validateLegalJson(file) {
  const data = JSON.parse(readFileSync(path.resolve(root, file), "utf8"));

  if (!data.hero?.title || !data.hero?.lastUpdated || !data.hero?.summary) {
    errors.push(`${file} is missing required hero fields`);
  }

  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    errors.push(`${file} must contain at least one section`);
  }
}

function shouldCheckReference(value) {
  return (
    value &&
    !value.startsWith("#") &&
    !value.startsWith("http") &&
    !value.startsWith("mailto:") &&
    !value.startsWith("tel:")
  );
}

function validateHtmlReferences(file) {
  const html = readFileSync(path.resolve(root, file), "utf8");
  const references = [
    ...html.matchAll(/\b(?:href|src)="([^"]+)"/g),
    ...html.matchAll(/\bdata-(?:legal-source|legal-icon|preset-base-path)="([^"]+)"/g),
  ].map((match) => match[1]);

  references.filter(shouldCheckReference).forEach((reference) => {
    const target = resolveFrom(file, reference);
    const isDirectoryReference = reference.endsWith("/");

    if (!existsSync(target)) {
      errors.push(`${file} references missing path: ${reference}`);
      return;
    }

    if (isDirectoryReference && !statSync(target).isDirectory()) {
      errors.push(`${file} expected directory path: ${reference}`);
    }
  });
}

htmlFiles.forEach(assertFile);
legalJsonFiles.forEach((file) => {
  assertFile(file);
  validateLegalJson(file);
});
htmlFiles.forEach(validateHtmlReferences);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Static site validation passed.");
}
