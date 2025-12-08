        // DOM Elements
        const mainHeader = document.getElementById('mainHeader');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        const solutionsTitle = document.getElementById('solutionsTitle');
        const solutionsGrid = document.getElementById('solutionsGrid');
        const cards = document.querySelectorAll('.card');
        const ctaBox = document.getElementById('ctaBox');
        
        // Theme toggle elements
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        const desktopThemeToggle = document.getElementById('desktopThemeToggle');
        
        // Mobile sidebar elements
        const mobileSidebar = document.getElementById('mobileSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
        
        // Ticker Elements
        const tickerList = document.getElementById('tickerList');
        const tickerItems = document.querySelectorAll('.ticker-item');
        const prevTickerBtn = document.getElementById('prevTicker');
        const nextTickerBtn = document.getElementById('nextTicker');
        const tickerIndicators = document.querySelectorAll('.ticker-indicator');
        
        // Ticker State
        let currentTickerIndex = 0;
        let tickerInterval;
        const TICKER_DURATION = 3200; // 3.2 seconds
        
        // ==============
        // THEME TOGGLE
        // ==============
        function toggleTheme() {
            document.body.classList.toggle('light-theme');
            const isLightTheme = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
            updateThemeButtonIcons(isLightTheme);
        }
        
        function updateThemeButtonIcons(isLightTheme) {
            // Update all theme toggle buttons
            const themeButtons = document.querySelectorAll('.theme-toggle');
            
            themeButtons.forEach(button => {
                const sunIcon = button.querySelector('.fa-sun');
                const moonIcon = button.querySelector('.fa-moon');
                
                if (isLightTheme) {
                    sunIcon.style.display = 'none';
                    moonIcon.style.display = 'block';
                } else {
                    sunIcon.style.display = 'block';
                    moonIcon.style.display = 'none';
                }
            });
        }
        
        function loadThemePreference() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                updateThemeButtonIcons(true);
            }
        }
        
        // ==============
        // MOBILE SIDEBAR
        // ==============
        function openMobileSidebar() {
            mobileSidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeMobileSidebar() {
            mobileSidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // ==============
        // HEADER SCROLL EFFECT
        // ==============
        function handleScroll() {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }
        
        // ==============
        // INTERSECTION OBSERVER FOR ANIMATIONS
        // ==============
        function setupIntersectionObserver() {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const observerCallback = (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // If it's the solutions grid, also animate individual cards
                        if (entry.target.id === 'solutionsGrid') {
                            cards.forEach((card, index) => {
                                setTimeout(() => {
                                    card.classList.add('visible');
                                }, index * 100);
                            });
                        }
                        
                        // Stop observing after animation triggers
                        observer.unobserve(entry.target);
                    }
                });
            };
            
            const observer = new IntersectionObserver(observerCallback, observerOptions);
            
            // Observe elements for scroll animations
            const animatedElements = [solutionsTitle, solutionsGrid, ctaBox];
            const sectionTitles = document.querySelectorAll('.section-title');
            const projectCards = document.querySelectorAll('.project-card');
            const blogCards = document.querySelectorAll('.blog-card');
            
            animatedElements.forEach(el => {
                if (el) observer.observe(el);
            });
            
            sectionTitles.forEach(el => observer.observe(el));
            projectCards.forEach(el => observer.observe(el));
            blogCards.forEach(el => observer.observe(el));
        }
        
        // ==============
        // TICKER FUNCTIONS
        // ==============
        function showTickerItem(index) {
            // Validate index
            if (index < 0) index = tickerItems.length - 1;
            if (index >= tickerItems.length) index = 0;
            
            // Update current index
            currentTickerIndex = index;
            
            // Update ticker items
            tickerItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            
            // Update indicators
            tickerIndicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            // Update ARIA live region
            const activeItem = tickerItems[index];
            const title = activeItem.querySelector('h4').textContent;
            const description = activeItem.querySelector('p').textContent;
            tickerList.setAttribute('aria-label', `Currently showing: ${title}. ${description}`);
        }
        
        function nextTickerItem() {
            showTickerItem(currentTickerIndex + 1);
        }
        
        function prevTickerItem() {
            showTickerItem(currentTickerIndex - 1);
        }
        
        function startTickerAutoPlay() {
            if (tickerInterval) clearInterval(tickerInterval);
            
            tickerInterval = setInterval(() => {
                if (!document.hidden) {
                    nextTickerItem();
                }
            }, TICKER_DURATION);
        }
        
        function stopTickerAutoPlay() {
            if (tickerInterval) {
                clearInterval(tickerInterval);
                tickerInterval = null;
            }
        }
        
        // ==============
        // CARD HOVER EFFECTS
        // ==============
        function setupCardHoverEffects() {
            const allCards = document.querySelectorAll('.card, .project-card, .blog-card');
            
            allCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px)';
                    card.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                });
            });
        }
        
        // ==============
        // SMOOTH SCROLL
        // ==============
        function setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    // Skip if it's just "#"
                    if (href === '#') return;
                    
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        e.preventDefault();
                        
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile sidebar if open
                        if (mobileSidebar.classList.contains('active')) {
                            closeMobileSidebar();
                        }
                    }
                });
            });
        }
        
        // ==============
        // LAZY LOADING
        // ==============
        function setupLazyLoading() {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            }
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback for browsers without IntersectionObserver
                lazyImages.forEach(img => {
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                });
            }
        }
        
        // ==============
        // EVENT LISTENERS
        // ==============
        function setupEventListeners() {
            // Window events
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', () => {
                // Close mobile sidebar on resize if window is larger
                if (window.innerWidth > 768 && mobileSidebar.classList.contains('active')) {
                    closeMobileSidebar();
                }
            });
            
            // Mobile menu button - opens sidebar
            mobileMenuBtn.addEventListener('click', openMobileSidebar);
            
            // Close sidebar buttons
            sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
            sidebarOverlay.addEventListener('click', closeMobileSidebar);
            
            // Close sidebar when clicking a link
            document.querySelectorAll('.sidebar-nav-link').forEach(link => {
                link.addEventListener('click', closeMobileSidebar);
            });
            
            // Theme toggles
            mobileThemeToggle.addEventListener('click', toggleTheme);
            desktopThemeToggle.addEventListener('click', toggleTheme);
            
            // Ticker controls
            prevTickerBtn.addEventListener('click', () => {
                prevTickerItem();
                stopTickerAutoPlay();
                setTimeout(startTickerAutoPlay, 10000); // Restart after 10 seconds
            });
            
            nextTickerBtn.addEventListener('click', () => {
                nextTickerItem();
                stopTickerAutoPlay();
                setTimeout(startTickerAutoPlay, 10000); // Restart after 10 seconds
            });
            
            // Ticker indicators
            tickerIndicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    showTickerItem(index);
                    stopTickerAutoPlay();
                    setTimeout(startTickerAutoPlay, 10000);
                });
            });
            
            // Pause ticker on hover/focus
            const tickerSection = document.querySelector('.ticker');
            if (tickerSection) {
                tickerSection.addEventListener('mouseenter', stopTickerAutoPlay);
                tickerSection.addEventListener('mouseleave', startTickerAutoPlay);
                tickerSection.addEventListener('focusin', stopTickerAutoPlay);
                tickerSection.addEventListener('focusout', startTickerAutoPlay);
            }
            
            // Add keyboard navigation to ticker
            document.addEventListener('keydown', (e) => {
                if (e.target.closest('.ticker')) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        prevTickerItem();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        nextTickerItem();
                    }
                }
                
                // Close sidebar on escape key
                if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
                    closeMobileSidebar();
                }
            });
        }
        
        // ==============
        // INITIALIZATION
        // ==============
        function init() {
            // Load theme preference
            loadThemePreference();
            
            // Initial scroll check
            handleScroll();
            
            // Setup all functionality
            setupIntersectionObserver();
            setupCardHoverEffects();
            setupSmoothScroll();
            setupLazyLoading();
            setupEventListeners();
            
            // Start ticker
            startTickerAutoPlay();
            
            // Log initialization
            console.log('PEV Labs website initialized successfully');
        }
        
        // ==============
        // WINDOW LOAD
        // ==============
        window.addEventListener('DOMContentLoaded', init);
        
        // Handle page visibility (pause animations when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopTickerAutoPlay();
            } else {
                startTickerAutoPlay();
            }
        });
        
        // Error handling for images
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                console.warn('Image failed to load:', e.target.src);
                // Set a fallback image or hide it gracefully
                e.target.style.opacity = '0.5';
                e.target.style.backgroundColor = '#f0f0f0';
            }
        }, true);
        
    
        // Initialize animations
        function initAnimations() {
            // Timeline items animation
            const timelineItems = document.querySelectorAll('.timeline-item');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            timelineItems.forEach(item => {
                observer.observe(item);
            });

            // Team cards hover effects
            const teamCards = document.querySelectorAll('.team-card');
            teamCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });

            // Pillar cards hover effects
            const pillars = document.querySelectorAll('.pillar');
            pillars.forEach(pillar => {
                pillar.addEventListener('mouseenter', () => {
                    pillar.style.transform = 'translateY(-10px) rotateX(5deg)';
                });
                
                pillar.addEventListener('mouseleave', () => {
                    pillar.style.transform = '';
                });
            });
        }

        // Lazy loading for images
        function initLazyLoading() {
            const lazyImages = document.querySelectorAll('img');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            }
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(img => {
                    if (img.hasAttribute('loading') && img.getAttribute('loading') === 'lazy') {
                        imageObserver.observe(img);
                    }
                });
            }
        }

        // Initialize everything
        window.addEventListener('DOMContentLoaded', () => {
            initAnimations();
            initLazyLoading();
            console.log('PEV Labs About page initialized');
        });
    

              // Scroll animations
        const pillars = document.querySelectorAll('.pillar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        pillars.forEach(pillar => observer.observe(pillar));

       

        // Parallax effect for floating elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const floatElements = document.querySelectorAll('.float-element');
            
            floatElements.forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };


        // Observe elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Contact button functionality
        document.querySelectorAll('.btn-primary[href="#contact-form"], .btn-primary[href="#contact"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.getAttribute('href') === '#contact-form' || btn.getAttribute('href') === '#contact') {
                    e.preventDefault();
                    alert('Thank you for your interest in our partnership initiative. Our partnership team will contact you within 24 hours.');
                }
            });
        });

        // Initialize animations on load
        document.addEventListener('DOMContentLoaded', () => {
            // Add initial animation to hero elements
            const heroElements = document.querySelectorAll('.hero .fade-in');
            heroElements.forEach((el, index) => {
                el.style.animationDelay = `${index * 0.2}s`;
            });
        });


