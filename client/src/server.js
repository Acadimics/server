const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');
const { port, serviceURL, APIs: routes, version, baseAPIRoute } = require('./server.config');

const baseRoute = `${baseAPIRoute}/v${version}`

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
// app.use(bodyParser);
app.use(cors());

const service = axios.create({
    baseURL: serviceURL
})

app.get(`${baseRoute}/ping`, function (req, res) {
 return res.send('pong');
});

var jsonParser = bodyParser.json()

routes.forEach(({ method, serviceMethod, uri }) => {
    const serviceRoute = `${serviceURL}/${uri}`;
    const requestLOG = `request "${serviceMethod}" - "${serviceRoute}"`;
    console.info(`creating route ${method || serviceMethod} - ${baseRoute}/${uri}`);
    const routeMethod = method || serviceMethod;

    app[routeMethod](
        `${baseRoute}/${uri}`,
        jsonParser,
        (req, res) => {
            console.time(requestLOG);
            console.info(`${requestLOG}...`);
            let reqConfig = {};        
            if(routeMethod.toLowerCase() !== 'get'){
               reqConfig = req.body; 
            }  
            return service[serviceMethod](`/${uri}`, reqConfig)
                .then(response => {
                    if (response.status >= 400){
                        throw ''
                    }
                    console.info(`${requestLOG}... - DONE`);
                    console.timeEnd(requestLOG);
                    return res.send(response.data || []); 
                })
                .catch(err => {
                    console.error(err, `Failed request "${serviceMethod}" - "${serviceRoute}"`);
                    console.timeEnd(requestLOG);
                    return res.send(500)
                })
        }
    )
});

app.listen(port);
console.info(`server is running on localhost:${port}...`)