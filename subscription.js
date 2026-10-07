/* MYFLIX subscription/account module
   Change the active key below for your deployment.
   IMPORTANT: A key stored in browser JavaScript is not secret. For real paid
   access, validate subscriptions on a server and issue short-lived sessions.
*/
(() => {
  "use strict";

  // ===== CHANGE YOUR SUBSCRIPTION KEY HERE =====
  const SUBSCRIPTION_KEY = "MYFLIX-2026-DEMO";
  // =============================================

  const ACCOUNT_STORAGE = "myflix.account.v1";
  const SUB_STORAGE = "myflix.subscription.v1";
  const $ = (id) => document.getElementById(id);

  function getAccount() {
    try { return JSON.parse(localStorage.getItem(ACCOUNT_STORAGE) || "null"); }
    catch { return null; }
  }

  function isSubscribed() {
    return localStorage.getItem(SUB_STORAGE) === "active";
  }

  function updateHeader() {
    const btn = $("accountBtn");
    if (btn) btn.textContent = getAccount() ? "👤 Profile" : "👤 Create Account";
  }

  function showStep(step) {
    ["createStep", "profileStep", "keyStep"].forEach(id => $(id)?.classList.remove("active"));
    $(step)?.classList.add("active");
    const account = getAccount();
    $("accountTitle").textContent =
      step === "createStep" ? "Create Account" :
      step === "keyStep" ? "Subscription Key" : "Profile";

    if (account) {
      $("profileName").textContent = account.name;
      $("profileEmail").textContent = account.email;
      $("subscriptionStatus").textContent = isSubscribed() ? "Active" : "Not active";
    }
  }

  function openAccount(step) {
    $("accountModal").classList.add("show");
    showStep(getAccount() ? (step || "profileStep") : "createStep");
  }

  function closeAccount() {
    $("accountModal").classList.remove("show");
    $("createMsg").textContent = "";
    $("profileMsg").textContent = "";
    $("keyMsg").textContent = "";
    $("subscriptionKey").value = "";
  }

  function promptForAccess() {
    if (!getAccount()) {
      openAccount("createStep");
      $("createMsg").textContent = "Create an account before watching a movie.";
      return;
    }
    if (!isSubscribed()) {
      openAccount("keyStep");
      $("keyMsg").textContent = "Enter your subscription key to start watching.";
      return;
    }
  }

  function canWatch() {
    return Boolean(getAccount() && isSubscribed());
  }

  $("accountBtn")?.addEventListener("click", () => openAccount());
  $("accountClose")?.addEventListener("click", closeAccount);

  $("accountModal")?.addEventListener("click", event => {
    if (event.target === $("accountModal")) closeAccount();
  });

  $("createAccount")?.addEventListener("click", () => {
    const name = $("accountName").value.trim();
    const email = $("accountEmail").value.trim();

    if (name.length < 2) {
      $("createMsg").textContent = "Please enter your name.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $("createMsg").textContent = "Please enter a valid email address.";
      return;
    }

    localStorage.setItem(ACCOUNT_STORAGE, JSON.stringify({ name, email }));
    updateHeader();
    showStep("profileStep");
  });

  $("subscriptionBtn")?.addEventListener("click", () => showStep("keyStep"));
  $("backProfile")?.addEventListener("click", () => showStep("profileStep"));

  $("activateKey")?.addEventListener("click", () => {
    const entered = $("subscriptionKey").value.trim();

    if (!entered) {
      $("keyMsg").textContent = "Enter a subscription key.";
      return;
    }

    if (entered !== SUBSCRIPTION_KEY) {
      $("keyMsg").textContent = "Invalid subscription key.";
      return;
    }

    localStorage.setItem(SUB_STORAGE, "active");
    $("subscriptionKey").value = "";
    showStep("profileStep");
    $("profileMsg").textContent = "Subscription activated. You can now watch movies and episodes.";
  });

  $("signOutBtn")?.addEventListener("click", () => {
    localStorage.removeItem(ACCOUNT_STORAGE);
    localStorage.removeItem(SUB_STORAGE);
    updateHeader();
    showStep("createStep");
    $("createMsg").textContent = "You have signed out.";
  });

  window.MyflixAuth = { canWatch, promptForAccess, openAccount };
  updateHeader();
})();
