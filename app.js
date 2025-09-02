// Global variables
let particles = [];
let mouse = { x: 0, y: 0 };
let isLoaded = false;
let animationId;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeLoading();
    initializeCursor();
    initializeParticles();
    initializeNavigation();
    initializeTerminal();
    initializeCounters();
    initializeSkillsRadar();
    initializeProjectCards();
    initializeContactForm();
    initializePerformanceMonitor();
    initializeScrollAnimations();
    
    // Start the main animation loop
    animate();
}

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        isLoaded = true;
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }, 2500);
}

// Custom Cursor
function initializeCursor() {
    const cursor = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursor-trail');
    let mouseTrail = [];
    
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Update main cursor
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        
        // Add to trail
        mouseTrail.push({ x: e.clientX, y: e.clientY, age: 0 });
        if (mouseTrail.length > 10) mouseTrail.shift();
        
        // Update trail
        if (mouseTrail.length > 5) {
            const trailPoint = mouseTrail[5];
            cursorTrail.style.left = trailPoint.x - 4 + 'px';
            cursorTrail.style.top = trailPoint.y - 4 + 'px';
        }
    });
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('button, a, .nav-item, .project-card, .performance-monitor, .skill-tag, .contact-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.mixBlendMode = 'normal';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.mixBlendMode = 'difference';
        });
    });
}

// Particle System
function initializeParticles() {
    const particlesBg = document.getElementById('particles-bg');
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and properties
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 3 + 1;
        const speed = Math.random() * 2 + 0.5;
        const direction = Math.random() * Math.PI * 2;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particles.push({
            element: particle,
            x: x,
            y: y,
            vx: Math.cos(direction) * speed,
            vy: Math.sin(direction) * speed,
            size: size
        });
        
        particlesBg.appendChild(particle);
    }
    
    // Animate particles
    function animateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary check
            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
            
            // Mouse attraction
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.001;
                particle.vy += dy * force * 0.001;
            }
            
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
    }
    
    setInterval(animateParticles, 16);
}

// Enhanced Navigation - Fixed scrolling functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(navItem => {
        // Add click event listener
        navItem.addEventListener('click', (event) => {
            event.preventDefault();
            
            const targetSection = navItem.dataset.section;
            const target = document.getElementById(targetSection);
            
            if (target) {
                // Add click effect
                createRippleEffect(navItem, event);
                
                // Add active state
                navItems.forEach(item => item.classList.remove('active'));
                navItem.classList.add('active');
                
                // Calculate proper scroll position
                const navBarHeight = document.querySelector('.main-navigation').offsetHeight;
                const offset = navBarHeight + 20; // Navigation height plus some padding
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - offset;
                
                // Smooth scroll to section
                window.scrollTo({
                    top: Math.max(0, offsetPosition),
                    behavior: 'smooth'
                });
                
                // Show notification
                showNotification(`Navigating to ${targetSection.toUpperCase()} section`, 'success');
            }
        });
        
        // Add hover effects
        navItem.addEventListener('mouseenter', () => {
            if (!navItem.classList.contains('active')) {
                navItem.style.transform = 'translateY(-2px) scale(1.05)';
            }
        });
        
        navItem.addEventListener('mouseleave', () => {
            if (!navItem.classList.contains('active')) {
                navItem.style.transform = '';
            }
        });
    });
    
    // Update active nav item based on scroll position
    window.addEventListener('scroll', debounce(updateActiveNavigation, 100));
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');
    const navBarHeight = document.querySelector('.main-navigation').offsetHeight;
    const scrollPosition = window.scrollY + navBarHeight + 100; // Adjusted for better detection
    
    let activeSection = null;
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            activeSection = section.id;
        }
    });
    
    if (activeSection) {
        // Remove active class from all nav items
        navItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to corresponding nav item
        const activeNavItem = document.querySelector(`[data-section="${activeSection}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }
}

// Create ripple effect
function createRippleEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = diameter + 'px';
    ripple.style.left = (event.clientX - rect.left - radius) + 'px';
    ripple.style.top = (event.clientY - rect.top - radius) + 'px';
    ripple.classList.add('ripple');
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(50, 184, 198, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '1000';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Terminal Animation
function initializeTerminal() {
    const terminalContent = document.getElementById('terminal-content');
    const commands = [
        '$ gcc -o firmware main.c driver.c',
        'Compiling embedded firmware...',
        '✓ Hardware abstraction layer linked',
        '✓ Build successful: 0 errors, 0 warnings',
        '',
        '$ ./firmware --deploy --target=cortex-m4',
        'Uploading to microcontroller...',
        '██████████ 100% Flash programmed',
        '✓ System initialization complete',
        '✓ RTOS kernel started',
        '✓ All peripherals online',
        '',
        '$ system_status',
        'Status: READY | Uptime: 99.9%',
        'Available for operation...'
    ];
    
    let commandIndex = 0;
    let charIndex = 0;
    
    function typeCommand() {
        if (commandIndex < commands.length) {
            const currentCommand = commands[commandIndex];
            
            if (charIndex < currentCommand.length) {
                terminalContent.innerHTML += currentCommand[charIndex];
                charIndex++;
                setTimeout(typeCommand, Math.random() * 50 + 25);
            } else {
                terminalContent.innerHTML += '<br>';
                commandIndex++;
                charIndex = 0;
                setTimeout(typeCommand, Math.random() * 800 + 400);
            }
        } else {
            // Restart animation
            setTimeout(() => {
                terminalContent.innerHTML = '';
                commandIndex = 0;
                charIndex = 0;
                typeCommand();
            }, 4000);
        }
    }
    
    // Start typing animation when terminal becomes visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && terminalContent.innerHTML === '') {
                setTimeout(typeCommand, 1000); // Delay start
            }
        });
    });
    
    observer.observe(terminalContent);
}

// Counter Animations
function initializeCounters() {
    const counters = document.querySelectorAll('.counter-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(target * easeOutQuart);
            
            if (target >= 1000) {
                element.textContent = currentValue.toLocaleString();
            } else {
                element.textContent = currentValue;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
}

// Enhanced Skills Radar Visualization
function initializeSkillsRadar() {
    const canvas = document.getElementById('skills-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    
    const skills = [
        { name: 'C/C++', level: 0.9, angle: 0, color: '#32B8C6' },
        { name: 'Embedded Systems', level: 0.95, angle: Math.PI / 3, color: '#45A6B2' },
        { name: 'RTOS', level: 0.85, angle: 2 * Math.PI / 3, color: '#1D7580' },
        { name: 'Hardware Integration', level: 0.8, angle: Math.PI, color: '#2994A1' },
        { name: 'Python', level: 0.75, angle: 4 * Math.PI / 3, color: '#0F5B66' },
        { name: 'Linux/Yocto', level: 0.7, angle: 5 * Math.PI / 3, color: '#1A6B75' }
    ];
    
    let animationProgress = 0;
    let mouseAngle = 0;
    
    // Add mouse interaction
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - centerX;
        const mouseY = e.clientY - rect.top - centerY;
        mouseAngle = Math.atan2(mouseY, mouseX);
    });
    
    function drawRadar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw radar circles
        ctx.strokeStyle = 'rgba(50, 184, 198, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // Draw radar lines with glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#32B8C6';
        skills.forEach(skill => {
            ctx.strokeStyle = 'rgba(50, 184, 198, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            const endX = centerX + Math.cos(skill.angle - Math.PI / 2) * radius;
            const endY = centerY + Math.sin(skill.angle - Math.PI / 2) * radius;
            ctx.lineTo(endX, endY);
            ctx.stroke();
        });
        ctx.shadowBlur = 0;
        
        // Draw skill points with enhanced effects
        skills.forEach((skill, index) => {
            const skillRadius = radius * skill.level * animationProgress;
            const x = centerX + Math.cos(skill.angle - Math.PI / 2) * skillRadius;
            const y = centerY + Math.sin(skill.angle - Math.PI / 2) * skillRadius;
            
            // Main point
            ctx.fillStyle = skill.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = skill.color;
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            // Inner glow
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        // Connect skill points
        ctx.strokeStyle = 'rgba(50, 184, 198, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        skills.forEach((skill, index) => {
            const skillRadius = radius * skill.level * animationProgress;
            const x = centerX + Math.cos(skill.angle - Math.PI / 2) * skillRadius;
            const y = centerY + Math.sin(skill.angle - Math.PI / 2) * skillRadius;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.stroke();
        
        // Fill area with gradient
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(50, 184, 198, 0.2)');
        gradient.addColorStop(1, 'rgba(50, 184, 198, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    // Animate radar when it becomes visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateRadar();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(canvas);
    
    function animateRadar() {
        function animate() {
            animationProgress = Math.min(animationProgress + 0.02, 1);
            drawRadar();
            
            if (animationProgress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Continue with subtle animation
                setInterval(() => {
                    drawRadar();
                }, 100);
            }
        }
        animate();
    }
}

// Enhanced Project Cards 3D Interaction
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * 15;
            const rotateY = (centerX - x) / centerX * 15;
            
            card.querySelector('.project-face').style.transform = 
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.project-face').style.transform = 
                'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
        
        card.addEventListener('click', (event) => {
            createRippleEffect(card, event);
            
            // Add click animation
            card.style.animation = 'none';
            card.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                card.style.animation = '';
                card.style.transform = '';
                
                // Show project details notification
                const projectName = card.querySelector('h3').textContent;
                showNotification(`Viewing ${projectName} details`, 'success');
            }, 200);
        });
    });
}

// Enhanced Contact Form
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.contact-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.style.transform = 'scale(0.98)';
        
        // Simulate form submission
        setTimeout(() => {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.style.transform = '';
            
            // Show success message
            showNotification('Message sent successfully! 🚀', 'success');
            contactForm.reset();
            
            // Add success animation to form
            contactForm.style.transform = 'scale(1.02)';
            setTimeout(() => {
                contactForm.style.transform = '';
            }, 300);
        }, 2500);
    });
    
    // Add real-time form validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.validity.valid) {
                input.style.borderColor = 'var(--color-success)';
            } else {
                input.style.borderColor = 'var(--color-error)';
            }
        });
    });
}

// Enhanced Performance Monitor
function initializePerformanceMonitor() {
    const performanceMonitor = document.querySelector('.performance-monitor');
    const cpuFill = document.querySelector('.cpu-usage');
    const ramFill = document.querySelector('.ram-usage');
    const netFill = document.querySelector('.net-usage');
    const cpuValue = cpuFill.parentElement.nextElementSibling;
    const ramValue = ramFill.parentElement.nextElementSibling;
    const netValue = netFill.parentElement.nextElementSibling;
    
    let stats = { cpu: 85, ram: 67, net: 92 };
    
    // Make performance monitor interactive
    performanceMonitor.addEventListener('click', (event) => {
        createRippleEffect(performanceMonitor, event);
        
        // Generate new random stats
        stats.cpu = 60 + Math.random() * 30;
        stats.ram = 50 + Math.random() * 35;
        stats.net = 70 + Math.random() * 25;
        
        updateStats();
        showNotification('System stats refreshed', 'success');
    });
    
    performanceMonitor.addEventListener('mouseenter', () => {
        performanceMonitor.style.borderColor = 'var(--color-teal-300)';
        performanceMonitor.style.boxShadow = '0 8px 32px rgba(50, 184, 198, 0.4)';
    });
    
    performanceMonitor.addEventListener('mouseleave', () => {
        performanceMonitor.style.borderColor = 'rgba(50, 184, 198, 0.4)';
        performanceMonitor.style.boxShadow = '0 8px 32px rgba(50, 184, 198, 0.2)';
    });
    
    function updateStats() {
        // Animate stat bars
        cpuFill.style.transform = `scaleX(${stats.cpu / 100})`;
        ramFill.style.transform = `scaleX(${stats.ram / 100})`;
        netFill.style.transform = `scaleX(${stats.net / 100})`;
        
        // Update values with animation
        animateValue(cpuValue, parseInt(cpuValue.textContent), Math.round(stats.cpu), '%');
        animateValue(ramValue, parseInt(ramValue.textContent), Math.round(stats.ram), '%');
        animateValue(netValue, parseInt(netValue.textContent), Math.round(stats.net), '%');
    }
    
    function animateValue(element, start, end, suffix) {
        const duration = 1000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentValue = Math.round(start + (end - start) * progress);
            
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Auto-update stats every 5 seconds
    setInterval(() => {
        stats.cpu += (Math.random() - 0.5) * 10;
        stats.ram += (Math.random() - 0.5) * 8;
        stats.net += (Math.random() - 0.5) * 12;
        
        // Keep values in reasonable ranges
        stats.cpu = Math.max(40, Math.min(95, stats.cpu));
        stats.ram = Math.max(30, Math.min(85, stats.ram));
        stats.net = Math.max(50, Math.min(99, stats.net));
        
        updateStats();
    }, 5000);
    
    // Initial update
    updateStats();
}

// Enhanced Scroll Animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .counter, .contact-item');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Utility Functions
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '16px 24px';
    notification.style.borderRadius = '8px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '10000';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease-out';
    notification.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #32B8C6, #45A6B2)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #C0152F, #FF5459)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Main animation loop
function animate() {
    if (isLoaded) {
        updateFloatingElements();
    }
    
    animationId = requestAnimationFrame(animate);
}

function updateFloatingElements() {
    const floatingElements = document.querySelectorAll('.project-card, .timeline-item');
    
    floatingElements.forEach((element, index) => {
        const time = Date.now() * 0.001;
        const offset = index * 0.5;
        
        // Subtle floating animation
        const y = Math.sin(time + offset) * 2;
        const rotation = Math.sin(time * 0.3 + offset) * 1;
        
        // Only apply if element doesn't have manual transforms
        if (!element.style.transform.includes('scale')) {
            element.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;
        }
    });
}

// Enhanced Keyboard navigation
document.addEventListener('keydown', (e) => {
    const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    
    if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        e.preventDefault();
        navigateToSection(sections[currentIndex + 1]);
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        navigateToSection(sections[currentIndex - 1]);
    } else if (e.key >= '1' && e.key <= '5') {
        // Number keys for direct navigation
        e.preventDefault();
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
            navigateToSection(sections[sectionIndex]);
        }
    }
});

function navigateToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const navBarHeight = document.querySelector('.main-navigation').offsetHeight;
        const offset = navBarHeight + 20;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
        });
        
        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        showNotification(`Navigated to ${sectionId.toUpperCase()}`, 'success');
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('.section');
    const navBarHeight = document.querySelector('.main-navigation').offsetHeight;
    const scrollPosition = window.scrollY + navBarHeight + 100;
    
    let currentSection = 'about'; // Default fallback
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            currentSection = section.id;
        }
    });
    
    return currentSection;
}

// Performance optimization
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

// Window resize handler
window.addEventListener('resize', debounce(() => {
    // Reinitialize particles with new window dimensions
    particles.forEach(particle => {
        if (particle.x > window.innerWidth) particle.x = window.innerWidth;
        if (particle.y > window.innerHeight) particle.y = window.innerHeight;
    });
    
    // Redraw skills radar
    const canvas = document.getElementById('skills-canvas');
    if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initializeSkillsRadar();
    }
}, 250));

// Add CSS for active nav item state and animations
const style = document.createElement('style');
style.textContent = `
    .nav-item.active {
        color: var(--color-teal-300) !important;
        text-shadow: 0 0 10px rgba(50, 184, 198, 0.5) !important;
        transform: translateY(-2px);
    }
    
    .nav-item.active::before {
        opacity: 1 !important;
    }
    
    .animate-in {
        animation: textReveal 0.6s ease-out forwards;
    }
    
    .nav-item:focus {
        outline: 2px solid var(--color-teal-300);
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// Easter eggs - Konami Code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Matrix rain effect
    const matrix = document.createElement('div');
    matrix.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        pointer-events: none;
    `;
    
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    matrix.appendChild(canvas);
    document.body.appendChild(matrix);
    
    const ctx = canvas.getContext('2d');
    const chars = 'EMBEDDED01FIRMWARE10RTOS01HARDWARE10';
    const charArray = chars.split('');
    const columns = canvas.width / 20;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#32B8C6';
        ctx.font = '20px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * 20, drops[i] * 20);
            
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    const matrixInterval = setInterval(drawMatrix, 35);
    
    setTimeout(() => {
        clearInterval(matrixInterval);
        matrix.remove();
        showNotification('System Matrix Mode Activated! 🔥', 'success');
    }, 5000);
}