// Navigation Active Link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Smooth scroll update active link
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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
});

// Activity: Check Comparison
function checkComparison() {
    const inputs = document.querySelectorAll('.comparison-table input[type="text"]');
    let allFilled = true;
    let score = 0;

    // Expected answers (simplified checking)
    const expectedAnswers = [
        ['قياس المسافات والارتفاعات والزوايا', 'الصور الجوية والفضائية'],
        ['شريط القياس والبوصلة والميزان', 'الأقمار الاصطناعية والطائرات والبالون']
    ];

    inputs.forEach((input, index) => {
        if (input.value.trim() === '') {
            allFilled = false;
            input.style.borderColor = '#f5576c';
        } else {
            input.style.borderColor = '#28a745';
            score++;
        }
    });

    if (!allFilled) {
        alert('⚠️ الرجاء ملء جميع الحقول!');
        return;
    }

    const message = `✅ شكراً لك! لقد أكملت المقارنة بنجاح!\n\nعدد الإجابات: ${score}/${inputs.length}`;
    alert(message);
}

// Activity: Save Research
function saveResearch() {
    const year = document.querySelector('.research-elements .element input').value;
    const features = document.querySelectorAll('.research-elements textarea')[0].value;
    const uses = document.querySelectorAll('.research-elements textarea')[1].value;

    if (!year || !features || !uses) {
        alert('⚠️ الرجاء ملء جميع الحقول!');
        return;
    }

    const researchData = {
        satellite: 'OL-1',
        year: year,
        features: features,
        uses: uses,
        date: new Date().toLocaleDateString('ar-SA')
    };

    // Save to localStorage
    localStorage.setItem('researchData_' + Date.now(), JSON.stringify(researchData));

    alert(`✅ تم حفظ البطاقة بنجاح!\n\nاسم القمر: ${researchData.satellite}\nسنة الإطلاق: ${researchData.year}\nتاريخ الحفظ: ${researchData.date}`);

    // Clear form
    document.querySelector('.research-elements .element input').value = '';
    document.querySelectorAll('.research-elements textarea')[0].value = '';
    document.querySelectorAll('.research-elements textarea')[1].value = '';
}

// Quiz: Submit Quiz
function submitQuiz() {
    let score = 0;
    const totalQuestions = 3;
    let feedback = '';

    // Question 1: Radio button
    const q1Answer = document.querySelector('input[name="q1"]:checked');
    if (q1Answer) {
        // Check if correct answer (المسح الأرضي - second option)
        const q1Options = document.querySelectorAll('input[name="q1"]');
        if (q1Answer === q1Options[1]) {
            score++;
            feedback += '✅ السؤال 1: صحيح!\n';
        } else {
            feedback += '❌ السؤال 1: الإجابة الصحيحة هي "المسح الأرضي"\n';
        }
    } else {
        feedback += '⚠️ السؤال 1: لم تختر إجابة\n';
    }

    // Question 2: Checkboxes
    const q2Checkboxes = document.querySelectorAll('input[name*="q2"], input[type="checkbox"]');
    let q2Correct = 0;
    
    const q2Options = Array.from(document.querySelectorAll('.quiz-question')[1].querySelectorAll('input[type="checkbox"]'));
    q2Options.forEach((checkbox, index) => {
        if (checkbox.checked) {
            if (index === 3) { // "جميع ما سبق" is correct
                q2Correct++;
            }
        }
    });

    if (q2Correct > 0 && q2Options[3].checked) {
        score++;
        feedback += '✅ السؤال 2: صحيح!\n';
    } else {
        feedback += '❌ السؤال 2: الإجابة الصحيحة هي "جميع ما سبق"\n';
    }

    // Question 3: Text input
    const q3Input = document.querySelectorAll('.quiz-input')[0];
    const q3Answer = q3Input.value.trim().toLowerCase();
    
    if (q3Answer === 'ol-1' || q3Answer === 'ol1' || q3Answer === 'ol - 1') {
        score++;
        feedback += '✅ السؤال 3: صحيح!\n';
    } else {
        feedback += '❌ السؤال 3: الإجابة الصحيحة هي "OL-1"\n';
    }

    // Display results
    const resultDiv = document.getElementById('quiz-result');
    const percentage = Math.round((score / totalQuestions) * 100);
    
    resultDiv.classList.add('show');
    
    if (score === totalQuestions) {
        resultDiv.classList.remove('error');
        resultDiv.classList.add('success');
        resultDiv.innerHTML = `
            🎉 تهانينا! لقد نجحت في الاختبار!<br>
            النتيجة: ${score}/${totalQuestions} (${percentage}%)<br><br>
            ${feedback.replace(/\n/g, '<br>')}
        `;
    } else if (score >= 2) {
        resultDiv.classList.remove('error');
        resultDiv.classList.add('success');
        resultDiv.innerHTML = `
            👍 أداء جيد!<br>
            النتيجة: ${score}/${totalQuestions} (${percentage}%)<br><br>
            ${feedback.replace(/\n/g, '<br>')}
        `;
    } else {
        resultDiv.classList.remove('success');
        resultDiv.classList.add('error');
        resultDiv.innerHTML = `
            📚 يُرجى مراجعة الدرس<br>
            النتيجة: ${score}/${totalQuestions} (${percentage}%)<br><br>
            ${feedback.replace(/\n/g, '<br>')}
        `;
    }

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add animation on scroll
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

document.querySelectorAll('.section, .activity').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add animation styles
const style = document.createElement('style');
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
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .btn {
        animation: slideIn 0.5s ease;
    }
`;
document.head.appendChild(style);

// Interactive elements enhancement
document.querySelectorAll('.method-card, .benefit-card, .survey-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Form input validation
document.querySelectorAll('input[type="text"], textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
        this.style.boxShadow = '0 0 8px rgba(102, 126, 234, 0.2)';
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

// Print functionality
function printLesson() {
    window.print();
}

// Dark mode toggle (optional feature)
let isDarkMode = false;

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#e0e0e0';
        document.querySelectorAll('.section, .quiz-container').forEach(el => {
            el.style.backgroundColor = '#2d2d2d';
            el.style.color = '#e0e0e0';
        });
    } else {
        document.body.style.backgroundColor = '#f8f9fa';
        document.body.style.color = '#333';
        document.querySelectorAll('.section, .quiz-container').forEach(el => {
            el.style.backgroundColor = 'white';
            el.style.color = '#333';
        });
    }
}

// Download activity results
function downloadResults() {
    const data = {
        lesson: 'جمع البيانات الجغرافية',
        instructor: 'أ. بدر الوهيبي',
        date: new Date().toLocaleDateString('ar-SA'),
        time: new Date().toLocaleTimeString('ar-SA'),
        saved_research: JSON.parse(localStorage.getItem('researchData') || '{}')
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lesson-results-${Date.now()}.json`;
    link.click();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printLesson();
    }
    
    // Ctrl/Cmd + D for dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
    }
});

// Progress tracking
function updateProgress() {
    const activities = document.querySelectorAll('.activity');
    let completed = 0;

    document.querySelectorAll('input[type="text"], textarea').forEach(input => {
        if (input.value.trim()) {
            completed++;
        }
    });

    const progress = Math.round((completed / (activities.length * 3)) * 100);
    console.log(`📊 Progress: ${progress}%`);
}

// Update progress on input change
document.querySelectorAll('input[type="text"], textarea').forEach(input => {
    input.addEventListener('input', updateProgress);
});

// Logger for debugging
console.log('✅ Geographic Data Collection Lesson - Loaded Successfully');
console.log('👨‍🏫 Instructor: أ. بدر الوهيبي');
console.log('📚 Topic: جمع البيانات الجغرافية');
console.log('🎯 Features: Interactive activities, quiz, research project');