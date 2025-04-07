// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.classList.toggle('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        
                        // Reset hamburger
                        const spans = hamburger.querySelectorAll('span');
                        spans.forEach(span => {
                            span.classList.remove('active');
                        });
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Reveal animations for sections
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = function() {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on initial load
    
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showFormMessage('Please fill out all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate sending data (in a real app, this would be an API call)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading"></span> Sending...';
            
            // Simulate delay for API call
            setTimeout(function() {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // Clear form
                contactForm.reset();
                
                // Show success message
                showFormMessage('Thank you! Your message has been sent successfully.', 'success');
            }, 1500);
        });
    }
    
    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Function to show form status message
    function showFormMessage(message, type) {
        let messageElement = document.querySelector('.form-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            contactForm.appendChild(messageElement);
        }
        
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        
        // Auto-hide message after 5 seconds
        setTimeout(function() {
            messageElement.textContent = '';
            messageElement.className = 'form-message';
        }, 5000);
    }
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.8)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const offset = window.pageYOffset;
            hero.style.backgroundPositionY = offset * 0.5 + 'px';
        });
    }
    
    // Initialize animated counters
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    let count = 0;
                    const updateCounter = () => {
                        const increment = target / 100;
                        if (count < target) {
                            count += increment;
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCounter, 15);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
});

// Chatbot Functionality
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Function to add a message to the chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to handle user input
async function handleUserInput() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';

    try {
        // Here you would integrate with the Gemini API
        // For now, we'll use a simple response
        const response = await getBotResponse(message);
        addMessage(response);
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I encountered an error. Please try again.');
    }
}

// Event listeners for sending messages
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Placeholder function for Gemini API integration
async function getBotResponse(message) {
    // This is where you would integrate with the Gemini API
    // For now, we'll return a simple response
    const responses = [
        "Here's a tip for sustainable living: Try using reusable shopping bags instead of plastic ones!",
        "Did you know? Turning off lights when leaving a room can save significant energy.",
        "Consider starting a small herb garden in your kitchen window for fresh, local produce!",
        "Using public transportation or carpooling is a great way to reduce your carbon footprint.",
        "Try to reduce food waste by planning meals and storing leftovers properly.",
        "Using LED bulbs instead of traditional ones can save up to 80% more energy.",
        "Consider installing a rain barrel to collect water for your garden.",
        "Try to buy products with minimal packaging to reduce waste.",
        "Using a programmable thermostat can help save energy when you're not home.",
        "Consider starting a compost bin for your food scraps and yard waste."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

// Smooth Scrolling for Navigation Links
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

// Add scroll event listener for navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
    } else {
        navbar.style.backgroundColor = 'var(--dark-color)';
    }
}); 