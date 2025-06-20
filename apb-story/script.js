// Chapter Navigation
let currentChapter = 1;

function showChapter(chapterNumber) {
    // Hide all chapters
    document.querySelectorAll('.chapter').forEach(chapter => {
        chapter.classList.add('hidden');
    });
    
    // Show selected chapter
    const targetChapter = document.getElementById(`chapter-${chapterNumber}`);
    if (targetChapter) {
        targetChapter.classList.remove('hidden');
        currentChapter = chapterNumber;
    }
    
    // Update chapter navigation active state
    updateChapterNavigation(chapterNumber);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update progress
    updateProgress();
}

function updateChapterNavigation(activeChapter) {
    // Update chapter navigation buttons
    document.querySelectorAll('.chapter-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-chapter') == activeChapter) {
            btn.classList.add('active');
        }
    });
}

function showCheatSheet() {
    // Hide all chapters
    document.querySelectorAll('.chapter').forEach(chapter => {
        chapter.classList.add('hidden');
    });
    
    // Show cheat sheet
    const cheatSheet = document.getElementById('cheat-sheet');
    if (cheatSheet) {
        cheatSheet.classList.remove('hidden');
    }
    
    // Update navigation
    updateChapterNavigation('cheat');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function restartStory() {
    showChapter(1);
    // Reset any interactive elements
    const hasTitle = document.getElementById('has-title');
    const isEditMode = document.getElementById('is-edit-mode');
    if (hasTitle) hasTitle.checked = true;
    if (isEditMode) isEditMode.checked = false;
    updateConditionalDemo();
}

// Mode Switching Demo (Chapter 2)
function switchMode(mode) {
    const buttons = document.querySelectorAll('.mode-btn');
    const output = document.getElementById('demo-output');
    
    // Update button states
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update output based on mode
    if (mode === 'edit') {
        output.innerHTML = '<h1 data-sq-field="title" class="edit-mode-element">Welcome to Our Amazing Site</h1>';
        output.classList.add('edit-mode');
        
        // Add visual edit indicators
        setTimeout(() => {
            const editElement = output.querySelector('[data-sq-field]');
            if (editElement) {
                editElement.style.border = '2px dashed #4facfe';
                editElement.style.background = 'rgba(79, 172, 254, 0.1)';
                editElement.style.position = 'relative';
                
                // Add edit indicator
                const indicator = document.createElement('div');
                indicator.innerHTML = '✏️ Editable';
                indicator.style.cssText = `
                    position: absolute;
                    top: -25px;
                    left: 0;
                    background: #4facfe;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 3px;
                    font-size: 0.8rem;
                    font-weight: 500;
                `;
                editElement.style.position = 'relative';
                editElement.appendChild(indicator);
            }
        }, 100);
    } else {
        output.innerHTML = '<h1>Welcome to Our Amazing Site</h1>';
        output.classList.remove('edit-mode');
    }
}

// Conditional Demo (Chapter 4)
function updateConditionalDemo() {
    const hasTitle = document.getElementById('has-title').checked;
    const isEditMode = document.getElementById('is-edit-mode').checked;
    const demo = document.getElementById('conditional-demo');
    
    let content = '';
    
    if (hasTitle) {
        if (isEditMode) {
            content = '<h1 data-sq-field="title" style="border: 2px dashed #4facfe; background: rgba(79, 172, 254, 0.1); padding: 10px;">Sample Title</h1>';
        } else {
            content = '<h1>Sample Title</h1>';
        }
    } else {
        if (isEditMode) {
            content = '<h1 data-sq-field="title" class="placeholder" style="border: 2px dashed #4facfe; background: rgba(79, 172, 254, 0.1); padding: 10px; color: #6c757d; font-style: italic;">Add a title</h1>';
        } else {
            content = '<div style="color: #6c757d; font-style: italic; text-align: center; padding: 20px;">No content to display</div>';
        }
    }
    
    demo.innerHTML = content;
    
    // Add edit mode class for styling
    if (isEditMode) {
        demo.classList.add('edit-mode');
    } else {
        demo.classList.remove('edit-mode');
    }
}

// Tab Switching (Chapter 6)
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Code Animation Effects
function animateCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.code-example');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInFromLeft 0.6s ease-out';
            }
        });
    });
    
    codeBlocks.forEach(block => {
        observer.observe(block);
    });
}

// Wisdom Card Hover Effects
function initWisdomCards() {
    const wisdomCards = document.querySelectorAll('.wisdom-card');
    
    wisdomCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Interactive Code Examples
function initInteractiveCode() {
    const codeExamples = document.querySelectorAll('.code-example code');
    
    codeExamples.forEach(code => {
        code.addEventListener('click', function() {
            // Copy to clipboard
            navigator.clipboard.writeText(this.textContent).then(() => {
                // Show feedback
                const feedback = document.createElement('div');
                feedback.textContent = 'Copied!';
                feedback.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #27ae60;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    z-index: 1000;
                    animation: fadeInOut 2s ease-in-out;
                `;
                document.body.appendChild(feedback);
                
                setTimeout(() => {
                    document.body.removeChild(feedback);
                }, 2000);
            });
        });
    });
}

// Keyboard Navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            if (currentChapter < 7) {
                showChapter(currentChapter + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentChapter > 1) {
                showChapter(currentChapter - 1);
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            showChapter(1);
        } else if (e.key === 'End') {
            e.preventDefault();
            showChapter(7);
        }
    });
}

// Progress Indicator
function createProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        z-index: 1000;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.cssText = `
        height: 100%;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        width: 0%;
        transition: width 0.3s ease;
    `;
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    // Update progress based on current chapter
    function updateProgress() {
        const progress = (currentChapter / 7) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    // Initial update
    updateProgress();
    
    // Update on chapter change
    const originalShowChapter = showChapter;
    showChapter = function(chapterNumber) {
        originalShowChapter(chapterNumber);
        updateProgress();
    };
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const buttons = document.querySelectorAll('.next-chapter, .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Easter Eggs
function initEasterEggs() {
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Easter egg activated!
            document.body.style.animation = 'rainbow 2s infinite';
            
            const message = document.createElement('div');
            message.innerHTML = '🎉 You found the secret! You\'re a true Page Builder master! 🎉';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 40px;
                border-radius: 15px;
                font-size: 1.2rem;
                font-weight: bold;
                z-index: 10000;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: bounce 1s infinite;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                document.body.removeChild(message);
                document.body.style.animation = '';
            }, 3000);
            
            konamiCode = [];
        }
    });
}

// Add CSS animations
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
        
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translate(-50%, -50%) translateY(0); }
            40% { transform: translate(-50%, -50%) translateY(-10px); }
            60% { transform: translate(-50%, -50%) translateY(-5px); }
        }
        
        .code-example:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
        
        .next-chapter:active {
            transform: translateY(-1px) scale(0.98);
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    animateCodeBlocks();
    initWisdomCards();
    initInteractiveCode();
    initKeyboardNavigation();
    createProgressIndicator();
    initSmoothScrolling();
    initEasterEggs();
    addAnimations();
    
    // Set initial state
    updateConditionalDemo();
    
    // Add welcome message
    console.log(`
    🎉 Welcome to the Page Builder Journey! 🎉
    
    Navigation Tips:
    • Use arrow keys to navigate chapters
    • Press Home to go to the beginning
    • Press End to go to the final chapter
    • Click code examples to copy them
    • Try the Konami code for a surprise! ⬆⬆⬇⬇⬅➡⬅➡BA
    
    Happy learning! 🚀
    `);
    
    // Show first chapter
    showChapter(1);
});

// Export functions for global access
window.showChapter = showChapter;
window.switchMode = switchMode;
window.updateConditionalDemo = updateConditionalDemo;
window.showTab = showTab;
window.showCheatSheet = showCheatSheet;
window.restartStory = restartStory; 