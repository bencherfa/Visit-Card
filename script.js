/**
 * Solvytech Digital Business Card Controller
 */
document.addEventListener("DOMContentLoaded", () => {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const downloadBtn = document.getElementById("download-button");
  const openShareBtn = document.getElementById("btn-open-share");
  const qrModal = document.getElementById("qr-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const btnCopyLink = document.getElementById("btn-copy-link");
  const btnShareNative = document.getElementById("btn-share-native");

  const CARD_URL = "https://benacer.solvytech.com";
  let toastTimer = null;

  function showToast(msg, duration = 3000) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;

    toast.style.display = "flex";
    void toast.offsetWidth; // Force reflow
    toast.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.style.display = "none";
      }, 300);
    }, duration);
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("Clipboard API failed", err);
      }
    }
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const res = document.execCommand("copy");
      document.body.removeChild(textArea);
      return res;
    } catch (err) {
      return false;
    }
  }

  // vCard download feedback
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      if (navigator.vibrate) navigator.vibrate(50);
      showToast("Fiche contact enregistrée avec succès !");
    });
  }

  // QR Modal
  function openModal() {
    if (!qrModal) return;
    qrModal.style.display = "flex";
    void qrModal.offsetWidth;
    qrModal.classList.add("active");
    qrModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!qrModal) return;
    qrModal.classList.remove("active");
    qrModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      qrModal.style.display = "none";
    }, 250);
  }

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

  if (btnCopyLink) {
    btnCopyLink.addEventListener("click", async () => {
      const ok = await copyToClipboard(CARD_URL);
      if (ok) {
        if (navigator.vibrate) navigator.vibrate(30);
        showToast("Lien de la carte copié !");
      }
    });
  }

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
          if (err.name !== "AbortError") console.warn(err);
        }
      } else {
        const ok = await copyToClipboard(CARD_URL);
        if (ok) showToast("Lien de la carte copié !");
      }
    });
  }
});
