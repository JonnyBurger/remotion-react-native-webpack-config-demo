// @ts-expect-error process shall be empty object
window.process = {};
window.process.env = {};
// @ts-expect-error dev variable should be available
window.__DEV__ = true;
// @ts-expect-error setImmediate is needed by reanimated
window.setImmediate = (fn) => {
	setTimeout(fn, 0);
};
