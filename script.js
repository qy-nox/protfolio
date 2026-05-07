document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // LOADER
    // ============================================
    const loader = document.querySelector('.loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1800);
    });

    // ============================================
    // CUSTOM CURSOR SYSTEM
    // ============================================
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouchDevice) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        const auraCursor = document.querySelector('.aura-cursor');

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let auraX = 0, auraY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            auraX += (mouseX - auraX) * 0.08;
            auraY += (mouseY - auraY) * 0.08;

            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            auraCursor.style.left = auraX + 'px';
            auraCursor.style.top = auraY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover states
        const hoverables = document.querySelectorAll('a, button, input, textarea, .project-card, .hobby-card, .now-card, .magnetic');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hovering');
                auraCursor.style.width = '450px';
                auraCursor.style.height = '450px';
                auraCursor.style.opacity = '0.2';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hovering');
                auraCursor.style.width = '350px';
                auraCursor.style.height = '350px';
                auraCursor.style.opacity = '0.12';
            });
        });
    }

    // ============================================
    // MAGNETIC BUTTONS
    // ============================================
    if (!isTouchDevice) {
        const magnetics = document.querySelectorAll('.magnetic');
        magnetics.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ============================================
    // CANVAS FLOW FIELD (Motion Graphics)
    // ============================================
    const canvas = document.getElementById('flow-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let canvasVisible = true;

        function resizeCanvas() {
            const section = canvas.parentElement;
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function noise(x, y, t) {
            return Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.5) * 
                   Math.sin((x + y) * 0.005 + t * 0.3);
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = 0;
                this.vy = 0;
                this.life = Math.random() * 200 + 100;
                this.maxLife = this.life;
                this.size = Math.random() * 2 + 0.5;
                this.hue = Math.random() * 40 + 15;
            }
            update(time) {
                const angle = noise(this.x, this.y, time * 0.0003) * Math.PI * 4;
                this.vx += Math.cos(angle) * 0.08;
                this.vy += Math.sin(angle) * 0.08;
                this.vx *= 0.98;
                this.vy *= 0.98;
                this.x += this.vx;
                this.y += this.vy;
                this.life--;

                if (this.life <= 0 || this.x < 0 || this.x > canvas.width || 
                    this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                const alpha = (this.life / this.maxLife) * 0.4;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 60%, 60%, ${alpha})`;
                ctx.fill();
            }
        }

        const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let time = 0;
        function animateFlow() {
            if (!canvasVisible) {
                animationId = requestAnimationFrame(animateFlow);
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time++;

            particles.forEach(p => {
                p.update(time);
                p.draw();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        const alpha = (1 - dist / 80) * 0.08;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `hsla(25, 50%, 55%, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animateFlow);
        }
        animateFlow();

        const canvasObserver = new IntersectionObserver((entries) => {
            canvasVisible = entries[0].isIntersecting;
        }, { threshold: 0 });
        canvasObserver.observe(canvas);
    }

    // ============================================
    // HERO KEN BURNS SLIDESHOW
    // ============================================
    const heroSlides = document.querySelectorAll('.hero-slideshow .slide');
    let currentHeroSlide = 0;

    function nextHeroSlide() {
        heroSlides[currentHeroSlide].classList.remove('active');
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        heroSlides[currentHeroSlide].classList.add('active');
    }
    setInterval(nextHeroSlide, 6000);

    // ============================================
    // TYPING EFFECT FOR HERO SUBTITLE
    // ============================================
    const typingEl = document.getElementById('typing-text');
    if (typingEl) {
        const fullText = typingEl.textContent;
        typingEl.textContent = '';
        let charIndex = 0;

        function typeChar() {
            if (charIndex < fullText.length) {
                typingEl.textContent += fullText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 50 + Math.random() * 30);
            }
        }

        // Start typing after loader fades
        setTimeout(typeChar, 2200);
    }

    // ============================================
    // VISUAL DIARY SLIDESHOW
    // ============================================
    const diarySlides = document.querySelectorAll('.diary-slide');
    const diaryBar = document.querySelector('.diary-bar');
    const diaryPrev = document.querySelector('.diary-prev');
    const diaryNext = document.querySelector('.diary-next');
    let currentDiarySlide = 0;
    let diaryInterval;

    function showDiarySlide(index) {
        diarySlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        if (diaryBar) {
            diaryBar.style.width = ((index + 1) / diarySlides.length * 100) + '%';
        }
        currentDiarySlide = index;
    }

    function nextDiarySlide() {
        showDiarySlide((currentDiarySlide + 1) % diarySlides.length);
    }

    function prevDiarySlide() {
        showDiarySlide((currentDiarySlide - 1 + diarySlides.length) % diarySlides.length);
    }

    function startDiaryAutoplay() {
        diaryInterval = setInterval(nextDiarySlide, 5000);
    }

    if (diaryPrev && diaryNext) {
        diaryPrev.addEventListener('click', () => {
            clearInterval(diaryInterval);
            prevDiarySlide();
            startDiaryAutoplay();
        });
        diaryNext.addEventListener('click', () => {
            clearInterval(diaryInterval);
            nextDiarySlide();
            startDiaryAutoplay();
        });
        startDiaryAutoplay();
    }

    // ============================================
    // TEXT SCRAMBLE EFFECT
    // ============================================
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.originalText = el.textContent;
        }
        scramble() {
            const length = this.originalText.length;
            let iteration = 0;
            const maxIterations = length * 3;

            const interval = setInterval(() => {
                this.el.textContent = this.originalText
                    .split('')
                    .map((char, index) => {
                        if (char === ' ') return ' ';
                        if (index < iteration / 3) {
                            return this.originalText[index];
                        }
                        return this.chars[Math.floor(Math.random() * this.chars.length)];
                    })
                    .join('');

                iteration++;
                if (iteration >= maxIterations) {
                    clearInterval(interval);
                    this.el.textContent = this.originalText;
                }
            }, 30);
        }
    }

    const scrambleElements = document.querySelectorAll('[data-scramble]');
    const scrambleInstances = new Map();

    scrambleElements.forEach(el => {
        scrambleInstances.set(el, new TextScramble(el));
    });

    const scrambleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const instance = scrambleInstances.get(entry.target);
                if (instance) {
                    setTimeout(() => instance.scramble(), 200);
                }
                scrambleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    scrambleElements.forEach(el => scrambleObserver.observe(el));

    // ============================================
    // 3D TILT EFFECT
    // ============================================
    if (!isTouchDevice) {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -8;
                const rotateY = (x - centerX) / centerX * 8;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

                const glow = el.querySelector('.now-glow');
                if (glow) {
                    const percentX = (x / rect.width) * 100;
                    const percentY = (y / rect.height) * 100;
                    glow.style.setProperty('--mouse-x', percentX + '%');
                    glow.style.setProperty('--mouse-y', percentY + '%');
                }
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // ============================================
    // SCROLL REVEAL
    // ============================================
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const start = performance.now();

                function updateCounter(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }
                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    // ============================================
    // SCROLL VELOCITY SKEW
    // ============================================
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let skewTarget = 0;
    let skewCurrent = 0;
    const mainEl = document.querySelector('main');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        scrollVelocity = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;
        skewTarget = Math.max(-2, Math.min(2, scrollVelocity * 0.05));
    }, { passive: true });

    function updateSkew() {
        skewCurrent += (skewTarget - skewCurrent) * 0.1;
        skewTarget *= 0.95;
        if (mainEl && Math.abs(skewCurrent) > 0.01) {
            mainEl.style.transform = `skewY(${skewCurrent}deg)`;
        } else if (mainEl) {
            mainEl.style.transform = 'skewY(0deg)';
        }
        requestAnimationFrame(updateSkew);
    }
    updateSkew();

    // ============================================
    // NAVBAR SCROLL
    // ============================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ============================================
    // THEME MANAGEMENT
    // ============================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function setTheme(mode) {
        if (mode === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            if (moonIcon) moonIcon.classList.add('hidden');
            if (sunIcon) sunIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#141312');
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            if (moonIcon) moonIcon.classList.remove('hidden');
            if (sunIcon) sunIcon.classList.add('hidden');
            localStorage.setItem('theme', 'light');
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#F7F3EE');
        }
    }

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        setTheme('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-mode');
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // ============================================
    // AUDIO PLAYER
    // ============================================
    const audioToggleBtn = document.getElementById('audio-toggle');
    const audioEl = document.getElementById('ambient-audio');
    let isPlaying = false;

    if (audioToggleBtn && audioEl) {
        audioEl.volume = 0;

        audioToggleBtn.addEventListener('click', () => {
            if (isPlaying) {
                let vol = audioEl.volume;
                const fadeOut = setInterval(() => {
                    if (vol > 0.05) {
                        vol -= 0.05;
                        audioEl.volume = vol;
                    } else {
                        clearInterval(fadeOut);
                        audioEl.pause();
                        audioEl.volume = 0;
                        audioToggleBtn.classList.remove('playing');
                    }
                }, 80);
            } else {
                audioEl.play();
                let vol = 0;
                audioToggleBtn.classList.add('playing');
                const fadeIn = setInterval(() => {
                    if (vol < 0.4) {
                        vol += 0.05;
                        audioEl.volume = vol;
                    } else {
                        clearInterval(fadeIn);
                    }
                }, 80);
            }
            isPlaying = !isPlaying;
        });
    }

    // ============================================
    // FORM GLOW EFFECT
    // ============================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm && !isTouchDevice) {
        contactForm.addEventListener('mousemove', (e) => {
            const rect = contactForm.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            contactForm.style.setProperty('--form-x', x + '%');
            contactForm.style.setProperty('--form-y', y + '%');
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // PARALLAX ORBS
    // ============================================
    const orbs = document.querySelectorAll('.orb');
    const aestheticFrame = document.querySelector('.aesthetic-frame');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.12;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
        if (aestheticFrame) {
            const rect = aestheticFrame.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                aestheticFrame.style.transform = `translateY(${(window.innerHeight - rect.top) * -0.04}px)`;
            }
        }
    }, { passive: true });

    // ============================================
    // YEAR UPDATE
    // ============================================
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ============================================
    // MATRIX RAIN CANVAS (Cyber Security Effect)
    // ============================================
    const matrixCanvas = document.getElementById('matrix-canvas');
    if (matrixCanvas) {
        const mCtx = matrixCanvas.getContext('2d');
        let matrixVisible = false;
        let matrixAnimId;

        function resizeMatrix() {
            const section = matrixCanvas.parentElement;
            matrixCanvas.width = section.offsetWidth;
            matrixCanvas.height = section.offsetHeight;
        }
        resizeMatrix();
        window.addEventListener('resize', resizeMatrix);

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        let columns = 0;
        let drops = [];

        function initMatrix() {
            columns = Math.floor(matrixCanvas.width / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100;
            }
        }
        initMatrix();
        window.addEventListener('resize', initMatrix);

        function drawMatrix() {
            if (!matrixVisible) {
                matrixAnimId = requestAnimationFrame(drawMatrix);
                return;
            }

            mCtx.fillStyle = 'rgba(247, 243, 238, 0.05)';
            mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            mCtx.fillStyle = '#C75B39';
            mCtx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                mCtx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            matrixAnimId = requestAnimationFrame(drawMatrix);
        }
        drawMatrix();

        const matrixObserver = new IntersectionObserver((entries) => {
            matrixVisible = entries[0].isIntersecting;
        }, { threshold: 0 });
        matrixObserver.observe(matrixCanvas);
    }

    // ============================================
    // TERMINAL TYPING EFFECT
    // ============================================
    const terminalText = document.getElementById('terminal-text');
    const terminalOutput = document.getElementById('terminal-output');

    if (terminalText && terminalOutput) {
        const commands = [
            { cmd: 'whoami', out: 'mahfujur — aspiring cyber security engineer' },
            { cmd: 'cat skills.txt', out: 'Python | Java | MS Office | Data Entry | Research' },
            { cmd: 'ls ~/goals/', out: 'cyber-security-engineer.txt  learn-everyday.txt' },
            { cmd: 'echo $PASSION', out: 'exploring, researching, and securing the digital world' },
            { cmd: 'status --now', out: 'Studying Diploma in Computer Science & Technology (2024-2028)' }
        ];

        let cmdIndex = 0;
        let charIndex = 0;
        let isTyping = true;
        let pauseTimer = null;

        function typeTerminal() {
            const current = commands[cmdIndex];

            if (isTyping) {
                if (charIndex < current.cmd.length) {
                    terminalText.textContent += current.cmd.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeTerminal, 60 + Math.random() * 40);
                } else {
                    isTyping = false;
                    pauseTimer = setTimeout(() => {
                        terminalOutput.textContent = current.out;
                        terminalOutput.style.opacity = '0';
                        terminalOutput.style.transition = 'opacity 0.5s';
                        requestAnimationFrame(() => {
                            terminalOutput.style.opacity = '1';
                        });
                        pauseTimer = setTimeout(() => {
                            terminalText.textContent = '';
                            terminalOutput.textContent = '';
                            charIndex = 0;
                            isTyping = true;
                            cmdIndex = (cmdIndex + 1) % commands.length;
                            typeTerminal();
                        }, 3000);
                    }, 400);
                }
            }
        }

        // Start terminal when visible
        const termObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(typeTerminal, 800);
                termObserver.disconnect();
            }
        }, { threshold: 0.3 });
        termObserver.observe(terminalText.closest('.terminal-window'));
    }

    // ============================================
    // DROPDOWN KEYBOARD ACCESSIBILITY
    // ============================================
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    if (dropdownToggle) {
        dropdownToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dropdown.classList.toggle('open');
            }
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    }
});
