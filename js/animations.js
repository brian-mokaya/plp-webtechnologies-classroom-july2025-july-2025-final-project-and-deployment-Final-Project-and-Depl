/* ===== ANIMATIONS JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
    initializeHoverAnimations();
    initializeLoadingAnimations();
    initializeTypingAnimation();
    initializeParticleEffect();
    initializeScrollProgress();
});

/* ===== SCROLL ANIMATIONS ===== */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add visible class for CSS animations
                element.classList.add('visible');
                
                // Trigger specific animations
                if (element.classList.contains('counter')) {
                    animateCounter(element);
                }
                
                if (element.classList.contains('progress-bar')) {
                    animateProgressBar(element);
                }
                
                if (element.classList.contains('stagger-item')) {
                    animateStaggerItem(element);
                }
                
                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, ' +
        '.fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, ' +
        '.stagger-item, .counter, .progress-bar, .rotate-in, .zoom-in'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/* ===== COUNTER ANIMATIONS ===== */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/* ===== PROGRESS BAR ANIMATIONS ===== */
function animateProgressBar(element) {
    const width = element.getAttribute('data-width') || '100%';
    element.style.setProperty('--progress-width', width);
    element.classList.add('animate');
}

/* ===== STAGGER ANIMATIONS ===== */
function animateStaggerItem(element) {
    const delay = element.getAttribute('data-delay') || '0';
    setTimeout(() => {
        element.classList.add('visible');
    }, parseInt(delay));
}

/* ===== HOVER ANIMATIONS ===== */
function initializeHoverAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.project__card, .service__card, .skill__item');
    
    cards.forEach(card => {
        card.classList.add('hover-lift');
        
        // Add tilt effect on mouse move
        card.addEventListener('mousemove', function(event) {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/* ===== LOADING ANIMATIONS ===== */
function initializeLoadingAnimations() {
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Add loading placeholder
        if (!img.complete) {
            img.classList.add('loading');
        }
    });
    
    // Add skeleton loading for content
    const skeletonElements = document.querySelectorAll('.skeleton');
    
    skeletonElements.forEach(element => {
        element.style.cssText = `
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
        `;
    });
}

/* ===== TYPING ANIMATION ===== */
function initializeTypingAnimation() {
    const typingElements = document.querySelectorAll('.typewriter');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeSpeed = 100; // milliseconds per character
        
        function typeChar() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, typeSpeed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        // Start typing animation when element is visible
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeChar();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

/* ===== PARTICLE EFFECT ===== */
function initializeParticleEffect() {
    const particleContainer = document.querySelector('.particle-container');
    
    if (!particleContainer) return;
    
    const particleCount = 50;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.6;
            pointer-events: none;
        `;
        
        particleContainer.appendChild(particle);
        particles.push({
            element: particle,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
    
    // Animate particles
    function animateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > window.innerWidth) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > window.innerHeight) {
                particle.vy *= -1;
            }
            
            // Update position
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

/* ===== SCROLL PROGRESS ===== */
function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    }
    
    window.addEventListener('scroll', PortfolioUtils.throttle(updateScrollProgress, 10));
}

/* ===== MORPHING ANIMATIONS ===== */
function initializeMorphingAnimations() {
    const morphElements = document.querySelectorAll('.morph');
    
    morphElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.borderRadius = '50%';
            this.style.transform = 'scale(1.1)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.borderRadius = '';
            this.style.transform = 'scale(1)';
        });
    });
}

/* ===== TEXT REVEAL ANIMATIONS ===== */
function initializeTextReveal() {
    const textRevealElements = document.querySelectorAll('.text-reveal');
    
    textRevealElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        // Split text into spans
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                transform: translateY(100%);
                transition: transform 0.6s ease;
                transition-delay: ${index * 0.05}s;
            `;
            element.appendChild(span);
        });
        
        // Reveal text when element is visible
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

/* ===== PARALLAX SCROLLING ===== */
function initializeParallaxScrolling() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    window.addEventListener('scroll', PortfolioUtils.throttle(updateParallax, 10));
}

/* ===== FLOATING ANIMATIONS ===== */
function initializeFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.float');
    
    floatingElements.forEach((element, index) => {
        const delay = index * 0.5; // Stagger the animations
        element.style.animationDelay = `${delay}s`;
        element.classList.add('float');
    });
}

/* ===== GLOW ANIMATIONS ===== */
function initializeGlowAnimations() {
    const glowElements = document.querySelectorAll('.glow');
    
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('glow');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('glow');
        });
    });
}

/* ===== ANIMATION UTILITIES ===== */
function addAnimationCSS() {
    const animationCSS = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes skeleton-loading {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
            from { box-shadow: 0 0 5px var(--primary-color); }
            to { box-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--primary-color); }
        }
        
        .loaded {
            opacity: 1;
            transform: scale(1);
        }
        
        .loading {
            opacity: 0.7;
            transform: scale(0.95);
        }
        
        .particle-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = animationCSS;
    document.head.appendChild(style);
}

// Initialize all animation features
document.addEventListener('DOMContentLoaded', function() {
    initializeMorphingAnimations();
    initializeTextReveal();
    initializeParallaxScrolling();
    initializeFloatingAnimations();
    initializeGlowAnimations();
    addAnimationCSS();
});

// Export animation functions
window.AnimationUtils = {
    animateCounter,
    animateProgressBar,
    createRippleEffect,
    initializeScrollAnimations,
    initializeHoverAnimations
};
