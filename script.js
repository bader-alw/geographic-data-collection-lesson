// ============================================
// Navigation and Smooth Scrolling
// ============================================

const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Handle hamburger menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// Scroll to Section Function
// ============================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// Activities and Interactive Features
// ============================================

// Submit Activity
function submitActivity(activityId) {
    const inputs = document.querySelectorAll(`#${activityId} input[type="text"]`);
    let allFilled = true;

    inputs.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
            input.style.borderColor = '#dc3545';
            input.style.backgroundColor = '#fff5f5';
        } else {
            input.style.borderColor = '#28a745';
            input.style.backgroundColor = '#f5fff5';
        }
    });

    if (!allFilled) {
        showAlert('⚠️ الرجاء ملء جميع الحقول!', 'warning');
        return;
    }

    const filled = Array.from(inputs).filter(i => i.value.trim() !== '').length;
    showAlert(`✅ تم حفظ الإجابات بنجاح!\nعدد الإجابات: ${filled}/${inputs.length}`, 'success');
    
    // Save to localStorage
    saveActivityData(activityId, inputs);
}

// Save Activity Data to LocalStorage
function saveActivityData(activityId, inputs) {
    const data = {
        activityId: activityId,
        timestamp: new Date().toLocaleString('ar-SA'),
        answers: Array.from(inputs).map(input => input.value)
    };
    
    const savedActivities = JSON.parse(localStorage.getItem('activities') || '[]');
    savedActivities.push(data);
    localStorage.setItem('activities', JSON.stringify(savedActivities));
}

// ============================================
// Quiz Functions
// ============================================

function submitQuiz() {
    let score = 0;
    const totalQuestions = 3;
    let feedback = '';

    // Question 1: Radio button
    const q1Answer = document.querySelector('input[name="q1"]:checked');
    const q1Options = document.querySelectorAll('input[name="q1"]');
    
    if (q1Answer) {
        if (q1Answer === q1Options[1]) { // محطة العمل المتكاملة
            score++;
            feedback += '✅ السؤال 1: صحيح! محطة العمل المتكاملة هي أداة حديثة\n';
        } else {
            feedback += '❌ السؤال 1: الإجابة الصحيحة هي "محطة العمل المتكاملة"\n';
        }
    } else {
        feedback += '⚠️ السؤال 1: لم تختر إجابة\n';
    }

    // Question 2: Text input
    const q2Input = document.getElementById('q2');
    const q2Value = q2Input.value.trim().toLowerCase().replace(/\s+/g, '');
    
    if (q2Value === 'ol1' || q2Value === 'ol-1' || q2Value === 'omansatol1') {
        score++;
        feedback += '✅ السؤال 2: صحيح! اسم القمر الصناعي العماني هو OL-1\n';
    } else {
        feedback += '❌ السؤال 2: الإجابة الصحيحة هي "OL-1"\n';
    }

    // Question 3: Checkboxes
    const q3Checkboxes = document.querySelectorAll('.quiz-question')[2].querySelectorAll('input[type="checkbox"]');
    let q3CorrectCount = 0;
    let allAnswersCorrect = true;

    q3Checkboxes.forEach((checkbox, index) => {
        if (index === 3) { // "جميع ما سبق"
            if (checkbox.checked) {
                q3CorrectCount++;
            } else {
                allAnswersCorrect = false;
            }
        } else {
            if (checkbox.checked) {
                allAnswersCorrect = false;
            }
        }
    });

    if (allAnswersCorrect && q3CorrectCount === 1) {
        score++;
        feedback += '✅ السؤال 3: صحيح! جميع الخيارات السابقة من فوائد الذكاء الاصطناعي\n';
    } else {
        feedback += '❌ السؤال 3: الإجابة الصحيحة هي "جميع ما سبق"\n';
    }

    // Display results
    const resultDiv = document.getElementById('quiz-result');
    const percentage = Math.round((score / totalQuestions) * 100);
    
    resultDiv.classList.add('show');
    
    let resultHTML = '';
    if (score === totalQuestions) {
        resultDiv.classList.remove('error');
        resultDiv.classList.add('success');
        resultHTML = `
            <h3>🎉 تهانينا! لقد نجحت في الاختبار!</h3>
            <p><strong>النتيجة: ${score}/${totalQuestions} (${percentage}%)</strong></p>
            <div style="margin-top: 15px; text-align: right;">${feedback.replace(/\n/g, '<br>')}</div>
        `;
    } else if (score >= 2) {
        resultDiv.classList.remove('error');
        resultDiv.classList.add('success');
        resultHTML = `
            <h3>👍 أداء جيد!</h3>
            <p><strong>النتيجة: ${score}/${totalQuestions} (${percentage}%)</strong></p>
            <div style="margin-top: 15px; text-align: right;">${feedback.replace(/\n/g, '<br>')}</div>
        `;
    } else {
        resultDiv.classList.remove('success');
        resultDiv.classList.add('error');
        resultHTML = `
            <h3>📚 يُرجى مراجعة الدرس</h3>
            <p><strong>النتيجة: ${score}/${totalQuestions} (${percentage}%)</strong></p>
            <div style="margin-top: 15px; text-align: right;">${feedback.replace(/\n/g, '<br>')}</div>
        `;
    }
    
    resultDiv.innerHTML = resultHTML;

    // Save quiz result
    saveQuizResult(score, totalQuestions, percentage);

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Save Quiz Result
function saveQuizResult(score, total, percentage) {
    const result = {
        timestamp: new Date().toLocaleString('ar-SA'),
        score: score,
        total: total,
        percentage: percentage
    };
    
    const savedResults = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    savedResults.push(result);
    localStorage.setItem('quiz-results', JSON.stringify(savedResults));
}

// ============================================
// Alert Function
// ============================================

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 20px;
        border-radius: 5px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;

    if (type === 'success') {
        alertDiv.style.background = '#d4edda';
        alertDiv.style.color = '#155724';
        alertDiv.style.border = '2px solid #28a745';
    } else if (type === 'error') {
        alertDiv.style.background = '#f8d7da';
        alertDiv.style.color = '#721c24';
        alertDiv.style.border = '2px solid #dc3545';
    } else if (type === 'warning') {
        alertDiv.style.background = '#fff3cd';
        alertDiv.style.color = '#856404';
        alertDiv.style.border = '2px solid #ffc107';
    }

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

// ============================================
// Contact Form
// ============================================

function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;

    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
        showAlert('⚠️ الرجاء ملء جميع الحقول!', 'warning');
        return;
    }

    // Save to localStorage
    const contactData = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toLocaleString('ar-SA')
    };

    const savedContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    savedContacts.push(contactData);
    localStorage.setItem('contacts', JSON.stringify(savedContacts));

    showAlert(`✅ شكراً ${name}!\nتم استقبال رسالتك بنجاح`, 'success');
    form.reset();
}

// ============================================
// Animations and Scroll Effects
// ============================================

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and content boxes
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.lesson-card, .activity-card, .resource-card, .content-box').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Add animation styles if not already in CSS
    if (!document.querySelector('style[data-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-animations', 'true');
        style.textContent = `
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

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
});

// ============================================
// Interactive Elements Enhancement
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Card hover effects
    document.querySelectorAll('.lesson-card, .activity-card, .resource-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        });
    });

    // Input focus effects
    document.querySelectorAll('input[type="text"], textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            if (this.value) {
                this.style.borderColor = '#28a745';
            } else {
                this.style.borderColor = '#ddd';
            }
            this.style.boxShadow = 'none';
        });
    });
});

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showAlert('💾 تم حفظ البيانات بنجاح', 'success');
    }
    
    // Escape to close alerts
    if (e.key === 'Escape') {
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
    }
});

// ============================================
// Progress Tracking
// ============================================

function getProgressPercentage() {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]').length;
    const quizzes = JSON.parse(localStorage.getItem('quiz-results') || '[]').length;
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]').length;
    
    const totalActivities = 3; // المقارنة، البحث، الاختبار
    const completed = Math.min(activities, 1) + Math.min(quizzes, 1) + Math.min(contacts, 1);
    
    return Math.round((completed / totalActivities) * 100);
}

// ============================================
// Console Logs
// ============================================

console.log('%c🌍 جمع البيانات الجغرافية', 'color: #667eea; font-size: 18px; font-weight: bold;');
console.log('%c👨‍🏫 المعلم: أ. بدر الوهيبي', 'color: #764ba2; font-size: 14px;');
console.log('%c📚 نسخة الدرس: 1.0', 'color: #f5576c; font-size: 12px;');
console.log('%c✅ الدرس التفاعلي جاهز للاستخدام', 'color: #28a745; font-size: 12px;');

// ============================================
// Print Functionality
// ============================================

function printLesson() {
    window.print();
}

// ============================================
// Download Results
// ============================================

function downloadResults() {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const quizResults = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');

    const data = {
        lesson: 'جمع البيانات الجغرافية',
        instructor: 'أ. بدر الوهيبي',
        downloadDate: new Date().toLocaleString('ar-SA'),
        progress: getProgressPercentage(),
        activities: activities,
        quizResults: quizResults,
        contacts: contacts
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `geographic-lesson-results-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('📥 تم تحميل النتائج بنجاح', 'success');
}

// ============================================
// Dark Mode Toggle
// ============================================

let isDarkMode = false;

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#e0e0e0';
        document.querySelectorAll('section, .content-wrapper').forEach(el => {
            el.style.backgroundColor = '#2d2d2d';
            el.style.color = '#e0e0e0';
        });
        localStorage.setItem('darkMode', 'true');
        showAlert('🌙 تم تفعيل الوضع الليلي', 'success');
    } else {
        document.body.style.backgroundColor = '#fff';
        document.body.style.color = '#333';
        document.querySelectorAll('section, .content-wrapper').forEach(el => {
            el.style.backgroundColor = 'white';
            el.style.color = '#333';
        });
        localStorage.setItem('darkMode', 'false');
        showAlert('☀️ تم تفعيل الوضع النهاري', 'success');
    }
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
    }
});

// ============================================
// Performance Monitoring
// ============================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⏱️ وقت تحميل الصفحة: ${pageLoadTime}ms`);
    });
}