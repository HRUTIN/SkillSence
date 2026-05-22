const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, '');
const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const configuredBase = trimTrailingSlashes(import.meta.env.VITE_API_BASE_URL || '');
const runtimeOrigin = typeof window !== 'undefined' ? trimTrailingSlashes(window.location.origin) : '';

const parseUrl = (value: string) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const configuredUrl = parseUrl(configuredBase);
const runtimeUrl = parseUrl(runtimeOrigin);
const configuredIsLocal =
  configuredUrl !== null &&
  ['127.0.0.1', 'localhost'].includes(configuredUrl.hostname);
const runtimeIsLocal =
  runtimeUrl !== null &&
  ['127.0.0.1', 'localhost'].includes(runtimeUrl.hostname);
const servedByBackend =
  runtimeUrl !== null && runtimeUrl.port !== '8080' && runtimeUrl.port !== '5173';
const shouldUseRuntimeOrigin =
  configuredIsLocal &&
  runtimeUrl !== null &&
  configuredUrl !== null &&
  (
    !runtimeIsLocal ||
    (servedByBackend && configuredUrl.origin !== runtimeUrl.origin)
  );

export const apiBase =
  shouldUseRuntimeOrigin
    ? runtimeOrigin
    : configuredBase || runtimeOrigin;

export const buildApiUrl = (path: string) => (isAbsoluteUrl(path) ? path : `${apiBase}${path}`);
