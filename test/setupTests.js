// https://github.com/dfahlander/Dexie.js/issues/359#issuecomment-390636035
const setGlobalVars = require('indexeddbshim');
const Dexie = require('dexie');
const shim = {};
setGlobalVars(shim, { checkOrigin: false });
const { indexedDB, IDBKeyRange } = shim;
Dexie.dependencies.indexedDB = indexedDB;
Dexie.dependencies.IDBKeyRange = IDBKeyRange;

// const setGlobalVars = require('indexeddbshim');
// const Dexie = require('dexie');
// global.shimNS = true;

// setGlobalVars(global, { checkOrigin: false });

// global.window = global; // We'll allow ourselves to use `window.indexedDB` or `indexedDB` as a global

// Dexie.dependencies.indexedDB = setGlobalVars.indexedDB;
// Dexie.dependencies.IDBKeyRange = setGlobalVars.IDBKeyRange;
