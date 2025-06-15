// Global state
let currentLesson = 1;
let expandedSteps = new Set();
let codeBuilderSteps = [];

// Lesson Navigation
function showLesson(lessonNumber) {
    // Hide all lessons
    document.querySelectorAll('.lesson').forEach(lesson => {
        lesson.classList.add('hidden');
    });
    
    // Show selected lesson
    const targetLesson = document.getElementById(`lesson-${lessonNumber}`);
    if (targetLesson) {
        targetLesson.classList.remove('hidden');
        currentLesson = lessonNumber;
    }
    
    // Update lesson navigation active state
    updateLessonNavigation(lessonNumber);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update progress
    updateProgress();
}

function showReference() {
    // Hide all lessons
    document.querySelectorAll('.lesson').forEach(lesson => {
        lesson.classList.add('hidden');
    });
    
    // Show reference
    const reference = document.getElementById('reference');
    if (reference) {
        reference.classList.remove('hidden');
    }
    
    // Update navigation
    updateLessonNavigation('ref');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update progress to 100%
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = '100%';
    }
}

function updateLessonNavigation(activeLesson) {
    // Update lesson navigation buttons
    document.querySelectorAll('.lesson-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lesson') == activeLesson) {
            btn.classList.add('active');
        }
    });
}

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const progress = (currentLesson / 5) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
}

// Demo Functions (Lesson 1)
function showDemo(mode) {
    const buttons = document.querySelectorAll('.demo-btn');
    const output = document.getElementById('demo-output-1');
    
    // Update button states
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const demoHtml = output.querySelector('.demo-html');
    
    if (mode === 'after') {
        demoHtml.innerHTML = `
            <h3 data-se="title" data-sq-field="headingConfiguration.title">Amazing Feature</h3>
            <p data-se="description" data-sq-field="contentConfiguration.description">This is a great feature description.</p>
        `;
        demoHtml.classList.add('edit-mode');
        
        // Add visual indicators
        setTimeout(() => {
            const elements = demoHtml.querySelectorAll('[data-sq-field]');
            elements.forEach(el => {
                el.style.position = 'relative';
                
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
                    z-index: 10;
                `;
                el.appendChild(indicator);
            });
        }, 100);
    } else {
        demoHtml.innerHTML = `
            <h3 data-se="title">Amazing Feature</h3>
            <p data-se="description">This is a great feature description.</p>
        `;
        demoHtml.classList.remove('edit-mode');
    }
}

// Step Functions (Lesson 2)
function toggleStep(stepNumber) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (!step) return;
    
    const isExpanded = expandedSteps.has(stepNumber);
    
    if (isExpanded) {
        step.classList.remove('expanded');
        expandedSteps.delete(stepNumber);
        codeBuilderSteps = codeBuilderSteps.filter(s => s.step !== stepNumber);
    } else {
        step.classList.add('expanded');
        expandedSteps.add(stepNumber);
        
        // Add to code builder
        const stepData = getStepCode(stepNumber);
        if (stepData) {
            codeBuilderSteps.push(stepData);
            codeBuilderSteps.sort((a, b) => a.step - b.step);
        }
    }
    
    updateCodeBuilder();
}

function getStepCode(stepNumber) {
    const stepCodes = {
        1: {
            step: 1,
            code: "import { processSquizEdit } from '../../global/js/utils/processEditor';"
        },
        2: {
            step: 2,
            code: "const squizEdit = info?.ctx?.editor || false;"
        },
        3: {
            step: 3,
            code: "let { title, content } = args || {};"
        },
        4: {
            step: 4,
            code: `let squizEditTargets = null;
if (squizEdit) {
    title = title || 'Add your title';
    content = content || 'Add content';
    
    squizEditTargets = {
        "title": { "field": "title" },
        "content": { "field": "content" }
    };
}`
        },
        5: {
            step: 5,
            code: `const componentData = { title, content };

if (!squizEdit) return template(componentData);

return processEditor(template(componentData), squizEditTargets);`
        }
    };
    
    return stepCodes[stepNumber];
}

function updateCodeBuilder() {
    const codeElement = document.getElementById('built-code');
    if (!codeElement) return;
    
    if (codeBuilderSteps.length === 0) {
        codeElement.textContent = '// Click the steps above to build your implementation';
        return;
    }
    
    const fullCode = `export default {
    async main(args, info) {
        ${codeBuilderSteps.map(step => step.code).join('\n        \n        ')}
    }
};`;
    
    codeElement.textContent = fullCode;
    
    // Re-highlight syntax
    if (window.Prism) {
        Prism.highlightElement(codeElement);
    }
}

// Format Functions (Lesson 3)
function showFormat(formatType) {
    // Hide all format contents
    document.querySelectorAll('.format-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.format-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected format content
    const targetContent = document.getElementById(`format-${formatType}`);
    if (targetContent) {
        targetContent.classList.remove('hidden');
    }
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

function checkAnswer(optionNumber, isCorrect) {
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quiz-feedback');
    
    // Reset all options
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });
    
    // Mark the clicked option
    const clickedOption = options[optionNumber - 1];
    if (isCorrect) {
        clickedOption.classList.add('correct');
        feedback.textContent = '✅ Correct! Format 3 (Custom) is perfect for multiple elements with the same data-se attribute but different field paths.';
        feedback.className = 'quiz-feedback correct';
    } else {
        clickedOption.classList.add('incorrect');
        feedback.textContent = '❌ Not quite. Think about which format handles multiple elements with the same data-se but different field paths.';
        feedback.className = 'quiz-feedback incorrect';
    }
}

// Practice Functions (Lesson 4)
function showCode(codeType) {
    // Hide all code contents
    document.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected code content
    const targetContent = document.getElementById(`code-${codeType}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

function checkExercise() {
    const importInput = document.getElementById('import-input').value.trim();
    const editModeInput = document.getElementById('edit-mode-input').value.trim();
    const targetsInput = document.getElementById('targets-input').value.trim();
    
    let score = 0;
    let feedback = [];
    
    // Check import
    const importFeedback = document.getElementById('import-feedback');
    if (importInput.includes('processSquizEdit') && importInput.includes('processEditor')) {
        importFeedback.textContent = '✅ Correct import statement!';
        importFeedback.className = 'input-feedback correct';
        score++;
    } else {
        importFeedback.textContent = '❌ Should import processSquizEdit from processEditor utils';
        importFeedback.className = 'input-feedback incorrect';
    }
    
    // Check edit mode detection
    const editModeFeedback = document.getElementById('edit-mode-feedback');
    if (editModeInput.includes('info?.ctx?.editor') || editModeInput.includes('info.ctx.editor')) {
        editModeFeedback.textContent = '✅ Correct edit mode detection!';
        editModeFeedback.className = 'input-feedback correct';
        score++;
    } else {
        editModeFeedback.textContent = '❌ Should use info?.ctx?.editor';
        editModeFeedback.className = 'input-feedback incorrect';
    }
    
    // Check targets configuration
    const targetsFeedback = document.getElementById('targets-feedback');
    if (targetsInput.includes('cardTitle') && targetsInput.includes('cardDescription') && 
        targetsInput.includes('features') && targetsInput.includes('array')) {
        targetsFeedback.textContent = '✅ Great configuration for array handling!';
        targetsFeedback.className = 'input-feedback correct';
        score++;
    } else {
        targetsFeedback.textContent = '❌ Should configure cardTitle and cardDescription with array mapping';
        targetsFeedback.className = 'input-feedback incorrect';
    }
    
    // Show overall result
    const result = document.getElementById('exercise-result');
    result.classList.add('show');
    
    if (score === 3) {
        result.textContent = '🎉 Perfect! You\'ve successfully converted the component for inline editing.';
        result.className = 'exercise-result show success';
    } else {
        result.textContent = `Good effort! You got ${score}/3 correct. Review the feedback above and try again.`;
        result.className = 'exercise-result show partial';
    }
}

function showHint() {
    const hints = [
        'Import: import { processSquizEdit } from \'../../global/js/utils/processEditor\';',
        'Edit Mode: const squizEdit = info?.ctx?.editor || false;',
        'Targets: Use Format 2 (array) for cardTitle and cardDescription mapping to features array'
    ];
    
    alert('Hints:\n\n' + hints.join('\n\n'));
}

function showSolution() {
    document.getElementById('import-input').value = 'import { processSquizEdit } from \'../../global/js/utils/processEditor\';';
    document.getElementById('edit-mode-input').value = 'const squizEdit = info?.ctx?.editor || false;';
    document.getElementById('targets-input').value = `squizEditTargets = {
    "title": { "field": "title" },
    "cardTitle": {
        "field": "features",
        "array": true,
        "property": "title"
    },
    "cardDescription": {
        "field": "features", 
        "array": true,
        "property": "description"
    }
};`;
}

// Example Functions (Lesson 5)
function showExample(exampleType) {
    const detail = document.getElementById('example-detail');
    
    const examples = {
        'text-callout': {
            title: 'Text-Callout Component',
            description: 'Simple component using Format 1 with shared partials',
            implementation: `// Uses existing info-box partial with data-se attributes
squizEditTargets = {
    "title": { "field": "displayConfiguration.title" },
    "content": { "field": "displayConfiguration.content" },
    "caption": { "field": "imageConfiguration.caption" },
    "buttonText": { "field": "buttonConfiguration.buttonText" }
};`,
            notes: [
                'Leveraged existing data-se attributes in shared partial',
                'No template modifications needed',
                'Simple 1:1 field mapping',
                'Minimal changes approach'
            ]
        },
        'button-row': {
            title: 'Button-Row Component',
            description: 'Array of buttons using Format 2 auto-indexing',
            implementation: `// Array handling with automatic indexing
squizEditTargets = {
    "button": {
        "field": "buttons",
        "array": true,
        "property": "buttonText"
    }
};

// Results in: buttons[0].buttonText, buttons[1].buttonText, etc.`,
            notes: [
                'Perfect for homogeneous collections',
                'Automatic index generation',
                'Clean array handling',
                'Scales with any number of items'
            ]
        },
        'multicolumn': {
            title: 'Multicolumn-Info Component',
            description: 'Complex component mixing all three formats',
            implementation: `// Mixed format usage
squizEditTargets = {
    // Format 1: Simple mapping
    "heading": { "field": "sectionConfiguration.title" },
    
    // Format 2: Array auto-indexing  
    "cardTitle": {
        "field": "callouts",
        "array": true,
        "property": "title"
    },
    
    // Format 3: Custom mapping
    "button": [
        { "field": "colTwo.buttonConfiguration.buttonText" },
        { "field": "colThree.buttonConfiguration.buttonText" }
    ]
};`,
            notes: [
                'Combines all three format types',
                'Handles complex data structures',
                'Different contexts for same data-se attributes',
                'Real-world complexity example'
            ]
        }
    };
    
    const example = examples[exampleType];
    if (!example) return;
    
    detail.innerHTML = `
        <div class="example-implementation">
            <h4>${example.title}</h4>
            <p>${example.description}</p>
            
            <div class="implementation-code">
                <h5>Implementation</h5>
                <pre><code class="language-javascript">${example.implementation}</code></pre>
            </div>
            
            <div class="implementation-notes">
                <h5>Key Points</h5>
                <ul>
                    ${example.notes.map(note => `<li>${note}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    // Re-highlight syntax
    if (window.Prism) {
        Prism.highlightAll();
    }
}

// Interactive Features
function initInteractiveFeatures() {
    // Copy to clipboard for code examples
    document.querySelectorAll('pre code').forEach(code => {
        code.addEventListener('click', function() {
            navigator.clipboard.writeText(this.textContent).then(() => {
                showCopyFeedback();
            });
        });
        
        // Add click hint
        code.style.cursor = 'pointer';
        code.title = 'Click to copy';
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            if (currentLesson < 5) {
                showLesson(currentLesson + 1);
            } else {
                showReference();
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentLesson > 1) {
                showLesson(currentLesson - 1);
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            showLesson(1);
        } else if (e.key === 'End') {
            e.preventDefault();
            showReference();
        }
    });
    
    // Auto-check checklist items when clicked
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                this.parentElement.style.opacity = '0.7';
                this.parentElement.style.textDecoration = 'line-through';
            } else {
                this.parentElement.style.opacity = '1';
                this.parentElement.style.textDecoration = 'none';
            }
        });
    });
}

function showCopyFeedback() {
    const feedback = document.createElement('div');
    feedback.textContent = 'Copied to clipboard!';
    feedback.className = 'copy-feedback';
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        if (document.body.contains(feedback)) {
            document.body.removeChild(feedback);
        }
    }, 2000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize interactive features
    initInteractiveFeatures();
    
    // Set initial state
    showLesson(1);
    
    // Add welcome message
    console.log(`
    🎯 Welcome to ProcessSquizEdit Mastery! 🎯
    
    Navigation Tips:
    • Use arrow keys to navigate lessons
    • Press Home to go to the beginning
    • Press End to go to the reference
    • Click code examples to copy them
    • Complete the hands-on exercises
    
    Master the art of component conversion! 🚀
    `);
});

// Export functions for global access
window.showLesson = showLesson;
window.showReference = showReference;
window.showDemo = showDemo;
window.toggleStep = toggleStep;
window.showFormat = showFormat;
window.checkAnswer = checkAnswer;
window.showCode = showCode;
window.checkExercise = checkExercise;
window.showHint = showHint;
window.showSolution = showSolution;
window.showExample = showExample; 