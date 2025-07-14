document.addEventListener('DOMContentLoaded', () => {

    // Funció principal que inicialitza tot
    function init() {
        runPreloader();
        setupMobileNav();
        initScrollAnimations();
        initReactiveHeader();
        initCustomCursor();
        initScrollToTopButton();
        initNewsletterPopup();
        setupMusicToggle();
        initAnalyticsTracking();
    }

    // Funció central per enviar esdeveniments a Google Analytics
    function trackEvent(eventName, params = {}) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        } else {
            console.warn('Google Analytics (gtag.js) no trobat. El tracking està desactivat.');
        }
    }

    // Funció per configurar tots els listeners de tracking
    function initAnalyticsTracking() {
        document.body.addEventListener('click', (event) => {
            const target = event.target.closest('[data-analytics-event]');
            if (!target) return;

            const eventName = target.dataset.analyticsEvent;
            const params = {};

            for (const key in target.dataset) {
                if (key.startsWith('analytics') && key !== 'analyticsEvent') {
                    const paramKey = key.replace('analytics', '').toLowerCase();
                    params[paramKey] = target.dataset[key];
                }
            }
            trackEvent(eventName, params);
        });

        document.querySelectorAll('[data-analytics-event="spotify_embed_interaction"]').forEach(iframe => {
            let tracked = false;
            const trackSpotify = () => {
                if (tracked) return;
                tracked = true;
                trackEvent('spotify_embed_interaction', {
                    embed_type: iframe.dataset.analyticsEmbedType || 'unknown'
                });
            };
            iframe.addEventListener('focus', trackSpotify);
            window.addEventListener('blur', () => {
                if (document.activeElement === iframe) {
                    trackSpotify();
                }
            });
        });
    }

    // Lògica del Preloader
    function runPreloader() {
        const preloader = document.getElementById('preloader');
        const textElement = document.getElementById('preloader-text');
        if (!preloader || !textElement) return;

        const textToType = "redmil, turn that shit on";
        const typingSpeed = 50;
        let charIndex = 0;

        function type() {
            if (charIndex < textToType.length) {
                textElement.innerHTML = textToType.substring(0, charIndex + 1) + '<span class="preloader-cursor">_</span>';
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                textElement.innerHTML = textToType + '<span class="preloader-cursor">_</span>';
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.addEventListener('transitionend', () => {
                        preloader.style.display = 'none';
                        playBackgroundMusic();
                    }, { once: true });
                }, 1000);
            }
        }
        type();
    }
    
    // Lògica per iniciar la música de fons
    function playBackgroundMusic() {
        const music = document.getElementById('background-music');
        if (music) {
            music.volume = 0.1;
            const playPromise = music.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("La reproducció automàtica de la música ha estat bloquejada pel navegador.");
                    const musicBtn = document.getElementById('toggle-music-btn');
                    if (musicBtn) {
                        const icon = musicBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-volume-up');
                            icon.classList.add('fa-volume-mute');
                        }
                        musicBtn.classList.add('is-muted');
                    }
                });
            }
        }
    }

    // Lògica del botó per activar/silenciar la música
    function setupMusicToggle() {
        const musicBtn = document.getElementById('toggle-music-btn');
        const music = document.getElementById('background-music');
        const icon = musicBtn ? musicBtn.querySelector('i') : null;

        if (!musicBtn || !music || !icon) return;

        musicBtn.addEventListener('click', () => {
            const isMuted = music.muted || music.paused;
            if (isMuted) {
                music.play().then(() => {
                    music.muted = false;
                    trackEvent('toggle_music_click', { new_state: 'unmuted' });
                }).catch(e => console.error("Error en reproduir la música", e));
            } else {
                music.muted = true;
                trackEvent('toggle_music_click', { new_state: 'muted' });
            }
        });

        function updateButtonState() {
            if (music.muted || music.paused) {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
                musicBtn.title = "Activar Música";
                musicBtn.classList.add('is-muted');
            } else {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
                musicBtn.title = "Silenciar Música";
                musicBtn.classList.remove('is-muted');
            }
        }

        music.addEventListener('volumechange', updateButtonState);
        music.addEventListener('play', updateButtonState);
        music.addEventListener('pause', updateButtonState);
        updateButtonState();
    }

    // Lògica d'Animacions en fer Scroll
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (sectionId) {
                        trackEvent('view_section', { section_id: `#${sectionId}` });
                    }
                    const animType = entry.target.getAttribute('data-anim') || 'fade-in-up';
                    entry.target.classList.add(animType);
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        // CORRECCIÓ FINAL: El selector només ha d'observar elements amb la classe .reveal
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // Lògica de la Capçalera Reactiva
    function initReactiveHeader() {
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }

    // Lògica del Cursor Personalitzat
    function initCustomCursor() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        if (!cursorDot || !cursorOutline) return;

        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.style.left = `${e.clientX}px`;
            cursorOutline.style.top = `${e.clientY}px`;
        });
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseover', () => cursorOutline.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('grow'));
        });
    }
    
    // Lògica del Botó de Tornar Amunt
    function initScrollToTopButton() {
        const button = document.getElementById('scroll-to-top');
        if (!button) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight / 2) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // LÒGICA POPUP DE NEWSLETTER
    function initNewsletterPopup() {
        const popup = document.getElementById('newsletter-popup');
        if (!popup) return;
        
        const closeButton = popup.querySelector('.close-popup');
        const ctaButton = popup.querySelector('#popup-cta-button');

        setTimeout(() => {
            popup.classList.add('visible');
            trackEvent('view_newsletter_popup');
        }, 12000);

        const closePopup = () => {
            popup.classList.remove('visible');
        };

        if (closeButton) closeButton.addEventListener('click', closePopup);
        if (ctaButton) ctaButton.addEventListener('click', closePopup);
    }
    
    // Lògica de Navegació Mòbil
    function setupMobileNav() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (!hamburger || !navLinks) return;
        
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('toggle');
                }
            });
        });
    }

    // Iniciar tot
    init();
});
