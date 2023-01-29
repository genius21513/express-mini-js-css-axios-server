const data = require('./data');
const helper = require('./helper');
const config = require("exp-config");

const HEADER_BACKEND = 'Data-Backend';
const SERVER_DATA    = 'serverData'

const defaultView          = 'index';
const login          = 'login';
const cookie         = 'idx';

function getRootView(req, res) {
    let dataUrlPath = getBackendServer(req) + "/public/apps/";
    console.log("Backend endpoint to get default app: " + dataUrlPath);    
    data.getJson(dataUrlPath, req.cookies[cookie]).then((response) => {        
        console.log(response);
        if (response.data.total === 0) {
            console.log("No public apps available");
            return res.render('error/500', { layout: false, static: config, errorTitle: config.errors.NO_APP_AVAILABLE_TITLE, errorText: config.errors.NO_APP_AVAILABLE_DESCRIPTION });
        }
        if (response.data.apps.length === 0) {
            return res.redirect("/login");
        }
        return res.redirect("/app/" + response.data.apps[0]);
    }).catch((error) => {
        return res.render('error/500', { layout: false, static: config, errorTitle: config.errors.NO_BACKEND_AVAILABLE_TITLE, errorText: config.errors.NO_BACKEND_AVAILABLE_DESCRIPTION });
    });
}

function getTemplate(req, res) {
    const backend = getBackendServer(req);

    const app     = req.params.app;
    const feature = req.params.feature || app;
    const view    = req.params.view || defaultView;
    const render  = `app/${feature}/${view}`;

    if (helper.defaultResponse(view, req)) { return helper.getDefaultResponse(res); }
    if (!helper.identifiedBackend(backend))  { return res.render(render, { layout: false, context: null, static: config }); }
    let backendUrl = helper.getBackendUrl(backend, req.originalUrl, app, feature, view);
    console.log("Backend Data Provided: " + backendUrl);
    data.getJson(backendUrl, req.cookies[cookie]).then((response) => {
        const serverDataString  = JSON.stringify(response.data);
        const serverDataInclude = `${SERVER_DATA} = ${serverDataString}`;        
        res.render(render, { layout: false, data: response.data, serverData: serverDataInclude, static: config });
    }).catch((error) => {
        console.log('Error fetching from backend URL: ' + backendUrl)
        return res.render('error/500', { layout: false, static: config });
    });
}

function getLoginView(req, res) {
    const backend = getBackendServer(req);
    return res.render(login, { layout: false, admin: backend, static: config, reason: req.query.m });
}

function postLogin(req, res) {
    const backend = getBackendServer(req) + req.url;
    data.postJson(backend, req.body, req.headers, req.cookies[cookie]).then((response) => {
        return res.status(200).json(response.data);
    }).catch((error) => {
        let status = error.status ? error.status : 500;
        return res.status(status).json({ code: status, message : error.message } );
    });
}

function getErrorView(req, res) {
    const errorView = req.params.error || '505';
    return res.render('error/' + errorView, { layout: false, static: config });
}

function getBackendServer(req) {
    return req.header[HEADER_BACKEND] || config.backend;
}

module.exports = {
    getTemplate,
    getLoginView,
    postLogin,
    getRootView,
    getErrorView
}