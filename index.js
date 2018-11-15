const express = require('express')
const app = express()
const port = 8080 

app.get('/', (req, res) => res.send('Hello World!'))


var Register = require('prom-client').register;  
var Counter = require('prom-client').Counter;  
var Histogram = require('prom-client').Histogram;  
var Summary = require('prom-client').Summary;  
//var ResponseTime = require('response-time');  

/**
 * A Prometheus counter that counts the invocations of the different HTTP verbs
 * e.g. a GET and a POST call will be counted as 2 different calls
 */
numOfRequests = new Counter({  
    name: 'numOfRequests',
    help: 'Number of requests made',
    labelNames: ['method']
});
startCollection = function () {  
    console.log(`Starting the collection of metrics, the metrics are available on /metrics`);
    require('prom-client').collectDefaultMetrics();
};
requestCounters = function (req, res, next) {  
    if (req.path != '/metrics') {
        numOfRequests.inc({ method: req.method });
        pathsTaken.inc({ path: req.path });
    }
    next();
}
injectMetricsRoute = function (App) {  
    App.get('/metrics', (req, res) => {
        res.set('Content-Type', Register.contentType);
        res.end(Register.metrics());
    });
};
app.use(requestCounters);  
injectMetricsRoute(app);
startCollection();

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
