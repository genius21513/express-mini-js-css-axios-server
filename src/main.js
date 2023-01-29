
// Imports

require('dotenv').config();
const express = require('express');
const delimiters = require('handlebars-delimiters');
const handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const controller = require('./lib/controller');
const config = require("exp-config");
const helper = require('./lib/helper');
const cookieParser = require('cookie-parser');
require('log-timestamp');

// Express Server setup
const app = express();
app.use(cookieParser());
const port = process.env.PORT || 8085;

const TEMPLATE_DIRECTORY = process.env.TEMPLATES || __dirname + '/../html/';
const STATIC_DIRECTORY = __dirname + '/../public/';

// Custom syntax for handlebars to avoid VueJS conflict
delimiters(handlebars,  ['\\[\\[', '\\]\\]']);
app.set('views', TEMPLATE_DIRECTORY);

// Template Engine setup
app.engine('html', expressHandlebars({
    helpers: {
        ifEquals: helper.isEqualHelper,
        getElement: helper.getElement,
        isEqualInArray: helper.isEqualInArray,
    },
    extname: 'html',
    layoutsDir: TEMPLATE_DIRECTORY,
    partialsDir: TEMPLATE_DIRECTORY+ '/partials/'
}));
console.log('Template directory set to %s', TEMPLATE_DIRECTORY);
console.log('Static files directory set to %s', TEMPLATE_DIRECTORY);
app.set('view engine', 'html');
app.use(express.json({ extended: true, limit: '1mb' } ));
if (typeof process.env.TEMPLATES_STATIC !== 'undefined') {
    console.log('Custom static files directory set to %s', process.env.TEMPLATES_STATIC);
    app.use('/public', express.static(process.env.TEMPLATES_STATIC));
}

// Controller endpoint setup

app.get('/',                          controller.getRootView);
app.use('/public',                    express.static(STATIC_DIRECTORY));
app.get('/app/:app/:view?',          controller.getTemplate);
app.get('/app/:app/:feature/:view*?', controller.getTemplate);
app.get('/login',                     controller.getLoginView);
app.post('/login',                controller.postLogin);
app.get('/error/:error',              controller.getErrorView);
app.all('*',  controller.getErrorView);


/*
app.use(function(err, req, res, next) {
    console.log("Error - Unable to process request for URL %s", req.url);
    res.render('error/500', { layout: false, static: config });
});
*/


console.log('Backend: %s', config.backend);

// Start application
app.listen(port, () => console.log('Express Server listening on port %d in %s mode. URL: http://localhost:%d', port, app.get('env'), port));