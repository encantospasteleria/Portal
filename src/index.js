// index.js
// Punto de entrada del bundle. Expone la clase Firestore en el ámbito global
// de Apps Script para poder usarla desde doGet()/doPost() o el editor.

const { Firestore } = require("./firebase/firebase");

globalThis.Firestore = Firestore;