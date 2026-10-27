(function (root) {
  "use strict";

  const INVOICE_SUBSECTIONS = [
    {
      id: "factures-bon-commande",
      title: "Bon de commande",
      description: "Le suivi des factures associées aux bons de commande prendra place ici.",
      eyebrow: "FACTURES · BON DE COMMANDE"
    },
    {
      id: "factures-lettre-commande",
      title: "Lettre de commande",
      description: "Le classement et le suivi des factures associées aux lettres de commande seront disponibles ici.",
      eyebrow: "FACTURES · LETTRE DE COMMANDE"
    },
    {
      id: "factures-accords",
      title: "Accords",
      description: "Le suivi des factures liées aux accords et leurs justificatifs prendra place ici.",
      eyebrow: "FACTURES · ACCORDS"
    },
    {
      id: "factures-contrats",
      title: "Contrats",
      description: "La consultation des factures rattachées aux contrats sera organisée dans cet espace.",
      eyebrow: "FACTURES · CONTRATS"
    }
  ];

  const DOCUMENT_TABS = [
    {
      id: "bons-commande",
      title: "Bons de commande",
      description: "La création, le suivi et la consultation des bons de commande seront disponibles ici.",
      eyebrow: "VOTRE ESPACE BONS DE COMMANDE"
    },
    {
      id: "bons-reception",
      title: "Bons de réception",
      description: "Le contrôle des quantités reçues et le suivi des bons de réception prendront place ici.",
      eyebrow: "VOTRE ESPACE BONS DE RÉCEPTION"
    },
    {
      id: "bons-livraison",
      title: "Bons de livraison",
      description: "La consultation et le suivi des livraisons seront organisés dans cet espace.",
      eyebrow: "VOTRE ESPACE BONS DE LIVRAISON"
    }
  ];

  const DOCUMENT_PAGES = [...INVOICE_SUBSECTIONS, ...DOCUMENT_TABS];

  function getDocumentPage(pageId) {
    return DOCUMENT_PAGES.find((page) => page.id === pageId) || null;
  }

  const api = { INVOICE_SUBSECTIONS, DOCUMENT_TABS, DOCUMENT_PAGES, getDocumentPage };
  root.ClairControle = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  const loginScreen = document.getElementById("login-screen");
  const dashboardScreen = document.getElementById("dashboard-screen");
  const loginForm = document.getElementById("login-form");
  const identityInput = document.getElementById("login-identity");
  const passwordInput = document.getElementById("login-password");
  const loginFeedback = document.getElementById("login-feedback");
  const menu = document.getElementById("document-menu");
  const menuTrigger = document.getElementById("document-menu-trigger");
  const menuList = document.getElementById("document-menu-list");
  const menuItems = [...menuList.querySelectorAll(':scope > [role="menuitem"]')];
  const invoiceGroup = document.getElementById("invoice-menu-group");
  const invoiceTrigger = document.getElementById("nav-factures");
  const rootMenuItems = [invoiceTrigger, ...menuItems];
  const invoiceSubmenu = document.getElementById("invoice-submenu");
  const invoiceItems = [...invoiceSubmenu.querySelectorAll('[role="menuitem"][data-page]')];
  const panel = document.getElementById("document-panel");
  let activePageId = INVOICE_SUBSECTIONS[0].id;
  const feedbackMessages = {
    demoSignIn: "Connexion de démonstration. Aucune authentification réelle n’est configurée.",
    forgotPassword: "La récupération du mot de passe sera disponible avec la mise en place d’un service d’authentification."
  };

  function getDisplayName(identity) {
    const name = identity.trim().split("@")[0].replace(/[._-]+/g, " ").trim();
    return name || "vous";
  }

  function setLoginFeedback(message, isInfo) {
    loginFeedback.textContent = message;
    loginFeedback.classList.toggle("is-info", Boolean(isInfo));
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function activatePage(pageId, moveFocus) {
    const selectedPage = getDocumentPage(pageId);
    if (!selectedPage) return false;

    const selectedButton = [...rootMenuItems, ...invoiceItems].find(
      (button) => button.dataset.tab === pageId || button.dataset.page === pageId
    );
    if (!selectedButton) return false;

    for (const button of [...rootMenuItems, ...invoiceItems]) {
      const active = button === selectedButton;
      button.classList.toggle(
        "is-active",
        button === invoiceTrigger ? pageId.startsWith("factures-") : active
      );
    }

    activePageId = pageId;
    const isInvoicePage = pageId.startsWith("factures-");
    const parentLabel = isInvoicePage ? "Factures" : selectedPage.title;
    document.getElementById("active-document-label").textContent =
      isInvoicePage ? `Factures · ${selectedPage.title}` : selectedPage.title;
    panel.setAttribute("aria-label", isInvoicePage ? `${parentLabel} — ${selectedPage.title}` : selectedPage.title);
    document.getElementById("empty-state-title").textContent = selectedPage.title;
    document.getElementById("empty-state-description").textContent = selectedPage.description;
    document.querySelector(".empty-eyebrow").textContent = selectedPage.eyebrow;

    if (moveFocus) selectedButton.focus();
    return true;
  }

  function setInvoiceSubmenuOpen(isOpen, moveFocus) {
    invoiceGroup.classList.toggle("is-open", isOpen);
    invoiceTrigger.setAttribute("aria-expanded", String(isOpen));
    invoiceSubmenu.hidden = !isOpen;
    if (moveFocus) invoiceItems[0].focus();
  }

  function setMenuOpen(isOpen, restoreFocus) {
    menu.classList.toggle("is-open", isOpen);
    menuTrigger.setAttribute("aria-expanded", String(isOpen));
    menuList.hidden = !isOpen;
    if (!isOpen) setInvoiceSubmenuOpen(false, false);
    if (restoreFocus) menuTrigger.focus();
  }

  function showDashboard(identity) {
    const name = getDisplayName(identity);
    const displayName = name.split(/\s+/)[0];
    passwordInput.value = "";
    document.getElementById("user-name").textContent = name;
    document.getElementById("user-avatar").textContent = displayName.slice(0, 1).toLocaleUpperCase("fr");
    document.getElementById("greeting-name").textContent = displayName;
    document.getElementById("today-date").textContent = formatDate(new Date());
    activatePage(activePageId, false);
    loginScreen.hidden = true;
    dashboardScreen.hidden = false;
    menuTrigger.focus();
  }

  function showLogin() {
    dashboardScreen.hidden = true;
    loginScreen.hidden = false;
    loginForm.reset();
    setLoginFeedback("", false);
    identityInput.focus();
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;
    setLoginFeedback(feedbackMessages.demoSignIn, true);
    showDashboard(identityInput.value);
  });

  document.getElementById("forgot-password").addEventListener("click", (event) => {
    event.preventDefault();
    setLoginFeedback(feedbackMessages.forgotPassword, true);
  });

  document.getElementById("toggle-password").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const shouldShow = passwordInput.type === "password";
    passwordInput.type = shouldShow ? "text" : "password";
    button.setAttribute("aria-pressed", String(shouldShow));
    button.setAttribute("aria-label", shouldShow ? "Masquer le mot de passe" : "Afficher le mot de passe");
    passwordInput.focus();
  });

  document.getElementById("logout-button").addEventListener("click", showLogin);

  menu.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") setMenuOpen(true, false);
  });

  menu.addEventListener("pointerleave", (event) => {
    if (
      event.pointerType === "mouse" &&
      (!menu.contains(document.activeElement) || document.activeElement === menuTrigger)
    ) {
      setMenuOpen(false, false);
    }
  });

  invoiceGroup.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") setInvoiceSubmenuOpen(true, false);
  });

  invoiceGroup.addEventListener("pointerleave", (event) => {
    if (
      event.pointerType === "mouse" &&
      (!invoiceGroup.contains(document.activeElement) || document.activeElement === invoiceTrigger)
    ) {
      setInvoiceSubmenuOpen(false, false);
    }
  });

  invoiceGroup.addEventListener("focusout", (event) => {
    if (!invoiceGroup.contains(event.relatedTarget)) setInvoiceSubmenuOpen(false, false);
  });

  menu.addEventListener("focusout", (event) => {
    if (!menu.contains(event.relatedTarget)) setMenuOpen(false, false);
  });

  menuTrigger.addEventListener("click", () => {
    setMenuOpen(menuList.hidden, false);
  });

  menuTrigger.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setMenuOpen(true, false);
      rootMenuItems[event.key === "ArrowDown" ? 0 : rootMenuItems.length - 1].focus();
    } else if (event.key === "Escape") {
      setMenuOpen(false, false);
    }
  });

  invoiceTrigger.addEventListener("click", () => {
    setInvoiceSubmenuOpen(invoiceSubmenu.hidden, false);
  });

  invoiceTrigger.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setInvoiceSubmenuOpen(true, true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setMenuOpen(false, true);
    }
  });

  for (const [index, button] of rootMenuItems.entries()) {
    if (button === invoiceTrigger) continue;
    button.addEventListener("click", () => {
      activatePage(button.dataset.tab, false);
      setMenuOpen(false, true);
    });
    button.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowDown") nextIndex = (index + 1) % rootMenuItems.length;
      else if (event.key === "ArrowUp") nextIndex = (index - 1 + rootMenuItems.length) % rootMenuItems.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = menuItems.length - 1;
      else if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false, true);
        return;
      } else return;
      event.preventDefault();
      rootMenuItems[nextIndex].focus();
    });
  }

  for (const [index, button] of invoiceItems.entries()) {
    button.addEventListener("click", () => {
      activatePage(button.dataset.page, false);
      setMenuOpen(false, true);
    });
    button.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowDown") nextIndex = (index + 1) % invoiceItems.length;
      else if (event.key === "ArrowUp") nextIndex = (index - 1 + invoiceItems.length) % invoiceItems.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = invoiceItems.length - 1;
      else if (event.key === "ArrowLeft") {
        event.preventDefault();
        invoiceTrigger.focus();
        return;
      } else if (event.key === "Escape") {
        event.preventDefault();
        setInvoiceSubmenuOpen(false, false);
        invoiceTrigger.focus();
        return;
      } else return;
      event.preventDefault();
      invoiceItems[nextIndex].focus();
    });
  }

  document.addEventListener("pointerdown", (event) => {
    if (!menu.contains(event.target)) setMenuOpen(false, false);
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
