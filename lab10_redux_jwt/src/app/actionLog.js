// Action log infrastructure.
//
// This module demonstrates the SUBSCRIBE concept twice:
//  1. Redux itself: store.subscribe() is registered in store.js and calls
//     recordStateChange() after every state change.
//  2. This module keeps its own tiny listener list so React components can
//     re-render whenever a new entry is logged (same publish/subscribe idea).

const MAX_ENTRIES = 30;

let entries = [];
let version = 0;
let stateChangeCount = 0;
const listeners = new Set();

function emit() {
  version += 1;
  listeners.forEach((fn) => fn());
}

export function logAction(actionType) {
  entries = [
    { kind: 'action', label: actionType, time: new Date().toLocaleTimeString() },
    ...entries,
  ].slice(0, MAX_ENTRIES);
  emit();
}

export function recordStateChange() {
  stateChangeCount += 1;
  emit();
}

export function clearLog() {
  entries = [];
  emit();
}

export function subscribeLog(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getLogSnapshot() {
  return { entries, version, stateChangeCount };
}
