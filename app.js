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
  root.Claircompta = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  const loginScreen = document.getElementById("login-screen");
  const dashboardScreen = document.getElementById("dashboard-screen");
  const loginForm = document.getElementById("login-form");
  const identityInput = document.getElementById("login-identity");
  const passwordInput = document.getElementById("login-password");
  const loginFeedback = document.getElementById("login-feedback");
  const tabButtons = [...document.querySelectorAll('[role="tab"][data-tab]')];
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

    const selectedButton = tabButtons.find((button) => button.dataset.tab === tabId);
    if (!selectedButton) return false;

    for (const button of tabButtons) {
      const active = button === selectedButton;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    }

    panel.setAttribute("aria-labelledby", selectedButton.id);
    document.getElementById("empty-state-title").textContent = selectedTab.title;
    document.getElementById("empty-state-description").textContent = selectedTab.description;
    document.querySelector(".empty-eyebrow").textContent = selectedTab.eyebrow;

    if (moveFocus) selectedButton.focus();
    return true;
  }

  function showDashboard(identity) {
    const name = getDisplayName(identity);
    const displayName = name.split(/\s+/)[0];
    document.getElementById("user-name").textContent = name;
    document.getElementById("user-avatar").textContent = displayName.slice(0, 1).toLocaleUpperCase("fr");
    document.getElementById("greeting-name").textContent = displayName;
    document.getElementById("today-date").textContent = formatDate(new Date());
    activateTab(DOCUMENT_TABS[0].id, false);
    loginScreen.hidden = true;
    dashboardScreen.hidden = false;
    document.getElementById("tab-factures").focus();
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

  for (const [index, button] of tabButtons.entries()) {
    button.addEventListener("click", () => activateTab(button.dataset.tab, false));
    button.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabButtons.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabButtons.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabButtons[nextIndex].dataset.tab, true);
    });
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
