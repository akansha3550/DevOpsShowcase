const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy /api requests to backend-service:5000
app.use('/api', createProxyMiddleware({
    target: 'http://backend-service:5000',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/pods',
    },
}));

// Serve static React build files
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all to serve index.html for React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend proxy server running on port ${PORT}`);
});
