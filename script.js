// ============================================
// 1. SMOOTH SCROLL BEHAVIOR
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// 2. MOBILE MENU TOGGLE
// ============================================
function setupMobileMenu() {
    const nav = document.querySelector('.main-nav');
    const header = document.querySelector('.site-header');

    // Create hamburger button if it doesn't exist
    let hamburger = document.querySelector('.hamburger');
    if (!hamburger) {
        hamburger = document.createElement('button');
        hamburger.classList.add('hamburger');
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        hamburger.setAttribute('aria-label', 'Toggle menu');
        header.querySelector('.nav-wrap').appendChild(hamburger);
    }

    hamburger.addEventListener('click', function () {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ============================================
// 3. SCROLL ANIMATIONS (Fade-in on scroll)
// ============================================
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.destination-card, .info-card, .page-hero').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// 4. SETTINGS MODAL
// ============================================
function setupSettings() {
    // Create settings button if it doesn't exist
    let settingsBtn = document.querySelector('.settings-btn');
    if (!settingsBtn) {
        const nav = document.querySelector('.main-nav');
        settingsBtn = document.createElement('button');
        settingsBtn.classList.add('settings-btn');
        settingsBtn.innerHTML = '⚙️ Settings';
        settingsBtn.setAttribute('aria-label', 'Open settings');
        nav.parentElement.appendChild(settingsBtn);
    }

    // Create settings modal
    let settingsModal = document.querySelector('.settings-modal');
    if (!settingsModal) {
        settingsModal = document.createElement('div');
        settingsModal.classList.add('settings-modal');
        settingsModal.innerHTML = `
            <div class="settings-modal-content">
                <div class="settings-header">
                    <h3>Settings</h3>
                    <button class="settings-close" aria-label="Close settings">&times;</button>
                </div>
                <div class="settings-body">
                    <div class="settings-option">
                        <label for="dark-mode-toggle">
                            <input type="checkbox" id="dark-mode-toggle" class="settings-checkbox">
                            <span>Dark Mode</span>
                        </label>
                    </div>
                    <div class="settings-option">
                        <label for="animations-toggle">
                            <input type="checkbox" id="animations-toggle" class="settings-checkbox" checked>
                            <span>Enable Animations</span>
                        </label>
                    </div>
                    <div class="settings-option">
                        <label for="notifications-toggle">
                            <input type="checkbox" id="notifications-toggle" class="settings-checkbox" checked>
                            <span>Notifications</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(settingsModal);
    }

    // Load saved settings
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const darkToggle = document.querySelector('#dark-mode-toggle');
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkToggle.checked = true;
    }

    // Settings button toggle
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.toggle('active');
    });

    // Close button
    const closeBtn = settingsModal.querySelector('.settings-close');
    closeBtn.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsModal.contains(e.target) && !settingsBtn.contains(e.target)) {
            settingsModal.classList.remove('active');
        }
    });

    // Dark mode toggle
    darkToggle.addEventListener('change', function () {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', this.checked);
    });

    // Animations toggle
    const animationsToggle = document.querySelector('#animations-toggle');
    animationsToggle.addEventListener('change', function () {
        if (this.checked) {
            document.body.style.removeProperty('--animation-duration');
        } else {
            document.body.style.setProperty('--animation-duration', '0.01ms');
        }
        localStorage.setItem('animationsEnabled', this.checked);
    });

    // Notifications toggle
    const notificationsToggle = document.querySelector('#notifications-toggle');
    notificationsToggle.addEventListener('change', function () {
        localStorage.setItem('notificationsEnabled', this.checked);
        if (this.checked) {
            console.log('Notifications enabled');
        } else {
            console.log('Notifications disabled');
        }
    });
}

// ============================================
// 5. IMAGE LAZY LOADING
// ============================================
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// 6. GALLERY FILTERS
// ============================================
function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const destinationCards = document.querySelectorAll('.destination-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.dataset.filter;

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter cards
            destinationCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('fade-in'), 10);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
        });
    });
}

// ============================================
// 7. FORM VALIDATION
// ============================================
function setupFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            let isValid = true;

            // Validate required fields
            const requiredFields = this.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });

            // Validate email if present
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.classList.add('error');
                    isValid = false;
                } else {
                    emailField.classList.remove('error');
                }
            }

            if (isValid) {
                if (this.action.endsWith('/api/contact')) {
                    e.preventDefault();
                    const form = this;
                    const submitButton = form.querySelector('button[type="submit"]');
                    const existingMessage = form.querySelector('.form-message');
                    if (existingMessage) existingMessage.remove();
                    submitButton.disabled = true;

                    fetch(form.action, {
                        method: 'POST',
                        body: new URLSearchParams(new FormData(form))
                    })
                        .then(async response => {
                            const responseText = await response.text();
                            let result;

                            try {
                                result = responseText ? JSON.parse(responseText) : null;
                            } catch {
                                throw new Error('The server returned an invalid response. Make sure the Node.js server is running.');
                            }

                            if (!result) {
                                throw new Error('The server returned an empty response. Run npm start, then open the website at http://localhost:3000.');
                            }

                            if (!response.ok) throw new Error(result.errors.join(' '));
                            return result;
                        })
                        .then(result => {
                            const success = document.createElement('p');
                            success.className = 'form-message success';
                            success.setAttribute('role', 'status');
                            success.textContent = `Thanks, ${result.name}. Your message was received.`;
                            form.prepend(success);
                            form.reset();
                        })
                        .catch(error => {
                            const failure = document.createElement('p');
                            failure.className = 'form-message error';
                            failure.setAttribute('role', 'alert');
                            failure.textContent = error.message === 'Failed to fetch'
                                ? 'The form needs the Node.js server. Run npm start, then open http://localhost:3000.'
                                : error.message;
                            form.prepend(failure);
                        })
                        .finally(() => {
                            submitButton.disabled = false;
                        });
                }
            } else {
                e.preventDefault();
            }
        });

        // Remove error class on input
        form.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('input', function () {
                this.classList.remove('error');
            });
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    observeElements();
    setupSettings();
    setupLazyLoading();
    setupGalleryFilters();
    setupFormValidation();

    console.log('JavaScript initialized successfully!');
});
