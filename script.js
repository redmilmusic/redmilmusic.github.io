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
    }

    // Lògica del Preloader
    function runPreloader() {
        const preloader = document.getElementById('preloader');
        const textElement = document.getElementById('preloader-text');
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
                    // La reproducció automàtica ha estat bloquejada pel navegador.
                    console.warn("La reproducció automàtica de la música ha estat bloquejada pel navegador.");
                    // Canviem la icona per indicar que està silenciat
                    const musicBtn = document.getElementById('toggle-music-btn');
                    const icon = musicBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-volume-up');
                        icon.classList.add('fa-volume-mute');
                    }
                });
            }
        }
    }

    // Lògica del botó per activar/silenciar la música
    function setupMusicToggle() {
        const musicBtn = document.getElementById('toggle-music-btn');
        const music = document.getElementById('background-music');
        const icon = musicBtn.querySelector('i');

        if (!musicBtn || !music || !icon) return;

        music.muted = false; 

        musicBtn.addEventListener('click', () => {
            if (music.paused) { 
                music.play();
                music.muted = false;
            } else if (music.muted) { // Si està silenciat
                music.muted = false;
            } else { // Si està sonant
                music.muted = true;
            }
        });

        // Actualitza la icona segons l'estat de la música
        music.addEventListener('volumechange', () => {
            if (music.muted || music.volume === 0) {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
                musicBtn.title = "Activar Música";
            } else {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
                musicBtn.title = "Silenciar Música";
            }
        });

        // Cas inicial si la música ha estat bloquejada
         if (music.paused) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
            musicBtn.title = "Activar Música";
        }
    }

    // Lògica de Navegació Mòbil
    function setupMobileNav() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
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
    
    // Lògica d'Animacions en fer Scroll
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animType = entry.target.getAttribute('data-anim') || 'fade-in-up';
                    entry.target.classList.add(animType);
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // Lògica de la Capçalera Reactiva
    function initReactiveHeader() {
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Lògica del Cursor Personalitzat
    function initCustomCursor() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
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
        const closeButton = document.getElementById('close-popup');
        const ctaButton = document.getElementById('popup-cta-button');

        setTimeout(() => {
            popup.classList.add('visible');
        }, 12000);

        const closePopup = () => {
            popup.classList.remove('visible');
        };

        closeButton.addEventListener('click', closePopup);
        if(ctaButton) ctaButton.addEventListener('click', closePopup);
    }

    // Iniciar tot
    init();
});