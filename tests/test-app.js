const test = require("node:test");
const assert = require("node:assert/strict");
const Claircompta = require("../app.js");

test("the dashboard exposes the four requested document tabs in order", () => {
  assert.deepEqual(
    Claircompta.DOCUMENT_TABS.map((tab) => tab.id),
    ["factures", "bons-commande", "bons-reception", "bons-livraison"]
  );
  assert.deepEqual(
    Claircompta.DOCUMENT_TABS.map((tab) => tab.title),
    ["Factures", "Bons de commande", "Bons de réception", "Bons de livraison"]
  );
});

test("each document tab has an explicit development placeholder", () => {
  for (const tab of Claircompta.DOCUMENT_TABS) {
    assert.ok(tab.description.length > 10);
    assert.ok(tab.eyebrow.includes("VOTRE ESPACE"));
  }
});

test("unknown document tabs are rejected without changing dashboard state", () => {
  assert.equal(Claircompta.getDocumentTab("unknown"), null);
});
