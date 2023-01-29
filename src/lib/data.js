const nodeCache = require( "node-cache" );
const axios = require('axios')

const dataCache = new nodeCache();

function postJson(dataUrl, body, headers, token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    return new Promise((resolve, reject) => {
        axios.post(dataUrl, body)
        .then(response => {
            dataCache.set("data", response.data, 5 );
            resolve({ data: response.data });
        })
        .catch((error) => {
            if (error.errno == "ECONNREFUSED") {
                console.log("Backend didn't respond: %s", dataUrl);
            }
            reject({ status: 500, message: error.response.data.error ? error.response.data.error : 'Internal Server Error' })
        });
    })
}

function getJson(dataUrl, token) {
    let cacheKey = getCacheKey(dataUrl, token);
    let value = dataCache.get(cacheKey);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    return new Promise((resolve, reject) => {
        if (value !== undefined) {
            return resolve({ data: value });
        }
        axios.get(dataUrl)
            .then(response => {
                dataCache.set(cacheKey, response.data, 1 );
                resolve({ data: response.data });
            })
            .catch((error) => {
                reject({ status: 500, message: 'Internal Server Error' })
            });
    })
}

function getCacheKey(dataUrl, token) {
    return dataUrl + ':' + token;
}

module.exports = {
    postJson,
    getJson
}