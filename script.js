document.addEventListener('DOMContentLoaded', () => {
    // --- Global Loading Indicator Logic (for initial page load) ---
    const loadingIndicator = document.getElementById('global-loading-indicator');

    let loadProgress = 0;
    const simulateLoad = setInterval(() => {
        loadProgress += 10;
        loadingIndicator.style.width = `${loadProgress}%`;
        loadingIndicator.setAttribute('aria-valuenow', loadProgress);
        if (loadProgress >= 100) {
            clearInterval(simulateLoad);
            loadingIndicator.classList.add('hide');
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
            }, 500);
        }
    }, 100);

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.warn('Smooth scroll target not found:', targetId);
            }
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            navToggle.classList.toggle('active', isExpanded);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- App Mockup Screen Slider with Lazy Loading ---
    const mockupScreens = document.querySelectorAll('.mockup-screen .screen-content');
    let currentScreenIndex = 0;

    function lazyLoadMockupScreen(screenElement) {
        const imgSrc = screenElement.dataset.src;
        if (imgSrc && !screenElement.style.backgroundImage) {
            screenElement.style.backgroundImage = `url('${imgSrc}')`;
            screenElement.classList.add('lazyloaded');
        }
    }

    function showNextMockupScreen() {
        if (mockupScreens.length === 0) return;

        lazyLoadMockupScreen(mockupScreens[currentScreenIndex]);
        mockupScreens[currentScreenIndex].classList.remove('active');

        currentScreenIndex = (currentScreenIndex + 1) % mockupScreens.length;

        const nextScreenIndex = (currentScreenIndex + 1) % mockupScreens.length;
        lazyLoadMockupScreen(mockupScreens[nextScreenIndex]);

        mockupScreens[currentScreenIndex].classList.add('active');
    }

    if (mockupScreens.length > 0) {
        lazyLoadMockupScreen(mockupScreens[currentScreenIndex]);
        mockupScreens[currentScreenIndex].classList.add('active');
        setInterval(showNextMockupScreen, 4000);
    }

    // --- Dynamic Year for Footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active Navigation Link Highlighting (Intersection Observer) ---
    const sections = document.querySelectorAll('section[id]');
    const navListItems = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.getAttribute('id');

                navListItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    if (window.scrollY === 0) {
        navListItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#hero') {
                link.classList.add('active');
            }
        });
    }

    // --- Lazy Load Images and Background Images ---
    const lazyLoadElements = document.querySelectorAll('img[data-src], .shop-image[data-bg]');

    const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.tagName === 'IMG') {
                    element.src = element.dataset.src;
                } else if (element.classList.contains('shop-image')) {
                    element.style.backgroundImage = `url('${element.dataset.bg}')`;
                }
                element.classList.add('lazyloaded');
                observer.unobserve(element);
            }
        });
    }, { rootMargin: '0px 0px 200px 0px' });

    lazyLoadElements.forEach(element => {
        lazyObserver.observe(element);
    });

    // --- Scroll-triggered Loading Indicator ---
    const scrollLoadingIndicator = document.getElementById('scroll-loading-indicator');
    const loadMoreButton = document.getElementById('load-more-shops-btn');
    let isLoadingMore = false;

    function loadMoreContent() {
        if (isLoadingMore) return;

        isLoadingMore = true;
        scrollLoadingIndicator.style.display = 'flex';
        scrollLoadingIndicator.classList.add('active');
        loadMoreButton.style.display = 'none';

        console.log('Simulating loading more content...');

        setTimeout(() => {
            console.log('More content loaded!');
            scrollLoadingIndicator.classList.remove('active');
            setTimeout(() => {
                scrollLoadingIndicator.style.display = 'none';
                loadMoreButton.style.display = 'block';
            }, 600);
            isLoadingMore = false;
        }, 2000);
    }

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMoreContent);
    }

    const shopsSection = document.getElementById('shops');
    if (shopsSection && scrollLoadingIndicator) {
        const loadingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isLoadingMore && loadMoreButton.style.display !== 'none') {
                    console.log("Reached near the end of shops section.");
                }
            });
        }, { rootMargin: '0px 0px 100px 0px' });

        loadingObserver.observe(loadMoreButton);
    }

    // --- Force Lazy Load for Interactive Carousel Images ---
    const carouselImages = document.querySelectorAll('.interactive-carousel img[data-src]');
    carouselImages.forEach(img => {
        if (!img.src) {
            img.src = img.dataset.src;
            img.classList.add('lazyloaded');
        }
    });

    // --- Number Counting Animation ---
    const numberCounters = document.querySelectorAll('.count-on-load');

    numberCounters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        let current = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 10); // Adjust 10 for smoother animation (smaller steps)

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current); // Use Math.ceil to round up
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target; // Ensure the final number is exact
            }
        };
        updateCounter();
    });

}); // End DOMContentLoaded