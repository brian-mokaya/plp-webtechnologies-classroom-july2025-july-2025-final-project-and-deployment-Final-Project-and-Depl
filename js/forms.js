/* ===== FORMS JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFormValidation();
    initializeFormAnimations();
    initializeFormAccessibility();
});

/* ===== CONTACT FORM INITIALIZATION ===== */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    const formFields = contactForm.querySelectorAll('.form__input, .form__select, .form__textarea');
    const submitButton = contactForm.querySelector('.form__submit');
    const successMessage = document.getElementById('form-success');
    
    // Real-time validation
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            submitForm();
        } else {
            showFormError('Please correct the errors below.');
        }
    });
    
    // Auto-resize textarea
    const textarea = contactForm.querySelector('.form__textarea');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
}

/* ===== FORM VALIDATION ===== */
function initializeFormValidation() {
    // Add validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid name (2-50 characters, letters only)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: false,
            pattern: /^[\+]?[1-9][\d]{0,15}$/,
            message: 'Please enter a valid phone number'
        },
        'project-type': {
            required: true,
            message: 'Please select a project type'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'Please enter a message (10-1000 characters)'
        }
    };
    
    // Store validation rules globally
    window.formValidationRules = validationRules;
}

function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const rules = window.formValidationRules[fieldName];
    
    if (!rules) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (rules.required && !fieldValue) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required`;
    }
    
    // Pattern validation
    if (isValid && fieldValue && rules.pattern && !rules.pattern.test(fieldValue)) {
        isValid = false;
        errorMessage = rules.message;
    }
    
    // Length validation
    if (isValid && fieldValue) {
        if (rules.minLength && fieldValue.length < rules.minLength) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} must be at least ${rules.minLength} characters`;
        }
        
        if (rules.maxLength && fieldValue.length > rules.maxLength) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} must be no more than ${rules.maxLength} characters`;
        }
    }
    
    // Show/hide error
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function validateForm() {
    const form = document.getElementById('contact-form');
    const fields = form.querySelectorAll('.form__input, .form__select, .form__textarea');
    
    let isFormValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
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

/* ===== FORM SUBMISSION ===== */
async function submitForm() {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('.form__submit');
    const submitText = submitButton.querySelector('.form__submit-text');
    const submitLoading = submitButton.querySelector('.form__submit-loading');
    const successMessage = document.getElementById('form-success');
    
    // Show loading state
    submitButton.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline';
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API call (replace with actual endpoint)
        await simulateFormSubmission(data);
        
        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successMessage.style.display = 'none';
        }, 5000);
        
        // Track form submission
        trackFormSubmission(data);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormError('Sorry, there was an error submitting your message. Please try again.');
    } finally {
        // Hide loading state
        submitButton.disabled = false;
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
    }
}

function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate random success/failure for demo
            if (Math.random() > 0.1) { // 90% success rate
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
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

function trackFormSubmission(data) {
    // Track form submission (integrate with analytics)
    console.log('Form submitted:', data);
    
    // Example: gtag('event', 'form_submit', {
    //     'form_name': 'contact_form',
    //     'project_type': data['project-type'],
    //     'budget': data.budget
    // });
}

/* ===== FORM ANIMATIONS ===== */
function initializeFormAnimations() {
    const formFields = document.querySelectorAll('.form__field');
    
    // Animate form fields on focus
    formFields.forEach((field, index) => {
        const input = field.querySelector('.form__input, .form__select, .form__textarea');
        
        if (input) {
            // Stagger animation on load
            field.style.opacity = '0';
            field.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                field.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                field.style.opacity = '1';
                field.style.transform = 'translateY(0)';
            }, index * 100);
            
            // Focus animations
            input.addEventListener('focus', function() {
                field.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    field.classList.remove('focused');
                }
            });
        }
    });
}

/* ===== FORM ACCESSIBILITY ===== */
function initializeFormAccessibility() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    // Add ARIA attributes
    form.setAttribute('aria-label', 'Contact form');
    
    const fields = form.querySelectorAll('.form__input, .form__select, .form__textarea');
    
    fields.forEach(field => {
        const label = document.querySelector(`label[for="${field.id}"]`);
        
        if (label) {
            // Ensure proper labeling
            field.setAttribute('aria-labelledby', label.id || `${field.id}-label`);
            
            // Add required indicator
            if (field.hasAttribute('required')) {
                const requiredText = document.createElement('span');
                requiredText.textContent = ' (required)';
                requiredText.className = 'sr-only';
                label.appendChild(requiredText);
            }
        }
        
        // Add error handling
        field.setAttribute('aria-describedby', `${field.name}-error`);
    });
    
    // Add screen reader only class
    const srOnlyCSS = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = srOnlyCSS;
    document.head.appendChild(style);
}

/* ===== FORM ENHANCEMENTS ===== */
function initializeFormEnhancements() {
    // Auto-format phone number
    const phoneField = document.querySelector('input[name="phone"]');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            this.value = value;
        });
    }
    
    // Character counter for textarea
    const messageField = document.querySelector('textarea[name="message"]');
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
    
    // Form progress indicator
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
    
    const form = document.getElementById('contact-form');
    if (form) {
        form.insertBefore(progressBar, form.firstChild);
        
        // Update progress on field completion
        const fields = form.querySelectorAll('.form__input, .form__select, .form__textarea');
        fields.forEach(field => {
            field.addEventListener('blur', updateFormProgress);
        });
    }
    
    function updateFormProgress() {
        const completedFields = Array.from(fields).filter(field => {
            if (field.hasAttribute('required')) {
                return field.value.trim() !== '';
            }
            return true;
        });
        
        const progress = (completedFields.length / fields.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

/* ===== FORM VALIDATION STYLES ===== */
function addFormValidationStyles() {
    const validationCSS = `
        .form__input.error,
        .form__select.error,
        .form__textarea.error {
            border-color: var(--danger-color);
            box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
        }
        
        .form__field.focused .form__label {
            color: var(--primary-color);
            transform: translateY(-2px);
        }
        
        .form__error {
            display: none;
            color: var(--danger-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        .form__error:not(:empty) {
            display: block;
        }
        
        .form__submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .form__submit-loading {
            display: none;
        }
        
        .form-progress {
            margin-bottom: 2rem;
        }
        
        .form-char-counter {
            text-align: right;
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-top: 0.5rem;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = validationCSS;
    document.head.appendChild(style);
}

// Initialize all form features
document.addEventListener('DOMContentLoaded', function() {
    initializeFormEnhancements();
    addFormValidationStyles();
});

// Export form functions
window.FormUtils = {
    validateField,
    validateForm,
    submitForm,
    showFieldError,
    clearFieldError
};
