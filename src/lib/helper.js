const EMPTY_STRING  = '';
const Q_STRING      = '?';
const DATA_PATH     = 'data';

function defaultResponse(view, req) {
    if (view.endsWith(".map") ||
        (view.endsWith("undefined") ||
            req.params.app === "undefined")) {
        return true;
    }
}

function getDefaultResponse(res) {
    return res.status(200).json({ });
}

function identifiedBackend(backend) {
    if (typeof backend === 'undefined') {
        console.log("No backend for data provided");
        return false;
    }
    return true;
}

function getBackendUrl(backend, originalUrl, app, feature, view) {
    let params = originalUrl.split(Q_STRING).length > 1 ? Q_STRING + originalUrl.split(Q_STRING)[1] : EMPTY_STRING;
    return `${backend}/${DATA_PATH}/${app}/${feature}/${view}${params}`;
}

function isEqualHelper(a, b, opts) {
    if (a === b) { return opts.fn(this) }
    return opts.inverse(this)
}

function getElement(array, index, opts) {
    try {
        if (opts.fn(index in array)) { return opts.fn(array[index]); }
    } catch (e) {
        return false;
    }
    return EMPTY_STRING;
}

function isEqualInArray(array, index, compared, opts) {
    if (index in array) {
        if (array[index] === compared) {
            return opts.fn(this);
        }
    }
    return opts.inverse(this)
}

module.exports = {
    defaultResponse,
    getDefaultResponse,
    identifiedBackend,
    getBackendUrl,
    isEqualHelper,
    getElement,
    isEqualInArray
}