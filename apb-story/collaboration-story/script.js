// Global state
let currentPhase = 1;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePhaseNavigation();
    initializeMethodologySteps();
    initializeExampleTabs();
    initializeCopyButtons();
    initializeKeyboardNavigation();
    
    // Show first phase by default
    showPhase(1);
});

// Phase Navigation
function initializePhaseNavigation() {
    const markers = document.querySelectorAll('.phase-marker');
    markers.forEach(marker => {
        marker.addEventListener('click', function() {
            const phase = parseInt(this.dataset.phase);
            showPhase(phase);
        });
    });
}

function showPhase(phaseNumber) {
    // Hide all phases
    document.querySelectorAll('.phase').forEach(phase => {
        phase.classList.add('hidden');
    });
    
    // Show selected phase
    const targetPhase = document.getElementById(`phase-${phaseNumber}`);
    if (targetPhase) {
        targetPhase.classList.remove('hidden');
    }
    
    // Update navigation markers
    document.querySelectorAll('.phase-marker').forEach(marker => {
        marker.classList.remove('active');
    });
    
    const activeMarker = document.querySelector(`[data-phase="${phaseNumber}"]`);
    if (activeMarker) {
        activeMarker.classList.add('active');
    }
    
    currentPhase = phaseNumber;
    
    // Scroll to top of content
    document.querySelector('.story-content').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Methodology Steps (Expandable)
function initializeMethodologySteps() {
    const methodSteps = document.querySelectorAll('.method-step');
    methodSteps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = this.querySelector('.step-number').textContent;
            toggleMethodStep(parseInt(stepNumber));
        });
    });
}

function toggleMethodStep(stepNumber) {
    const step = document.querySelector(`.method-step:nth-child(${stepNumber})`);
    if (step) {
        step.classList.toggle('expanded');
        
        // Update toggle icon
        const toggle = step.querySelector('.step-toggle');
        if (step.classList.contains('expanded')) {
            toggle.textContent = '▲';
        } else {
            toggle.textContent = '▼';
        }
    }
}

// Example Tabs
function initializeExampleTabs() {
    const tabs = document.querySelectorAll('.example-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const exampleName = this.textContent.toLowerCase().replace(/[^a-z]/g, '-');
            showExample(exampleName);
        });
    });
}

function showExample(exampleName) {
    // Hide all example contents
    document.querySelectorAll('.example-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected example
    const targetExample = document.getElementById(`example-${exampleName}`);
    if (targetExample) {
        targetExample.classList.add('active');
    }
    
    // Update tab states
    document.querySelectorAll('.example-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Find and activate the correct tab
    const activeTab = Array.from(document.querySelectorAll('.example-tab')).find(tab => {
        const tabName = tab.textContent.toLowerCase().replace(/[^a-z]/g, '-');
        return tabName === exampleName;
    });
    
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Copy to Clipboard Functionality
function initializeCopyButtons() {
    // Add copy buttons to all code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        if (!pre.querySelector('.copy-button')) {
            const copyButton = createCopyButton(codeBlock);
            pre.style.position = 'relative';
            pre.appendChild(copyButton);
        }
    });
}

function createCopyButton(codeBlock) {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.innerHTML = '📋';
    button.title = 'Copy to clipboard';
    button.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 4px;
        padding: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    `;
    
    button.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.opacity = '0.7';
    });
    
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        copyToClipboard(codeBlock.textContent);
        showCopyFeedback(this);
    });
    
    return button;
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Code copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            console.log('Code copied to clipboard (fallback)');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback(button) {
    const originalContent = button.innerHTML;
    button.innerHTML = '✅';
    button.style.background = 'rgba(0, 184, 148, 0.8)';
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.background = 'rgba(255, 255, 255, 0.2)';
    }, 1500);
}

// Keyboard Navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Only handle keyboard navigation if not typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                navigatePhase(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigatePhase(1);
                break;
            case 'Home':
                e.preventDefault();
                showPhase(1);
                break;
            case 'End':
                e.preventDefault();
                showPhase(6);
                break;
            case 'Escape':
                e.preventDefault();
                collapseAllMethodSteps();
                break;
        }
    });
}

function navigatePhase(direction) {
    const newPhase = currentPhase + direction;
    if (newPhase >= 1 && newPhase <= 6) {
        showPhase(newPhase);
    }
}

function collapseAllMethodSteps() {
    document.querySelectorAll('.method-step.expanded').forEach(step => {
        step.classList.remove('expanded');
        const toggle = step.querySelector('.step-toggle');
        if (toggle) {
            toggle.textContent = '▼';
        }
    });
}

// Smooth scrolling for internal links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Progress tracking
function updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const progress = (currentPhase / 6) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    document.querySelectorAll('.discovery-step, .method-step, .format-card, .strategy-card, .challenge-item, .doc-card, .outcome-item').forEach(el => {
        observer.observe(el);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnimations);

// Add CSS for animations
const animationStyles = `
    .discovery-step,
    .method-step,
    .format-card,
    .strategy-card,
    .challenge-item,
    .doc-card,
    .outcome-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Utility functions
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate any layout-dependent elements
    console.log('Window resized, recalculating layout...');
}, 250));

// Print functionality
function printStory() {
    // Show all phases for printing
    document.querySelectorAll('.phase').forEach(phase => {
        phase.classList.remove('hidden');
    });
    
    window.print();
    
    // Restore original state after printing
    setTimeout(() => {
        showPhase(currentPhase);
    }, 1000);
}

// Export functionality (if needed)
function exportAsMarkdown() {
    // This would generate markdown from the content
    console.log('Export as Markdown functionality would go here');
}

// Search functionality (basic)
function searchContent(query) {
    const content = document.querySelector('.story-content');
    const text = content.textContent.toLowerCase();
    const searchTerm = query.toLowerCase();
    
    if (text.includes(searchTerm)) {
        // Highlight search results
        console.log(`Found "${query}" in content`);
        return true;
    }
    return false;
}

// Accessibility improvements
function initializeAccessibility() {
    // Add ARIA labels and roles
    document.querySelectorAll('.phase-marker').forEach((marker, index) => {
        marker.setAttribute('role', 'button');
        marker.setAttribute('aria-label', `Go to phase ${index + 1}`);
        marker.setAttribute('tabindex', '0');
        
        // Add keyboard support for phase markers
        marker.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const storyContent = document.querySelector('.story-content');
    if (storyContent) {
        storyContent.setAttribute('id', 'main-content');
        storyContent.setAttribute('role', 'main');
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Performance monitoring
function logPerformance() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
}

window.addEventListener('load', logPerformance);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to analytics service
});

// Service worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for global access
window.StoryApp = {
    showPhase,
    toggleMethodStep,
    showExample,
    navigatePhase,
    printStory,
    searchContent
}; 