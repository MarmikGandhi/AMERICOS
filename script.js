document.addEventListener("DOMContentLoaded", () => {

    /* 1. STICKY HEADER */

    const header = document.querySelector(".site-header");

    function updateHeader() {
        if (!header) return;

        header.classList.toggle("scrolled", window.scrollY > 30);
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* 2. MOBILE NAVIGATION */

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".destop-nav");

    if (header && menuToggle && navigation) {

        menuToggle.addEventListener("click", () => {

            const isOpen = header.classList.toggle("menu-open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );
        });

        // Close menu after clicking a navigation link
        navigation.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                header.classList.remove("menu-open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open menu");

            });

        });

        // Close menu when clicking outside
        document.addEventListener("click", event => {

            if (
                !header.contains(event.target) &&
                header.classList.contains("menu-open")
            ) {
                header.classList.remove("menu-open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open menu");
            }

        });

        // Close mobile navigation on desktop resize
        window.addEventListener("resize", () => {

            if (window.innerWidth > 760) {

                header.classList.remove("menu-open");

                menuToggle.setAttribute("aria-expanded", "false");
            }

        });
    }


    /* 3. HERO GRADIENT MOUSE INTERACTION */

    const hero = document.querySelector(".hero");

    if (hero && window.matchMedia("(pointer: fine)").matches) {

        let heroFrame;

        hero.addEventListener("pointermove", event => {

            if (heroFrame) {
                cancelAnimationFrame(heroFrame);
            }

            heroFrame = requestAnimationFrame(() => {

                const rect = hero.getBoundingClientRect();

                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;

                hero.style.setProperty("--mouse-x", `${x}%`);
                hero.style.setProperty("--mouse-y", `${y}%`);

            });

        });

        hero.addEventListener("pointerleave", () => {

            hero.style.setProperty("--mouse-x", "50%");
            hero.style.setProperty("--mouse-y", "50%");

        });
    }


    /* 4. SCROLL REVEAL ANIMATIONS */

    const revealElements = document.querySelectorAll(`
        .how-it-works .container,
        .process-icon,
        .our-materials-content,
        .materials-card,
        .watch-it-change-content,
        .change-animation,
        .popular-pigments-content,
        .pigments-card,
        .real-world-use-content,
        .real-world-use-grid article,
        .about-content,
        .stats,
        .contact-content
    `);

    revealElements.forEach(element => {
        element.classList.add("js-reveal");
    });

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });

    }


    /* 5. SINGLE CUP BLUE / RED ANIMATION CSS controls the exact colour timing. JS pauses animation when off-screen. */

    const cup = document.querySelector(".change-animation");

    const cupImages = document.querySelectorAll(
        ".change-animation .change-cup"
    );

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (cup && cupImages.length > 0) {

        if (prefersReducedMotion) {

            // Show only blue cup for reduced-motion users
            const blueCup = cup.querySelector(".cup-blue");

            cupImages.forEach(image => {
                image.style.animation = "none";
            });

            cupImages.forEach(image => {
                image.style.opacity = image === blueCup ? "1" : "0";
            });

        } else if ("IntersectionObserver" in window) {

            // Pause the cup animation when it is off-screen
            const cupObserver = new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        cupImages.forEach(image => {

                            image.style.animationPlayState =
                                entry.isIntersecting ? "running" : "paused";

                        });

                    });

                },
                {
                    threshold: 0.15
                }
            );

            cupObserver.observe(cup);

        }
    }


    /* ACTIVE NAVIGATION — SCROLL SPY No active link in the Hero section */

const heroSection = document.querySelector(".hero");
const navLinks = document.querySelectorAll(".destop-nav a");

const navSections = [
    {
        link: document.querySelector('.destop-nav a[href="#our-materials"]'),
        sections: [
            document.querySelector("#our-materials")
        ]
    },
    {
        link: document.querySelector('.destop-nav a[href="#Popular-pigments"]'),
        sections: [
            document.querySelector("#Popular-pigments")
        ]
    },
    {
        link: document.querySelector('.destop-nav a[href="#Applications"]'),
        sections: [
            document.querySelector("#Applications")
        ]
    },
    {
        link: document.querySelector('.destop-nav a[href="#About"]'),
        sections: [
            document.querySelector("#About")
        ]
    }
].filter(item => item.link && item.sections.some(Boolean));

function updateActiveNav() {
    const headerHeight = header ? header.offsetHeight : 0;

    // No active navbar item while Hero is visible
    if (
        heroSection &&
        heroSection.getBoundingClientRect().bottom > headerHeight + 5
    ) {
        navLinks.forEach(link => link.classList.remove("active"));
        return;
    }

    const scrollPosition = window.scrollY + headerHeight + 120;
    let currentLink = null;

    /* Check the actual start and end of each mapped section. Sections without a navbar item remain unhighlighted. */
    navSections.forEach(({ link, sections }) => {
        sections.forEach(section => {
            if (!section) return;

            const start = section.offsetTop;
            const nextSection = section.nextElementSibling;

            const end = nextSection
                ? nextSection.offsetTop
                : start + section.offsetHeight;

            if (
                scrollPosition >= start &&
                scrollPosition < end
            ) {
                currentLink = link;
            }
        });
    });

    // Update navbar active state
    navLinks.forEach(link => {
        link.classList.toggle("active", link === currentLink);
    });
}

// Update on scroll and page load
window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);
window.addEventListener("resize", updateActiveNav);

updateActiveNav();


    /* 7. SMOOTH INTERNAL NAVIGATION */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            history.replaceState(null, "", targetId);

        });

    });


    /* 8. PIGMENT CARD HOVER EFFECT */

    document.querySelectorAll(".pigments-card").forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.style.zIndex = "2";
        });

        card.addEventListener("mouseleave", () => {
            card.style.zIndex = "1";
        });

    });


    /* 9. ORDER SAMPLE EMAIL ACTION Opens the visitor's email application. */

    document.querySelectorAll(".info button").forEach(button => {

        button.addEventListener("click", () => {

            const card = button.closest(".pigments-card");

            const productName =
                card?.querySelector("p, h3")?.textContent.trim()
                || "Pigment Sample";

            const subject = encodeURIComponent(
                `Sample Request - ${productName}`
            );

            const body = encodeURIComponent(
                `Hello AMERICOS,\n\nI would like to request a sample of ${productName}.\n\nPlease share further details.\n\nThank you.`
            );

            window.location.href =
                `mailto:info@americosind.com?subject=${subject}&body=${body}`;

        });

    });


    /* 10. AUTOMATIC FOOTER YEAR */

    const footerText = document.querySelector(
        ".footer-right span:last-child"
    );

    if (footerText) {
        footerText.textContent =
            `© ${new Date().getFullYear()} AMERICOS`;
    }


    /* 11. PAGE LOAD COMPLETE */

    document.body.classList.add("page-loaded");

    console.log(
        "AMERICOS website initialized successfully."
    );

});