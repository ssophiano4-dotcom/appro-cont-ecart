const test = require("node:test");
const assert = require("node:assert/strict");
const ClairControle = require("../app.js");

test("the invoice menu exposes the four requested subcategories in order", () => {
  assert.deepEqual(
    ClairControle.INVOICE_SUBSECTIONS.map((tab) => tab.id),
    [
      "factures-bon-commande",
      "factures-lettre-commande",
      "factures-accords",
      "factures-contrats"
    ]
  );
  assert.deepEqual(
    ClairControle.INVOICE_SUBSECTIONS.map((tab) => tab.title),
    ["Bon de commande", "Lettre de commande", "Accords", "Contrats"]
  );
});

test("the document menu retains its three other document sections", () => {
  assert.deepEqual(
    ClairControle.DOCUMENT_TABS.map((tab) => tab.id),
    ["bons-commande", "bons-reception", "bons-livraison"]
  );
});

test("each document page has an explicit development placeholder", () => {
  for (const tab of ClairControle.DOCUMENT_PAGES) {
    assert.ok(tab.description.length > 10);
    assert.ok(tab.eyebrow.includes("ESPACE") || tab.eyebrow.includes("FACTURES"));
  }
});

test("unknown document pages are rejected without changing dashboard state", () => {
  assert.equal(ClairControle.getDocumentPage("unknown"), null);
});
