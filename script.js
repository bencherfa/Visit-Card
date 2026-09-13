/**
 * Solvytech Digital Business Card — Interactive Controller
 * Features:
 * - vCard download with animated toast feedback
 * - 1-Click Copy-to-clipboard with inline visual confirmation
 * - Interactive QR Code Modal (with native Web Share API)
 * - Light / Dark Theme toggle (persisted via localStorage)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const downloadBtn = document.getElementById("download-button");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const openQrBtn = document.getElementById("open-qr-btn");
  const openShareBtn = document.getElementById("btn-open-share");
  const qrModal = document.getElementById("qr-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const btnCopyLink = document.getElementById("btn-copy-link");
  const btnShareNative = document.getElementById("btn-share-native");
  const copyButtons = document.querySelectorAll(".btn-copy-inline");

  const CARD_URL = "https://benacer.solvytech.com";
  let toastTimer = null;

  /**
   * Display floating toast notification
   * @param {string} msg
   * @param {number} duration
   */
  function showToast(msg, duration = 3000) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;

    toast.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }

  /**
   * Copy text to clipboard with legacy fallback
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("Clipboard API failed, trying fallback", err);
      }
    }

    // Fallback using textarea
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error("Fallback copy failed", err);
      return false;
    }
  }

  // ==========================================
  // 1. Theme Management (matches solvytech.com)
  // ==========================================
  function initTheme() {
    const savedTheme = localStorage.getItem("solvytech-card-theme");
    if (savedTheme === "light") {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light-theme");
      if (isLight) {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        localStorage.setItem("solvytech-card-theme", "dark");
        showToast("Mode sombre activé");
      } else {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        localStorage.setItem("solvytech-card-theme", "light");
        showToast("Mode clair activé");
      }
    });
  }

  initTheme();

  // ==========================================
  // 2. vCard Download Action
  // ==========================================
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      if (navigator.vibrate) navigator.vibrate(50);
      showToast("Fiche contact enregistrée avec succès !");
    });
  }

  // ==========================================
  // 3. Inline Copy Buttons (Email & Phones)
  // ==========================================
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      const success = await copyToClipboard(textToCopy);
      if (success) {
        if (navigator.vibrate) navigator.vibrate(30);

        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.add("copied");

        showToast("Copié dans le presse-papier !");

        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove("copied");
        }, 2000);
      } else {
        showToast("Impossible de copier dans le presse-papier");
      }
    });
  });

  // ==========================================
  // 4. QR Code & Share Modal
  // ==========================================
  function openModal() {
    if (!qrModal) return;
    qrModal.classList.add("active");
    qrModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!qrModal) return;
    qrModal.classList.remove("active");
    qrModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (openQrBtn) openQrBtn.addEventListener("click", openModal);
  if (openShareBtn) openShareBtn.addEventListener("click", openModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

  if (qrModal) {
    qrModal.addEventListener("click", (e) => {
      if (e.target === qrModal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && qrModal && qrModal.classList.contains("active")) {
      closeModal();
    }
  });

  // Copy Link in Modal
  if (btnCopyLink) {
    btnCopyLink.addEventListener("click", async () => {
      const success = await copyToClipboard(CARD_URL);
      if (success) {
        if (navigator.vibrate) navigator.vibrate(30);
        showToast("Lien de la carte copié !");
      }
    });
  }

  // Native Web Share API
  if (btnShareNative) {
    btnShareNative.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Cherfaoui Benacer | Founder & CEO — Solvytech",
            text: "Carte de visite virtuelle officielle de Cherfaoui Benacer (Solvytech)",
            url: CARD_URL
          });
        } catch (err) {
          if (err.name !== "AbortError") {
            console.warn("Share failed:", err);
          }
        }
      } else {
        // Fallback to copy link
        const success = await copyToClipboard(CARD_URL);
        if (success) {
          showToast("Lien de la carte copié !");
        }
      }
    });
  }
});
