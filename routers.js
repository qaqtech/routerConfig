const express = require('express');
const proxy = require('http-proxy-middleware');
const cors = require("cors");

// Config
const { routes } = require('./config.json');

const hostname = '0.0.0.0';
const port = 80;

const app = express();



  
for (route of routes) {
    app.use(route.route,
        proxy({
            target: route.address,
            pathRewrite: (path, req) => {
                return path.split('/').slice(2).join('/'); // Could use replace, but take care of the leading '/'
            }
        })
    );
}

app.listen(port,hostname, () => {
    console.log('Proxy Started');
});