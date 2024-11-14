export default {
    rootDir: process.cwd(),
    testEnvironment: 'node',
    verbose: true,
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    collectCoverage: true,    
    collectCoverageFrom: [
        'packages/**/*.js',
        'global/js/**/*.js'
    ],
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/lib/', '/coverage/','/SVG-library/','/utils/','/helpers/'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    moduleNameMapper: {
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs': '<rootDir>/__mocks__/swiperMock.js',
    }
};