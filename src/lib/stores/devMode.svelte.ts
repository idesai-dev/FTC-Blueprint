/**
 * Developer Mode store — persisted in localStorage.
 * Toggle via global search: "/dev3432" to enable, "/reg3432" to disable.
 */

const STORAGE_KEY = 'blueprint-dev-mode';

function getInitialState(): boolean {
	if (typeof window === 'undefined') return false;
	try {
		return localStorage.getItem(STORAGE_KEY) === 'true';
	} catch {
		return false;
	}
}

export const devModeState = $state({ active: false });

export function initDevMode() {
	devModeState.active = getInitialState();
}

export function setDevMode(val: boolean) {
	devModeState.active = val;
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem(STORAGE_KEY, String(val));
		} catch {
			// ignore storage errors
		}
	}
}
