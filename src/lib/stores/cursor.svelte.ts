import { browser } from '$app/environment';

export const cursorState = $state({
	active: browser ? localStorage.getItem('customCursor') === 'true' : false,
	hovering: false,
	x: 0,
	y: 0
});

export function toggleCursor() {
	cursorState.active = !cursorState.active;
	if (browser) {
		localStorage.setItem('customCursor', cursorState.active.toString());
		if (cursorState.active) {
			document.body.classList.add('custom-cursor-active');
		} else {
			document.body.classList.remove('custom-cursor-active');
		}
	}
}
