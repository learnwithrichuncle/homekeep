/**
 * HOMEKEEP Website JavaScript
 * Handles interactive elements, animations, and functionality
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeWhatsAppWidget();
    initializeBackToTop();
    initializeFormHandling();
    initializeAnimations();
    initializeScrollEffects();
    initializeServiceCards();
    initializeFAQ();
    initializeTooltips();
    initializeSimpleWhatsAppButton();
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Animate hamburger lines
            const lines = this.querySelectorAll('.hamburger-line');
            if (navMenu.classList.contains('active')) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                
                // Reset hamburger animation
                const lines = navToggle.querySelectorAll('.hamburger-line');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Scrollspy
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const linkMap = new Map();
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) linkMap.set(href.slice(1), link);
    });
    window.addEventListener('scroll', throttle(function() {
        const scrollPosition = window.scrollY + 120;
        let current = null;
        for (let section of sections) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                current = section.id;
                break;
            }
        }
        navLinks.forEach(l => l.classList.remove('active'));
        if (current && linkMap.has(current)) {
            linkMap.get(current).classList.add('active');
        }
    }, 100));
}

/**
 * WhatsApp Widget functionality
 */
function initializeWhatsAppWidget() {
    const whatsappToggle = document.querySelector('.whatsapp-toggle');
    const whatsappChat = document.querySelector('.whatsapp-chat');
    const chatClose = document.querySelector('.chat-close');
    const chatButton = document.querySelector('.chat-button');
    const messageTextEl = document.querySelector('.message-text');
    
    // WhatsApp phone number (replace with actual number)
    const whatsappNumber = '2347051142722';
    
    // Custom greeting messages
    const greetingMessages = [
        "Hello! 👋 How can we help you today?",
        "Hi there! Need assistance with our services?",
        "Welcome to HOMEKEEP! How may we assist you?",
        "Hello! Ready to help you with laundry, fuel, or logistics."
    ];
    
    // Random greeting message
    function getRandomGreeting() {
        return greetingMessages[Math.floor(Math.random() * greetingMessages.length)];
    }
    
    // Update greeting message
    function updateGreetingMessage() {
        const messageText = document.querySelector('.message-text');
        if (messageText) {
            messageText.textContent = getRandomGreeting();
        }
    }
    
    // Toggle WhatsApp chat
    if (whatsappToggle && whatsappChat) {
        whatsappToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            whatsappChat.classList.toggle('active');
            
            if (whatsappChat.classList.contains('active')) {
                updateGreetingMessage();
                // Add animation to toggle button
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }
    
    // Close chat
    if (chatClose && whatsappChat) {
        chatClose.addEventListener('click', function() {
            whatsappChat.classList.remove('active');
            whatsappToggle.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (whatsappChat && whatsappChat.classList.contains('active')) {
            if (!whatsappChat.contains(e.target) && !whatsappToggle.contains(e.target)) {
                whatsappChat.classList.remove('active');
                whatsappToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Update WhatsApp link with custom message
    if (chatButton) {
        const baseMessage = "Hello HOMEKEEP, I need help with your services";
        const encodedMessage = encodeURIComponent(baseMessage);
        chatButton.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Add click tracking
        chatButton.addEventListener('click', function(e) {
            // Track WhatsApp click (you can add analytics here)
            console.log('WhatsApp chat initiated');
            
            // Update message based on current page section
            const currentSection = getCurrentSection();
            if (currentSection) {
                const sectionMessages = {
                    'services': "Hello HOMEKEEP, I'm interested in learning more about your services",
                    'laundry': "Hello HOMEKEEP, I'd like to know more about your laundry services",
                    'fuel': "Hello HOMEKEEP, I need information about gas and fuel delivery",
                    'logistics': "Hello HOMEKEEP, I'm interested in your logistics services",
                    'contact': "Hello HOMEKEEP, I have a question about your services"
                };
                
                const message = sectionMessages[currentSection] || baseMessage;
                const encodedSectionMessage = encodeURIComponent(message);
                this.href = `https://wa.me/${whatsappNumber}?text=${encodedSectionMessage}`;
            }
        });
    }
    
    // Function to get current visible section
    function getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                return section.id;
            }
        }
        return null;
    }
    
    const serviceMessages = {
        laundry: "Hello HOMEKEEP, I'd like to book your laundry service",
        fuel: "Hello HOMEKEEP, I need fuel delivery",
        logistics: "Hello HOMEKEEP, I need a logistics quote"
    };
    
    function openChatWithService(service) {
        const msg = serviceMessages[service] || "Hello HOMEKEEP, I need help with your services";
        const encoded = encodeURIComponent(msg);
        const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;
        window.open(url, '_blank');
    }
    
    const serviceTriggers = document.querySelectorAll('[data-chat-service]');
    serviceTriggers.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.getAttribute('data-chat-service');
            openChatWithService(service);
        });
    });
}

function initializeSimpleWhatsAppButton() {
    if (window.ChatWidget_wa) return;
    const config = {
        number: '2347051142722',
        message: 'hi, homkeep',
        color: '#25D366',
        channel: 'wa',
        boxShadow: 'none',
        text: 'Message Us',
        theme: 'light',
        position: 'right',
        mb: '20px',
        mx: '20px',
        radius: '20px'
    };
    
    const widget = document.createElement('div');
    widget.id = 'chat-widget-wa';
    widget.style.cssText = `position:fixed;${config.position}:${config.mx};bottom:${config.mb};z-index:999999;cursor:pointer`;
    
    const shadowCss =
        config.boxShadow === 'none' ? '' :
        config.boxShadow === 'low' ? 'box-shadow:0 1px 3px rgba(0,0,0,0.12);' :
        config.boxShadow === 'medium' ? 'box-shadow:0 4px 6px rgba(0,0,0,0.15);' :
        'box-shadow:0 10px 25px rgba(0,0,0,0.2);';
    
    const textColor = config.theme === 'dark' ? '#000000' : '#ffffff';
    
    const inner = document.createElement('div');
    inner.style.cssText = `background-color:${config.color};color:${textColor};padding:12px 20px;border-radius:${config.radius};display:flex;align-items:center;gap:8px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:14px;font-weight:500;text-decoration:none;transition:all 0.3s ease;${shadowCss}`;
    inner.innerHTML = `<svg width="20" height="20" viewBox="0 0 25 25" fill="currentColor"><path d="M18.1225 14.9458C17.8183 14.7895 16.3033 14.0473 16.0215 13.9469C15.7397 13.8409 15.5332 13.7907 15.3295 14.1032C15.123 14.4129 14.5371 15.102 14.3529 15.3113C14.1744 15.5178 13.993 15.5429 13.6889 15.3894C11.8808 14.4854 10.695 13.7767 9.50361 11.7315C9.18832 11.1874 9.8189 11.2265 10.4076 10.0518C10.5081 9.84534 10.4578 9.66956 10.3797 9.51331C10.3016 9.35706 9.68776 7.84478 9.43106 7.22815C9.18274 6.62826 8.92604 6.71197 8.7391 6.70081C8.56053 6.68965 8.35684 6.68965 8.15037 6.68965C7.9439 6.68965 7.61187 6.76777 7.33006 7.0719C7.04825 7.38161 6.25305 8.12659 6.25305 9.63887C6.25305 11.1511 7.35517 12.616 7.50584 12.8225C7.66209 13.0289 9.67381 16.1316 12.7625 17.4681C14.7157 18.3107 15.4802 18.3833 16.4567 18.2382C17.051 18.1489 18.2759 17.496 18.5298 16.7734C18.7837 16.0535 18.7837 15.4369 18.7084 15.3085C18.6331 15.1718 18.4266 15.0937 18.1225 14.9458Z"></path><path d="M24.0292 7.65625C23.3986 6.15792 22.4946 4.81306 21.3422 3.65792C20.198 2.50948 18.8395 1.5966 17.3439 0.970982C15.8093 0.326451 14.1798 0 12.5002 0H12.4444C10.7535 0.00837054 9.11567 0.343192 7.57549 1.00167C6.09267 1.63371 4.74699 2.54821 3.61344 3.6942C2.47226 4.84654 1.57661 6.18583 0.95719 7.67857C0.315449 9.22433 -0.00821224 10.8677 0.000158294 12.5586C0.00962607 14.4963 0.468048 16.4054 1.33944 18.1362V22.3772C1.33944 22.7176 1.47467 23.0441 1.71537 23.2848C1.95607 23.5255 2.28253 23.6607 2.62293 23.6607H6.86679C8.59752 24.5321 10.5067 24.9905 12.4444 25H12.5029C14.1743 25 15.7954 24.6763 17.3216 24.043C18.8097 23.4248 20.163 22.5226 21.306 21.3867C22.4583 20.2455 23.3651 18.9118 23.9985 17.4247C24.657 15.8845 24.9918 14.2467 25.0002 12.5558C25.0085 10.8566 24.6793 9.20759 24.0292 7.65625ZM19.8132 19.8772C17.8573 21.8136 15.2624 22.8795 12.5002 22.8795H12.4527C10.7702 22.8711 9.09893 22.4526 7.62293 21.6657L7.38855 21.5402H3.45998V17.6116L3.33442 17.3772C2.54759 15.9012 2.12906 14.2299 2.12069 12.5474C2.10953 9.76562 3.17259 7.15402 5.12293 5.18694C7.07047 3.21987 9.67371 2.1317 12.4555 2.12054H12.5029C13.898 2.12054 15.2513 2.39118 16.5264 2.9269C17.7708 3.44866 18.8869 4.19922 19.8467 5.15904C20.8037 6.11607 21.5571 7.23493 22.0788 8.47935C22.6201 9.76841 22.8908 11.1356 22.8852 12.5474C22.8685 15.3265 21.7775 17.9297 19.8132 19.8772Z"></path></svg>${config.text}`;
    
    inner.addEventListener('mouseover', () => { inner.style.transform = 'scale(1.05)'; });
    inner.addEventListener('mouseout', () => { inner.style.transform = 'scale(1)'; });
    inner.addEventListener('click', () => {
        const url = `https://wa.me/${config.number}?text=${encodeURIComponent(config.message)}`;
        window.open(url, '_blank');
    });
    
    widget.appendChild(inner);
    document.body.appendChild(widget);
    
    const existingWidget = document.querySelector('.whatsapp-widget');
    if (existingWidget) existingWidget.style.display = 'none';
    
    window.ChatWidget_wa = true;
}

/**
 * Back to Top Button
 */
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'flex';
                backToTopButton.classList.add('fade-in-up');
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        // Scroll to top functionality
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

/**
 * Form handling
 */
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form data
            if (validateForm(data)) {
                // Simulate form submission
                submitForm(data);
            }
        });
    }
    
    // Form validation
    function validateForm(data) {
        const errors = [];
        
        // Name validation
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        // Service validation
        if (!data.service) {
            errors.push('Please select a service');
        }
        
        // Message validation
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            showFormErrors(errors);
            return false;
        }
        
        return true;
    }
    
    // Show form errors
    function showFormErrors(errors) {
        // Remove existing error messages
        const existingErrors = document.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());
        
        // Create error container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'form-error';
        errorContainer.style.cssText = `
            background: #fee;
            border: 1px solid #fcc;
            color: #c33;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
        `;
        
        // Add error messages
        const errorList = document.createElement('ul');
        errorList.style.margin = '0';
        errorList.style.paddingLeft = '1.5rem';
        
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            li.style.marginBottom = '0.25rem';
            errorList.appendChild(li);
        });
        
        errorContainer.appendChild(errorList);
        
        // Insert before form
        const form = document.getElementById('contactForm');
        form.insertBefore(errorContainer, form.firstChild);
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Remove errors after 5 seconds
        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    }
    
    // Submit form (simulated)
    function submitForm(data) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
    
    // Show success message
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.style.cssText = `
            background: #efe;
            border: 1px solid #cec;
            color: #363;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 500;
        `;
        successMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
        
        const form = document.getElementById('contactForm');
        form.insertBefore(successMessage, form.firstChild);
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
}

/**
 * Animations and Interactions
 */
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .stat-item, .contact-item');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
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
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .service-card:hover {
            transform: translateY(-8px) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Scroll effects
 */
function initializeScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    // Update progress bar on scroll
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/**
 * Service cards functionality
 */
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    const learnMoreButtons = document.querySelectorAll('.service-card .btn-outline');
    
    // Add click functionality to "Learn More" buttons
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.service-card');
            const serviceTitle = card.querySelector('.service-title').textContent;
            
            // Create modal or expand card (simple version)
            const expandedContent = document.createElement('div');
            expandedContent.className = 'service-expanded';
            expandedContent.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 1002;
            `;
            
            expandedContent.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0; color: var(--primary-color);">${serviceTitle}</h3>
                    <button class="close-expanded" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>
                <div style="color: var(--gray-600); line-height: 1.6;">
                    <p>Thank you for your interest in our ${serviceTitle.toLowerCase()}!</p>
                    <p>Our team will contact you shortly with more detailed information about pricing, availability, and how we can customize our services to meet your specific needs.</p>
                    <p>In the meantime, feel free to reach out via WhatsApp or phone for immediate assistance.</p>
                </div>
                <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                    <button class="btn btn-primary contact-now">Contact Now</button>
                    <button class="btn btn-secondary close-btn">Close</button>
                </div>
            `;
            
            // Add overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1001;
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(expandedContent);
            
            // Close functionality
            const closeModal = () => {
                expandedContent.remove();
                overlay.remove();
            };
            
            expandedContent.querySelector('.close-expanded').addEventListener('click', closeModal);
            expandedContent.querySelector('.close-btn').addEventListener('click', closeModal);
            expandedContent.querySelector('.contact-now').addEventListener('click', function() {
                closeModal();
                // Scroll to contact section
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            });
            
            overlay.addEventListener('click', closeModal);
            
            // Close on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        });
    });
}

function initializeFAQ() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        if (!header || !content) return;
        header.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            item.classList.toggle('active');
            if (!expanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });
}

function initializeTooltips() {
    const tooltipTargets = document.querySelectorAll('[data-tooltip]');
    tooltipTargets.forEach(el => {
        el.setAttribute('tabindex', '0');
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') this.blur();
        });
    });
}

/**
 * Utility functions
 */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add loading animation for images
function addImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

// Initialize image loading
addImageLoading();

// Add performance monitoring
if (window.performance) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('Performance Metrics:');
            console.log('Page Load Time:', pageLoadTime + 'ms');
            console.log('Connection Time:', connectTime + 'ms');
            console.log('Render Time:', renderTime + 'ms');
        }, 0);
    });
}

// Add error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can send errors to your monitoring service here
});

// Add unhandled rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You can send errors to your monitoring service here
});
