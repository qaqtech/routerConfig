const express = require('express');
const proxy = require('http-proxy-middleware');
const cors = require("cors");
const fs = require('fs');
const http = require('http');
const https = require('https');

// Config
const { routes } = require('./config.json');

const hostname = '0.0.0.0';
const port = 80;

const app = express();
const privateKey = fs.readFileSync('/home/ubuntu/kg-ssl/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/home/ubuntu/kg-ssl/cert.pem', 'utf8');
const ca = fs.readFileSync('/home/ubuntu/kg-ssl/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
  
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

//app.listen(port,hostname, () => {
    //console.log('Proxy Started');
//});

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
    });