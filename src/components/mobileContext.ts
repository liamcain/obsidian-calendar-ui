// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isMobile = (window.app as any).isMobile;
const key = Symbol("isMobile");

export { isMobile, key };
