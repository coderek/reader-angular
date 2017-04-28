module.exports = {
    navigateFallback: '/index.html',
    stripPrefix: 'dist',
    root: 'dist/',
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5mb
    // importScripts: ['./backgroundSync.js'],
    staticFileGlobs: [
        'dist/index.html',
        'dist/**.js',
        'dist/**.css'
    ]
};
