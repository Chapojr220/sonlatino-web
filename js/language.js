"use strict";

/* ==========================================================
   SON LATINO
   ----------------------------------------------------------
   Gestion complète des langues avec i18next.

   Ce fichier :
   - charge fr.json et es.json ;
   - détecte et mémorise la langue choisie ;
   - traduit les textes visibles ;
   - traduit les attributs alt, aria-label et data-tooltip ;
   - traduit le titre de la page et la meta description ;
   - met à jour le bouton actif FR / ES ;
   - met à jour l’attribut lang de la balise <html>.
========================================================== */

/* ==========================================================
   Références des boutons de langue
========================================================== */

const frenchButton = document.querySelector('[data-language="fr"]');
const spanishButton = document.querySelector('[data-language="es"]');

/* ==========================================================
   Normalise la langue détectée

   Exemple :
   - "fr-FR" devient "fr"
   - "es-ES" devient "es"
========================================================== */

function normalizeLanguage(language) {
  return language?.toLowerCase().startsWith("es") ? "es" : "fr";
}

/* ==========================================================
   Traduit les textes visibles
========================================================== */

function translateTextContent() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    if (key && i18next.exists(key)) {
      element.textContent = i18next.t(key);
    }
  });
}

/* ==========================================================
   Traduit les attributs alt des images
========================================================== */

function translateAltAttributes() {
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const key = element.dataset.i18nAlt;

    if (key && i18next.exists(key)) {
      element.setAttribute("alt", i18next.t(key));
    }
  });
}

/* ==========================================================
   Traduit les attributs aria-label
========================================================== */

function translateAriaLabels() {
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;

    if (key && i18next.exists(key)) {
      element.setAttribute("aria-label", i18next.t(key));
    }
  });
}

/* ==========================================================
   Traduit les tooltips personnalisés
========================================================== */

function translateTooltips() {
  document.querySelectorAll("[data-i18n-tooltip]").forEach((element) => {
    const key = element.dataset.i18nTooltip;

    if (key && i18next.exists(key)) {
      element.dataset.tooltip = i18next.t(key);
    }
  });
}

/* ==========================================================
   Traduit le titre de la page
========================================================== */

function translatePageTitle() {
  const titleElement = document.querySelector("[data-i18n-title]");

  if (!titleElement) {
    return;
  }

  const key = titleElement.dataset.i18nTitle;

  if (key && i18next.exists(key)) {
    document.title = i18next.t(key);
  }
}

/* ==========================================================
   Traduit la meta description
========================================================== */

function translateMetaDescription() {
  const metaDescription = document.querySelector(
    'meta[name="description"][data-i18n-content]',
  );

  if (!metaDescription) {
    return;
  }

  const key = metaDescription.dataset.i18nContent;

  if (key && i18next.exists(key)) {
    metaDescription.setAttribute("content", i18next.t(key));
  }
}

/* ==========================================================
   Met à jour le bouton actif FR / ES
========================================================== */

function updateActiveButton(language) {
  if (!frenchButton || !spanishButton) {
    return;
  }

  frenchButton.classList.toggle("active", language === "fr");
  spanishButton.classList.toggle("active", language === "es");

  frenchButton.setAttribute("aria-pressed", String(language === "fr"));
  spanishButton.setAttribute("aria-pressed", String(language === "es"));
}

/* ==========================================================
   Met à jour tout le contenu de la page
========================================================== */

function updateContent() {
  const currentLanguage = normalizeLanguage(i18next.resolvedLanguage);

  document.documentElement.lang = currentLanguage;

  translateTextContent();
  translateAltAttributes();
  translateAriaLabels();
  translateTooltips();
  translatePageTitle();
  translateMetaDescription();
  updateActiveButton(currentLanguage);
}

/* ==========================================================
   Change la langue du site
========================================================== */

async function changeLanguage(language) {
  const selectedLanguage = normalizeLanguage(language);

  try {
    await i18next.changeLanguage(selectedLanguage);
    updateContent();
  } catch (error) {
    console.error("Impossible de changer la langue :", error);
  }
}

/* ==========================================================
   Initialise i18next
========================================================== */

async function initializeLanguages() {
  try {
    await i18next
      .use(i18nextHttpBackend)
      .use(i18nextBrowserLanguageDetector)
      .init({
        supportedLngs: ["fr", "es"],

        fallbackLng: "fr",

        load: "languageOnly",

        debug: false,

        detection: {
          order: ["localStorage", "navigator"],

          caches: ["localStorage"],

          lookupLocalStorage: "sonLatinoLanguage",
        },

        backend: {
          loadPath: "languages/{{lng}}.json",
        },

        interpolation: {
          escapeValue: false,
        },
      });

    updateContent();

    if (frenchButton) {
      frenchButton.addEventListener("click", () => {
        changeLanguage("fr");
      });
    }

    if (spanishButton) {
      spanishButton.addEventListener("click", () => {
        changeLanguage("es");
      });
    }
  } catch (error) {
    console.error(
      "Impossible de charger les fichiers de traduction. Vérifie que le site est lancé avec Live Server et que fr.json et es.json se trouvent dans le dossier languages.",
      error,
    );
  }
}

/* ==========================================================
   Démarrage
========================================================== */

initializeLanguages();
