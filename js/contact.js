/* ===== CONTACT PAGE JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializeFAQ();
    initializeContactForm();
    initializeContactAnimations();
});

/* ===== FAQ ACCORDION ===== */
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

/* ===== CONTACT FORM ENHANCEMENTS ===== */
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const formFields = form.querySelectorAll('.form__input, .form__select, .form__textarea');
    
    // Add floating label effect
    formFields.forEach(field => {
        const label = document.querySelector(`label[for="${field.id}"]`);
        
        if (label) {
            // Check if field has value on load
            if (field.value.trim() !== '') {
                label.classList.add('floating');
            }
            
            field.addEventListener('focus', function() {
                label.classList.add('floating');
            });
            
            field.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    label.classList.remove('floating');
                }
            });
            
            field.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    label.classList.add('floating');
                } else {
                    label.classList.remove('floating');
                }
            });
        }
    });
    
    // Add character counter for textarea
    const messageField = form.querySelector('textarea[name="message"]');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'form-char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-top: 0.5rem;
        `;
        
        messageField.parentNode.appendChild(counter);
        
        messageField.addEventListener('input', function() {
            const remaining = 1000 - this.value.length;
            counter.textContent = `${this.value.length}/1000 characters`;
            counter.style.color = remaining < 50 ? 'var(--danger-color)' : 'var(--text-muted)';
        });
    }
    
    // Add form progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'form-progress';
    progressBar.style.cssText = `
        height: 4px;
        background: var(--border-light);
        border-radius: 2px;
        margin-bottom: 2rem;
        overflow: hidden;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.className = 'form-progress-fill';
    progressFill.style.cssText = `
        height: 100%;
        background: var(--primary-color);
        width: 0%;
        transition: width 0.3s ease;
    `;
    
    progressBar.appendChild(progressFill);
    form.insertBefore(progressBar, form.firstChild);
    
    // Update progress on field completion
    formFields.forEach(field => {
        field.addEventListener('blur', updateFormProgress);
    });
    
    function updateFormProgress() {
        const completedFields = Array.from(formFields).filter(field => {
            if (field.hasAttribute('required')) {
                return field.value.trim() !== '';
            }
            return true;
        });
        
        const progress = (completedFields.length / formFields.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

/* ===== CONTACT ANIMATIONS ===== */
function initializeContactAnimations() {
    // Animate contact methods on scroll
    const contactMethods = document.querySelectorAll('.contact__method');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                entry.target.style.animationDelay = `${Array.from(contactMethods).indexOf(entry.target) * 0.1}s`;
            }
        });
    }, { threshold: 0.1 });
    
    contactMethods.forEach(method => {
        method.style.opacity = '0';
        method.style.transform = 'translateY(30px)';
        observer.observe(method);
    });
    
    // Animate form fields
    const formFields = document.querySelectorAll('.form__field');
    formFields.forEach((field, index) => {
        field.style.opacity = '0';
        field.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            field.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            field.style.opacity = '1';
            field.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animate FAQ items
    const faqItems = document.querySelectorAll('.faq__item');
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, (index + formFields.length) * 100);
    });
}

/* ===== CONTACT FORM VALIDATION ===== */
function validateContactForm() {
    const form = document.getElementById('contact-form');
    const fields = form.querySelectorAll('.form__input, .form__select, .form__textarea');
    
    let isValid = true;
    
    fields.forEach(field => {
        if (field.hasAttribute('required') && field.value.trim() === '') {
            showFieldError(field, `${getFieldLabel(field)} is required`);
            isValid = false;
        } else if (field.type === 'email' && field.value.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        } else if (field.name === 'message' && field.value.trim().length < 10) {
            showFieldError(field, 'Message must be at least 10 characters long');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
}

function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

/* ===== CONTACT FORM SUBMISSION ===== */
async function submitContactForm() {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('.form__submit');
    const successMessage = document.getElementById('form-success');
    
    if (!validateContactForm()) {
        return false;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API call
        await simulateFormSubmission(data);
        
        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.classList.add('show');
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successMessage.style.display = 'none';
            successMessage.classList.remove('show');
        }, 5000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormError('Sorry, there was an error submitting your message. Please try again.');
    } finally {
        // Hide loading state
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
}

function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.1) {
                resolve(data);
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 2000);
    });
}

function showFormError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error-message';
    errorContainer.textContent = message;
    errorContainer.style.cssText = `
        background: var(--danger-color);
        color: var(--white);
        padding: 1rem;
        border-radius: var(--radius);
        margin-bottom: 1rem;
        text-align: center;
    `;
    
    const form = document.getElementById('contact-form');
    form.insertBefore(errorContainer, form.firstChild);
    
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

// Export functions for use in other modules
window.ContactUtils = {
    validateContactForm,
    submitContactForm,
    showFieldError,
    clearFieldError
};
