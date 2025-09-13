/* ===== PORTFOLIO JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializePortfolioFilter();
    initializeProjectModal();
    initializeProjectStats();
    initializeProjectSearch();
    initializeProjectSorting();
});

/* ===== PORTFOLIO FILTER ===== */
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter__btn');
    const projectCards = document.querySelectorAll('.project__card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            filterProjects(filter, projectCards);
        });
    });
}

function filterProjects(filter, projectCards) {
    projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Animate visible cards
    setTimeout(() => {
        const visibleCards = Array.from(projectCards).filter(card => 
            card.style.display !== 'none'
        );
        
        visibleCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);
}

/* ===== PROJECT MODAL ===== */
function initializeProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const projectLinks = document.querySelectorAll('[data-project]');
    
    // Project data
    const projectData = {
        ecommerce: {
            title: 'E-commerce Platform',
            description: 'A comprehensive e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, payment processing, inventory management, and admin dashboard.',
            image: 'images/projects/ecommerce.jpg',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Express'],
            features: [
                'User authentication and authorization',
                'Product catalog with search and filtering',
                'Shopping cart and checkout process',
                'Payment integration with Stripe',
                'Admin dashboard for inventory management',
                'Order tracking and history',
                'Responsive design for all devices'
            ],
            liveLink: '#',
            githubLink: '#'
        },
        dashboard: {
            title: 'Analytics Dashboard',
            description: 'Real-time data visualization dashboard with interactive charts and responsive design for business intelligence and analytics.',
            image: 'images/projects/dashboard.jpg',
            technologies: ['Vue.js', 'D3.js', 'Python', 'PostgreSQL', 'Chart.js'],
            features: [
                'Real-time data visualization',
                'Interactive charts and graphs',
                'Customizable dashboard widgets',
                'Data export functionality',
                'User role management',
                'Responsive design',
                'Performance optimization'
            ],
            liveLink: '#',
            githubLink: '#'
        },
        mobile: {
            title: 'Task Management App',
            description: 'Cross-platform mobile application for task management with offline capabilities, team collaboration, and real-time synchronization.',
            image: 'images/projects/mobile-app.jpg',
            technologies: ['React Native', 'Firebase', 'Redux', 'Expo', 'AsyncStorage'],
            features: [
                'Cross-platform mobile app',
                'Offline task management',
                'Team collaboration features',
                'Real-time synchronization',
                'Push notifications',
                'User authentication',
                'Data backup and restore'
            ],
            liveLink: '#',
            githubLink: '#'
        },
        restaurant: {
            title: 'Restaurant Website',
            description: 'Modern, responsive website for a local restaurant with online menu, reservation system, and contact information.',
            image: 'images/projects/restaurant.jpg',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'],
            features: [
                'Responsive design',
                'Online menu display',
                'Reservation system',
                'Contact forms',
                'Image galleries',
                'SEO optimization',
                'Fast loading times'
            ],
            liveLink: '#',
            githubLink: '#'
        },
        social: {
            title: 'Social Media App',
            description: 'Full-featured social media platform with real-time messaging, photo sharing, and user profiles with privacy controls.',
            image: 'images/projects/social-media.jpg',
            technologies: ['React', 'Socket.io', 'Express', 'MongoDB', 'AWS S3'],
            features: [
                'Real-time messaging',
                'Photo and video sharing',
                'User profiles and privacy settings',
                'Friend connections',
                'News feed with algorithms',
                'Push notifications',
                'Content moderation tools'
            ],
            liveLink: '#',
            githubLink: '#'
        },
        portfolio: {
            title: 'Portfolio Website',
            description: 'Creative portfolio website for a graphic designer with smooth animations, project galleries, and contact forms.',
            image: 'images/projects/portfolio.jpg',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Three.js'],
            features: [
                'Smooth animations and transitions',
                'Interactive project galleries',
                'Contact forms with validation',
                'Responsive design',
                'Performance optimization',
                'SEO friendly',
                'Accessibility features'
            ],
            liveLink: '#',
            githubLink: '#'
        }
    };
    
    // Open modal
    projectLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const projectId = this.getAttribute('data-project');
            const project = projectData[projectId];
            
            if (project) {
                openProjectModal(project);
            }
        });
    });
    
    // Close modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    function openProjectModal(project) {
        // Update modal content
        document.getElementById('modal-image').src = project.image;
        document.getElementById('modal-image').alt = project.title;
        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-description').textContent = project.description;
        
        // Update technologies
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = project.technologies.map(tech => 
            `<span class="tech__tag">${tech}</span>`
        ).join('');
        
        // Update features
        const featuresContainer = document.getElementById('modal-features');
        featuresContainer.innerHTML = '<h4>Key Features:</h4><ul>' + 
            project.features.map(feature => `<li>${feature}</li>`).join('') + 
            '</ul>';
        
        // Update links
        document.getElementById('modal-live-link').href = project.liveLink;
        document.getElementById('modal-github-link').href = project.githubLink;
        
        // Show modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Animate modal content
        const modalContent = modal.querySelector('.modal__content');
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modalContent.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 10);
    }
}

/* ===== PROJECT STATS ===== */
function initializeProjectStats() {
    const statNumbers = document.querySelectorAll('.stat__number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateStatNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

/* ===== PROJECT SEARCH ===== */
function initializeProjectSearch() {
    const searchInput = document.querySelector('.portfolio-search');
    
    if (!searchInput) return;
    
    const projectCards = document.querySelectorAll('.project__card');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        projectCards.forEach(card => {
            const title = card.querySelector('.project__title').textContent.toLowerCase();
            const description = card.querySelector('.project__description').textContent.toLowerCase();
            const technologies = Array.from(card.querySelectorAll('.tech__tag'))
                .map(tag => tag.textContent.toLowerCase())
                .join(' ');
            
            const matches = title.includes(query) || 
                          description.includes(query) || 
                          technologies.includes(query);
            
            if (matches || query === '') {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update filter buttons
        const filterButtons = document.querySelectorAll('.filter__btn');
        if (query === '') {
            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-filter') === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        } else {
            filterButtons.forEach(btn => btn.classList.remove('active'));
        }
    });
}

/* ===== PROJECT SORTING ===== */
function initializeProjectSorting() {
    const sortSelect = document.querySelector('.portfolio-sort');
    
    if (!sortSelect) return;
    
    const projectContainer = document.querySelector('.portfolio__grid');
    const projectCards = Array.from(document.querySelectorAll('.project__card'));
    
    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        
        let sortedCards;
        
        switch (sortBy) {
            case 'name-asc':
                sortedCards = projectCards.sort((a, b) => {
                    const nameA = a.querySelector('.project__title').textContent;
                    const nameB = b.querySelector('.project__title').textContent;
                    return nameA.localeCompare(nameB);
                });
                break;
                
            case 'name-desc':
                sortedCards = projectCards.sort((a, b) => {
                    const nameA = a.querySelector('.project__title').textContent;
                    const nameB = b.querySelector('.project__title').textContent;
                    return nameB.localeCompare(nameA);
                });
                break;
                
            case 'date-newest':
                sortedCards = projectCards.sort((a, b) => {
                    const dateA = new Date(a.getAttribute('data-date') || 0);
                    const dateB = new Date(b.getAttribute('data-date') || 0);
                    return dateB - dateA;
                });
                break;
                
            case 'date-oldest':
                sortedCards = projectCards.sort((a, b) => {
                    const dateA = new Date(a.getAttribute('data-date') || 0);
                    const dateB = new Date(b.getAttribute('data-date') || 0);
                    return dateA - dateB;
                });
                break;
                
            default:
                sortedCards = projectCards;
        }
        
        // Reorder cards in DOM
        sortedCards.forEach(card => {
            projectContainer.appendChild(card);
        });
        
        // Animate reordered cards
        sortedCards.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s`;
            }, 10);
        });
    });
}

/* ===== PROJECT LIKES ===== */
function initializeProjectLikes() {
    const likeButtons = document.querySelectorAll('.project__like');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project__card');
            const likeCount = projectCard.querySelector('.project__like-count');
            
            if (this.classList.contains('liked')) {
                // Unlike
                this.classList.remove('liked');
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
            } else {
                // Like
                this.classList.add('liked');
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
                
                // Add heart animation
                createHeartAnimation(this);
            }
        });
    });
}

function createHeartAnimation(element) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: absolute;
        font-size: 20px;
        pointer-events: none;
        animation: heartFloat 1s ease-out forwards;
    `;
    
    element.style.position = 'relative';
    element.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

/* ===== PROJECT SHARING ===== */
function initializeProjectSharing() {
    const shareButtons = document.querySelectorAll('.project__share');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project__card');
            const projectTitle = projectCard.querySelector('.project__title').textContent;
            const projectUrl = window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: projectTitle,
                    url: projectUrl
                });
            } else {
                // Fallback: copy to clipboard
                copyToClipboard(projectUrl);
                PortfolioUtils.showNotification('Project link copied to clipboard!', 'success');
            }
        });
    });
}

/* ===== PORTFOLIO ANALYTICS ===== */
function trackPortfolioInteractions() {
    const projectCards = document.querySelectorAll('.project__card');
    const filterButtons = document.querySelectorAll('.filter__btn');
    
    // Track project views
    projectCards.forEach(card => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const projectTitle = entry.target.querySelector('.project__title').textContent;
                    console.log(`Project viewed: ${projectTitle}`);
                    
                    // Track with analytics
                    // gtag('event', 'project_view', {
                    //     'project_title': projectTitle
                    // });
                }
            });
        });
        
        observer.observe(card);
    });
    
    // Track filter usage
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            console.log(`Portfolio filtered by: ${filter}`);
            
            // Track with analytics
            // gtag('event', 'portfolio_filter', {
            //     'filter_category': filter
            // });
        });
    });
}

/* ===== PORTFOLIO CSS ===== */
function addPortfolioCSS() {
    const portfolioCSS = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal__content {
            background: var(--card-bg);
            border-radius: var(--radius-lg);
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        .modal__close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--danger-color);
            color: var(--white);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 1001;
        }
        
        .modal__body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            padding: 2rem;
        }
        
        .modal__image img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: var(--radius);
        }
        
        .modal__tech {
            margin: 1rem 0;
        }
        
        .modal__features ul {
            list-style: none;
            padding: 0;
        }
        
        .modal__features li {
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-light);
        }
        
        .modal__features li:before {
            content: '✓';
            color: var(--accent-color);
            font-weight: bold;
            margin-right: 0.5rem;
        }
        
        .modal__links {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .filter__btn {
            background: transparent;
            border: 2px solid var(--primary-color);
            color: var(--primary-color);
            padding: 0.5rem 1rem;
            border-radius: var(--radius);
            cursor: pointer;
            transition: var(--transition);
        }
        
        .filter__btn.active,
        .filter__btn:hover {
            background: var(--primary-color);
            color: var(--white);
        }
        
        .project__like {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .project__like.liked {
            color: var(--danger-color);
            transform: scale(1.2);
        }
        
        @keyframes heartFloat {
            0% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(-50px) scale(1.5);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = portfolioCSS;
    document.head.appendChild(style);
}

// Initialize all portfolio features
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectLikes();
    initializeProjectSharing();
    trackPortfolioInteractions();
    addPortfolioCSS();
});

// Export portfolio functions
window.Portfolio = {
    filterProjects,
    openProjectModal,
    animateStatNumber,
    initializePortfolioFilter,
    initializeProjectModal
};
