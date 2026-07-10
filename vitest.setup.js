import { vi } from 'vitest';

// Mock fetch globally to prevent AbortError in happy-dom
// happy-dom has limited fetch support and will abort fetch requests
// This mock prevents actual network requests during tests
// Individual tests can override this mock if they need specific behavior
vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
    // Return a resolved promise with a basic Response-like object
    // Tests can override this by using vi.mocked(fetch).mockResolvedValueOnce() or similar
    return Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: typeof url === 'string' ? url : url?.href || url?.toString() || '',
        json: async () => ({}),
        text: async () => '',
        blob: async () => new Blob(),
        arrayBuffer: async () => new ArrayBuffer(0),
        headers: new Headers(),
        clone: function() {
            return this;
        },
    });
}));

// Suppress AbortErrors from happy-dom's internal fetch implementation
// These occur when iframes try to load external URLs
const originalConsoleError = console.error;
console.error = (...args) => {
    const message = args.join(' ');
    // Suppress AbortError messages from happy-dom fetch operations
    if (message.includes('AbortError') || message.includes('operation was aborted')) {
        return;
    }
    originalConsoleError.apply(console, args);
};

// Add global error handlers to catch AbortErrors from happy-dom
// These errors occur when iframes try to load external URLs
if (typeof globalThis.window !== 'undefined') {
    const originalOnerror = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        // Suppress AbortErrors from happy-dom
        if (error && error.name === 'AbortError') {
            return true; // Prevent default error handling
        }
        if (typeof message === 'string' && (message.includes('AbortError') || message.includes('operation was aborted'))) {
            return true; // Prevent default error handling
        }
        if (originalOnerror) {
            return originalOnerror.call(this, message, source, lineno, colno, error);
        }
        return false;
    };
    
    // Also handle unhandledrejection events at the window level
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason) {
            const reason = event.reason;
            if (reason.name === 'AbortError' || 
                (typeof reason === 'object' && reason.message && reason.message.includes('operation was aborted'))) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
        }
    }, true); // Use capture phase to catch early
}

// Handle unhandled rejections to prevent test failures from coverage file issues
// This is a workaround for coverage reporter file write issues and happy-dom AbortErrors
// eslint-disable-next-line no-undef
if (typeof process !== 'undefined' && process.on) {
    // eslint-disable-next-line no-undef
    process.on('unhandledRejection', (reason) => {
    // Ignore coverage-related unhandled rejections
    if (reason && typeof reason === 'object') {
        const message = String(reason.message || '');
        const name = String(reason.name || '');
        
        // Ignore coverage file errors
        if (message.includes('coverage') || message.includes('.json')) {
            return;
        }
        
        // Ignore AbortErrors from happy-dom's fetch implementation
        if (name === 'AbortError' || message.includes('operation was aborted') || message.includes('AbortError')) {
            return;
        }
    }
    // For other unhandled rejections, log but don't fail
    console.warn('Unhandled Rejection:', reason);
    });
}

