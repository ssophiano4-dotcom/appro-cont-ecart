(function (root) {
  "use strict";

  const DOCUMENT_TABS = [
    {
      id: "factures",
      title: "Factures",
      description: "Le traitement, la liste et le suivi du statut de vos factures prendront place ici.",
      eyebrow: "VOTRE ESPACE FACTURES"
    },
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

  function getDocumentTab(tabId) {
    return DOCUMENT_TABS.find((tab) => tab.id === tabId) || null;
  }

  const api = { DOCUMENT_TABS, getDocumentTab };
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
  const menuItems = [...menu.querySelectorAll('[role="menuitem"][data-tab]')];
  const panel = document.getElementById("document-panel");
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

  function activateTab(tabId, moveFocus) {
    const selectedTab = getDocumentTab(tabId);
    if (!selectedTab) return false;

    const selectedButton = menuItems.find((button) => button.dataset.tab === tabId);
    if (!selectedButton) return false;

    for (const button of menuItems) {
      const active = button === selectedButton;
      button.classList.toggle("is-active", active);
    }

    document.getElementById("active-document-label").textContent = selectedTab.title;
    panel.setAttribute("aria-label", selectedTab.title);
    document.getElementById("empty-state-title").textContent = selectedTab.title;
    document.getElementById("empty-state-description").textContent = selectedTab.description;
    document.querySelector(".empty-eyebrow").textContent = selectedTab.eyebrow;

    if (moveFocus) selectedButton.focus();
    return true;
  }

  function setMenuOpen(isOpen, restoreFocus) {
    menu.classList.toggle("is-open", isOpen);
    menuTrigger.setAttribute("aria-expanded", String(isOpen));
    menuList.hidden = !isOpen;
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
    activateTab(DOCUMENT_TABS[0].id, false);
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
      menuItems[event.key === "ArrowDown" ? 0 : menuItems.length - 1].focus();
    } else if (event.key === "Escape") {
      setMenuOpen(false, false);
    }
  });

  for (const [index, button] of menuItems.entries()) {
    button.addEventListener("click", () => {
      activateTab(button.dataset.tab, false);
      setMenuOpen(false, true);
    });
    button.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowDown") nextIndex = (index + 1) % menuItems.length;
      else if (event.key === "ArrowUp") nextIndex = (index - 1 + menuItems.length) % menuItems.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = menuItems.length - 1;
      else if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false, true);
        return;
      } else return;
      event.preventDefault();
      menuItems[nextIndex].focus();
    });
  }

  document.addEventListener("pointerdown", (event) => {
    if (!menu.contains(event.target)) setMenuOpen(false, false);
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
