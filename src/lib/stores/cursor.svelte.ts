import { browser } from '$app/environment';

const initialValue = browser ? localStorage.getItem('customCursor') !== 'false' : true;

export const cursorState = $state({
	active: initialValue,
	hovering: false,
	x: 0,
	y: 0
});

if (browser && cursorState.active) {
	document.body.classList.add('custom-cursor-active');
}

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
