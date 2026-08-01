"use strict";

/* ==========================================================
   SON LATINO
   ----------------------------------------------------------
   Gestion des langues avec i18next.

   Ce fichier est responsable de :

   - charger les fichiers JSON
   - changer la langue
   - traduire automatiquement le site
   - gérer le bouton actif (FR / ES)
   - mettre à jour la langue du document HTML
========================================================== */

i18next
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: "fr",

    debug: false,

    backend: {
      loadPath: "languages/{{lng}}.json",
    },
  })
  .then(() => {
    updateContent();

    const frenchButton = document.querySelector('[data-language="fr"]');
    const spanishButton = document.querySelector('[data-language="es"]');

    /* ==========================================
       Vérifie que les boutons existent
    ========================================== */

    if (frenchButton && spanishButton) {
      frenchButton.addEventListener("click", () => {
        changeLanguage("fr");
      });

      spanishButton.addEventListener("click", () => {
        changeLanguage("es");
      });
    }
  });

/* ==========================================================
   Traduit tous les éléments possédant data-i18n
========================================================== */

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    element.textContent = i18next.t(key);
  });

  updateActiveButton();
}

/* ==========================================================
   Change la langue du site
========================================================== */

function changeLanguage(language) {
  i18next.changeLanguage(language).then(() => {
    /* Met à jour la langue du document */

    document.documentElement.lang = language;

    updateContent();
  });
}

/* ==========================================================
   Met à jour le bouton actif
========================================================== */

function updateActiveButton() {
  const frenchButton = document.querySelector('[data-language="fr"]');
  const spanishButton = document.querySelector('[data-language="es"]');

  if (!frenchButton || !spanishButton) {
    return;
  }

  const currentLanguage = i18next.language;

  frenchButton.classList.toggle("active", currentLanguage === "fr");

  spanishButton.classList.toggle("active", currentLanguage === "es");
}
