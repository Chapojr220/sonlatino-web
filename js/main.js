"use strict";

/* =========================================================
   SON LATINO
   Interactions et animations principales
========================================================= */

/* =========================================================
   1. RÉCUPÉRATION DES ÉLÉMENTS HTML
========================================================= */

const header = document.querySelector(".header");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#nav-links");
const navigationLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const currentYear = document.querySelector("#current-year");
const contactForm = document.querySelector(".contact-form");
const floatingWhatsApp = document.querySelector(".floating-whatsapp");
const scrollIndicator = document.querySelector(".scroll-indicator");
const heroBackground = document.querySelector(".hero-background");

/* =========================================================
   2. PRÉFÉRENCES D’ACCESSIBILITÉ
========================================================= */

/*
  Certains utilisateurs préfèrent réduire les animations.

  Dans ce cas, nous désactivons les mouvements importants.
*/
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* =========================================================
   3. ANNÉE AUTOMATIQUE DANS LE FOOTER
========================================================= */

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* =========================================================
   4. MENU MOBILE
========================================================= */

/*
  Ouvre ou ferme le menu mobile.
*/
function toggleMobileMenu() {
  if (!menuButton || !navigation) {
    return;
  }

  const isOpen = navigation.classList.toggle("active");

  menuButton.setAttribute("aria-expanded", String(isOpen));

  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu",
  );

  /*
    Empêche la page située derrière le menu de défiler.
  */
  document.body.style.overflow = isOpen ? "hidden" : "";
}

/*
  Ferme proprement le menu mobile.
*/
function closeMobileMenu() {
  if (!menuButton || !navigation) {
    return;
  }

  navigation.classList.remove("active");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Ouvrir le menu");

  document.body.style.overflow = "";
}

if (menuButton) {
  menuButton.addEventListener("click", toggleMobileMenu);
}

/*
  Ferme le menu après avoir cliqué sur un lien.
*/
navigationLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

/*
  Ferme le menu lorsque l’utilisateur appuie sur Échap.
*/
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

/*
  Ferme le menu si l’écran repasse en version ordinateur.
*/
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeMobileMenu();
  }
});

/* =========================================================
   5. NAVBAR AU SCROLL
========================================================= */

/*
  Rend la navbar légèrement plus compacte et plus opaque
  lorsque l’utilisateur commence à descendre dans la page.
*/
function updateHeaderOnScroll() {
  if (!header) {
    return;
  }

  const hasScrolled = window.scrollY > 40;

  header.style.backgroundColor = hasScrolled
    ? "rgba(36, 0, 70, 0.96)"
    : "rgba(36, 0, 70, 0.84)";

  header.style.boxShadow = hasScrolled
    ? "0 12px 35px rgba(22, 16, 23, 0.24)"
    : "0 10px 30px rgba(22, 16, 23, 0.12)";
}

window.addEventListener("scroll", updateHeaderOnScroll, {
  passive: true,
});

updateHeaderOnScroll();

/* =========================================================
   6. LIEN ACTIF DANS LA NAVBAR
========================================================= */

/*
  Repère la section actuellement visible.

  Le lien correspondant reçoit la classe "active".
*/
const sectionObserverOptions = {
  root: null,
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const sectionId = entry.target.id;

    navigationLinks.forEach((link) => {
      const linkTarget = link.getAttribute("href");

      link.classList.toggle("active", linkTarget === `#${sectionId}`);
    });
  });
}, sectionObserverOptions);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* =========================================================
   7. ANIMATIONS D’APPARITION AU SCROLL
========================================================= */

/*
  Liste des éléments qui vont apparaître progressivement.

  Nous appliquons les animations directement avec JavaScript,
  sans modifier immédiatement le fichier CSS.
*/
const revealGroups = [
  {
    selector: ".section-heading",
    direction: "up",
  },
  {
    selector: ".about-image-wrapper",
    direction: "left",
  },
  {
    selector: ".about-content",
    direction: "right",
  },
  {
    selector: ".service-card",
    direction: "up",
    stagger: 110,
  },
  {
    selector: ".gallery-item",
    direction: "up",
    stagger: 80,
  },
  {
    selector: ".event-card",
    direction: "left",
    stagger: 120,
  },
  {
    selector: ".contact-content",
    direction: "left",
  },
  {
    selector: ".contact-form",
    direction: "right",
  },
  {
    selector: ".footer-container > *",
    direction: "up",
    stagger: 100,
  },
];

/*
  Retourne le déplacement initial selon la direction choisie.
*/
function getInitialTransform(direction) {
  const distance = 55;

  switch (direction) {
    case "left":
      return `translateX(-${distance}px)`;

    case "right":
      return `translateX(${distance}px)`;

    case "down":
      return `translateY(-${distance}px)`;

    case "up":
    default:
      return `translateY(${distance}px)`;
  }
}

/*
  Prépare un élément avant son entrée dans l’écran.
*/
function prepareRevealElement(element, direction) {
  element.dataset.revealDirection = direction;

  element.style.opacity = "0";
  element.style.transform = getInitialTransform(direction);
  element.style.willChange = "opacity, transform";
}

/*
  Anime l’apparition d’un élément.
*/
function revealElement(element, delay = 0) {
  const animation = element.animate(
    [
      {
        opacity: 0,
        transform: getInitialTransform(element.dataset.revealDirection),
      },
      {
        opacity: 1,
        transform: "translate3d(0, 0, 0)",
      },
    ],
    {
      duration: 850,
      delay,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards",
    },
  );

  animation.addEventListener(
    "finish",
    () => {
      element.style.opacity = "1";
      element.style.transform = "";
      element.style.willChange = "";
    },
    { once: true },
  );
}

if (!prefersReducedMotion) {
  revealGroups.forEach((group) => {
    const elements = document.querySelectorAll(group.selector);

    elements.forEach((element, index) => {
      prepareRevealElement(element, group.direction);

      /*
        Enregistre le délai calculé pour les groupes de cartes.
      */
      element.dataset.revealDelay = String(
        group.stagger ? index * group.stagger : 0,
      );
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const delay = Number(entry.target.dataset.revealDelay || 0);

        revealElement(entry.target, delay);

        /*
          L’élément n’est animé qu’une seule fois.
        */
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.16,
      rootMargin: "0px 0px -70px 0px",
    },
  );

  revealGroups.forEach((group) => {
    document.querySelectorAll(group.selector).forEach((element) => {
      revealObserver.observe(element);
    });
  });
}

/* =========================================================
   8. ANIMATION DU HERO AU CHARGEMENT
========================================================= */

const heroElements = [
  document.querySelector(".hero .section-label"),
  document.querySelector(".hero h1"),
  document.querySelector(".hero-description"),
  document.querySelector(".hero-buttons"),
  document.querySelector(".hero-features"),
].filter(Boolean);

/*
  Anime progressivement le contenu principal lorsque le site
  est complètement chargé.
*/
function animateHero() {
  if (prefersReducedMotion) {
    return;
  }

  heroElements.forEach((element, index) => {
    element.animate(
      [
        {
          opacity: 0,
          transform: "translateY(35px)",
        },
        {
          opacity: 1,
          transform: "translateY(0)",
        },
      ],
      {
        duration: 900,
        delay: 180 + index * 140,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      },
    );
  });

  /*
    Léger zoom cinématographique de l’image principale.
  */
  if (heroBackground) {
    heroBackground.animate(
      [
        {
          transform: "scale(1.08)",
        },
        {
          transform: "scale(1)",
        },
      ],
      {
        duration: 2200,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    );
  }
}

window.addEventListener("load", animateHero);

/* =========================================================
   9. LÉGER EFFET PARALLAXE SUR LE HERO
========================================================= */

let parallaxFrame = null;

/*
  L’image du Hero bouge très légèrement pendant le scroll.

  Le mouvement reste volontairement discret pour conserver
  une bonne lisibilité.
*/
function updateHeroParallax() {
  if (prefersReducedMotion || !heroBackground || window.innerWidth <= 620) {
    return;
  }

  const scrollPosition = window.scrollY;
  const heroHeight = document.querySelector(".hero")?.offsetHeight || 0;

  if (scrollPosition > heroHeight) {
    return;
  }

  const movement = scrollPosition * 0.12;

  heroBackground.style.transform = `translate3d(0, ${movement}px, 0) scale(1.03)`;
}

window.addEventListener(
  "scroll",
  () => {
    if (parallaxFrame) {
      cancelAnimationFrame(parallaxFrame);
    }

    parallaxFrame = requestAnimationFrame(updateHeroParallax);
  },
  {
    passive: true,
  },
);

/* =========================================================
   10. ANIMATION DE L’INDICATEUR DE SCROLL
========================================================= */

if (scrollIndicator && !prefersReducedMotion) {
  scrollIndicator.animate(
    [
      {
        transform: "translateY(0)",
      },
      {
        transform: "translateY(10px)",
      },
      {
        transform: "translateY(0)",
      },
    ],
    {
      duration: 1700,
      iterations: Infinity,
      easing: "ease-in-out",
    },
  );
}

/* =========================================================
   11. ANIMATION DU BOUTON WHATSAPP
========================================================= */

if (floatingWhatsApp && !prefersReducedMotion) {
  /*
    Le bouton attire discrètement l’attention toutes les
    quelques secondes sans devenir agressif.
  */
  window.setInterval(() => {
    floatingWhatsApp.animate(
      [
        {
          transform: "scale(1) rotate(0deg)",
        },
        {
          transform: "scale(1.1) rotate(-7deg)",
        },
        {
          transform: "scale(1.06) rotate(7deg)",
        },
        {
          transform: "scale(1) rotate(0deg)",
        },
      ],
      {
        duration: 650,
        easing: "ease-in-out",
      },
    );
  }, 6000);
}

/* =========================================================
   12. EFFET SUR LES CARTES DE PRESTATIONS
========================================================= */

const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card) => {
  /*
    Effet de profondeur suivant légèrement la souris.
  */
  card.addEventListener("mousemove", (event) => {
    if (prefersReducedMotion || window.innerWidth <= 860) {
      return;
    }

    const cardPosition = card.getBoundingClientRect();

    const mouseX = event.clientX - cardPosition.left;

    const mouseY = event.clientY - cardPosition.top;

    const rotateY = (mouseX / cardPosition.width - 0.5) * 8;

    const rotateX = (mouseY / cardPosition.height - 0.5) * -8;

    card.style.transform = `perspective(900px)
       rotateX(${rotateX}deg)
       rotateY(${rotateY}deg)
       translateY(-8px)`;
  });

  /*
    Replace la carte dans sa position normale.
  */
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* =========================================================
   13. GALERIE : LÉGER EFFET LUMINEUX
========================================================= */

const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const position = item.getBoundingClientRect();

    const x = ((event.clientX - position.left) / position.width) * 100;

    const y = ((event.clientY - position.top) / position.height) * 100;

    item.style.setProperty("--mouse-x", `${x}%`);
    item.style.setProperty("--mouse-y", `${y}%`);
  });
});

/* =========================================================
   14. FORMULAIRE DE CONTACT TEMPORAIRE
========================================================= */

/*
  Le formulaire n’est pas encore connecté à une base de
  données ou à un service d’envoi d’e-mails.

  Nous empêchons donc un faux envoi.
*/
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(".form-submit");

    if (!submitButton) {
      return;
    }

    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Formulaire bientôt disponible";

    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }, 2500);
  });
}

/* =========================================================
   15. SUPPRESSION DU # DANS L’URL APRÈS NAVIGATION
========================================================= */

/*
  Le scroll vers les sections fonctionne normalement,
  mais nous nettoyons ensuite l’URL pour garder un résultat
  visuellement propre.
*/
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", () => {
    window.setTimeout(() => {
      history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }, 700);
  });
});
