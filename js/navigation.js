/* ===== NAVIGATION JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeHeaderScroll();
    initializeActiveLinks();
    initializeSmoothScrolling();
});

/* ===== NAVIGATION INITIALIZATION ===== */
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Animate menu items
            animateMenuItems();
        });
    }
    
    // Close mobile menu
    if (navClose && navMenu) {
        navClose.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 991) {
                closeMobileMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('show')) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu && navMenu.classList.contains('show')) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function animateMenuItems() {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/* ===== HEADER SCROLL EFFECTS ===== */
function initializeHeaderScroll() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Add CSS for header transitions
    const headerCSS = `
        .header {
            transition: transform 0.3s ease, background-color 0.3s ease;
        }
        
        .header.scrolled {
            background-color: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        [data-theme="dark"] .header.scrolled {
            background-color: rgba(45, 45, 45, 0.98);
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = headerCSS;
    document.head.appendChild(style);
}

/* ===== ACTIVE LINK MANAGEMENT ===== */
function initializeActiveLinks() {
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}` || 
                        link.getAttribute('href') === `${sectionId}.html`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttled scroll listener
    const throttledUpdateActiveLink = PortfolioUtils.throttle(updateActiveLink, 100);
    window.addEventListener('scroll', throttledUpdateActiveLink);
    
    // Initial call
    updateActiveLink();
}

/* ===== SMOOTH SCROLLING ===== */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                event.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

/* ===== BREADCRUMB NAVIGATION ===== */
function initializeBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    
    if (!breadcrumbContainer) return;
    
    const currentPage = document.title;
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment);
    
    let breadcrumbHTML = '<a href="index.html">Home</a>';
    
    pathSegments.forEach((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const segmentName = segment.replace('.html', '').replace('-', ' ');
        const segmentPath = pathSegments.slice(0, index + 1).join('/');
        
        if (isLast) {
            breadcrumbHTML += ` <span class="breadcrumb-separator">></span> <span class="breadcrumb-current">${segmentName}</span>`;
        } else {
            breadcrumbHTML += ` <span class="breadcrumb-separator">></span> <a href="${segmentPath}">${segmentName}</a>`;
        }
    });
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

/* ===== SEARCH FUNCTIONALITY ===== */
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (!searchInput) return;
    
    const searchData = [
        { title: 'Home', url: 'index.html', description: 'Welcome to my portfolio' },
        { title: 'About', url: 'about.html', description: 'Learn about my background and experience' },
        { title: 'Services', url: 'services.html', description: 'Web development services I offer' },
        { title: 'Portfolio', url: 'portfolio.html', description: 'View my recent projects and work' },
        { title: 'Contact', url: 'contact.html', description: 'Get in touch with me' }
    ];
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
        
        showSearchResults(results);
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            hideSearchResults();
        }
    });
}

function showSearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
    } else {
        const resultsHTML = results.map(result => `
            <a href="${result.url}" class="search-result-item">
                <h4>${result.title}</h4>
                <p>${result.description}</p>
            </a>
        `).join('');
        
        searchResults.innerHTML = resultsHTML;
    }
    
    searchResults.style.display = 'block';
}

function hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

/* ===== MOBILE GESTURES ===== */
function initializeMobileGestures() {
    if (!PortfolioUtils.isTouchDevice()) return;
    
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    document.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(event) {
        endX = event.changedTouches[0].clientX;
        endY = event.changedTouches[0].clientY;
        
        handleSwipe();
    });
    
    function handleSwipe() {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - could open menu
                    console.log('Swipe right detected');
                } else {
                    // Swipe left - could close menu
                    closeMobileMenu();
                }
            }
        }
    }
}

/* ===== KEYBOARD NAVIGATION ===== */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Alt + M to toggle mobile menu
        if (event.altKey && event.key === 'm') {
            event.preventDefault();
            const navToggle = document.getElementById('nav-toggle');
            if (navToggle) {
                navToggle.click();
            }
        }
        
        // Alt + T to toggle theme
        if (event.altKey && event.key === 't') {
            event.preventDefault();
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.click();
            }
        }
        
        // Escape to close mobile menu
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

/* ===== NAVIGATION ACCESSIBILITY ===== */
function initializeNavigationAccessibility() {
    const navLinks = document.querySelectorAll('.nav__link');
    const navToggle = document.getElementById('nav-toggle');
    
    // Add ARIA attributes
    if (navToggle) {
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Update ARIA attributes when menu is toggled
    const originalToggle = navToggle?.onclick;
    if (navToggle) {
        navToggle.onclick = function() {
            const isExpanded = document.getElementById('nav-menu').classList.contains('show');
            navToggle.setAttribute('aria-expanded', isExpanded.toString());
            
            if (originalToggle) {
                originalToggle.call(this);
            }
        };
    }
    
    // Add focus management
    navLinks.forEach(link => {
        link.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        link.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });
}

/* ===== NAVIGATION ANALYTICS ===== */
function trackNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const linkText = this.textContent.trim();
            const linkUrl = this.getAttribute('href');
            
            // Track navigation clicks (you can integrate with Google Analytics here)
            console.log(`Navigation clicked: ${linkText} -> ${linkUrl}`);
            
            // Example: gtag('event', 'navigation_click', {
            //     'link_text': linkText,
            //     'link_url': linkUrl
            // });
        });
    });
}

// Initialize all navigation features
document.addEventListener('DOMContentLoaded', function() {
    initializeBreadcrumbs();
    initializeSearch();
    initializeMobileGestures();
    initializeKeyboardNavigation();
    initializeNavigationAccessibility();
    trackNavigation();
});

// Export navigation functions
window.Navigation = {
    closeMobileMenu,
    updateActiveLink: initializeActiveLinks,
    showSearchResults,
    hideSearchResults
};
