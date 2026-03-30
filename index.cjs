const extend = require('just-extend');

const isNode = typeof window === 'undefined';

let nodeHTTP, nodeHTTPS = null;

const config = {
    prefix: '',
    url: '',
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept':  'application/json'
    },
    start: () => {},
    success: () => { },
    fail: () => {},
    end: () => {}
}

if (isNode) {
    nodeHTTP = eval(`require('http')`);
    nodeHTTPS = eval(`require('https')`);
}

const _service = (args) => {
    const settings = {};
    extend(true, settings, config);
    extend(true, settings, args);
    settings.url = _service.url(settings);
    if (settings.data) {
        if (settings.method.toUpperCase() === 'GET') {
            if (typeof settings.data == "object") {
                settings.url = _service.urlWithEncodedParameters(settings.url, settings.data);
            } else {
                settings.url += `?${settings.data}`;
            }
        } else if (!isNode && (settings.data instanceof FormData || settings.multipart || (typeof settings.data === 'object' && Object.keys(settings.data).some((key) => settings.data[key] instanceof File)))) {
            delete settings.headers['Content-Type'];
            if (settings.data instanceof FormData) {
                settings.body = settings.data;
            } else if (settings.data === 'object') {
                settings.body = new FormData();
                Object.keys(settings.data).forEach((key) => {
                    if (settings.data[key] instanceof File) {
                        settings.body.append(key, settings.data[key]);
                    } else if (typeof settings.data[key] == 'object') {
                        settings.body.append(key, JSON.stringify(settings.data[key]));
                    } else {
                        settings.body.append(key, settings.data[key]);
                    }
                });
            } else {
                settings.body = settings.data;
            }
        } else if (isNode && (settings.multipart || (typeof settings.data === 'object' && Object.keys(settings.data).some((key) => Buffer.isBuffer(settings.data[key]))))) {
            const boundary = '---'+ _service.randomString(34);
            settings.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
            settings.body = Buffer.from('');
            const bodyBufferAppend = (content) => {
                if (Buffer.isBuffer(content)) {
                    settings.body = Buffer.concat([settings.body, content]);
                } else {
                    settings.body = Buffer.concat([settings.body, Buffer.from(content)]);
                }
            };
            Object.keys(settings.data).forEach((key) => {
                if (Buffer.isBuffer(settings.data[key])) {
                    const bufferValue = settings.data[key];
                    const fileName = bufferValue.fileName;
                    const fileType = bufferValue.contentType || 'application/octet-stream';
                    bodyBufferAppend(`--${boundary}\r\n`);
                    bodyBufferAppend(`Content-Disposition: form-data; name="${key}"; filename="${fileName}";\r\n`);
                    bodyBufferAppend(`Content-Type: ${fileType}\r\n`);
                    bodyBufferAppend(`Content-Transfer-Encoding: binary\r\n\r\n`);
                    bodyBufferAppend(bufferValue);
                } else {
                    let value = settings.data[key];
                    if (typeof value == 'object') {
                        value = JSON.stringify(value);
                    }
                    bodyBufferAppend(`--${boundary}\r\n`);
                    bodyBufferAppend(`Content-Disposition: form-data; name="${key}"; \r\n\r\n`);
                    bodyBufferAppend(`${value}\r\n`);
                }
            });
            bodyBufferAppend(`\r\n--${boundary}--\r\n`);
        } else if (settings.headers['Content-Type'] === 'application/json') {
            if (typeof settings.data == "object") {
                settings.body = JSON.stringify(settings.data);
            } else {
                settings.body = settings.data;
            }
            if (isNode) {
                settings.headers['Content-Length'] = Buffer.byteLength(settings.body);
            }
        } else {
            if (typeof settings.data == "object") {
                settings.body = _service.urlWithEncodedParameters(settings.url, settings.data)
            } else {
                settings.body = settings.data;
            }
            if (isNode) {
                settings.headers['Content-Length'] = Buffer.byteLength(postData);
            }
        }
    }
    if (isNode) {
        let nodeClient = null;
        if (settings.url.toLowerCase().startsWith('http://')) {
            nodeClient = nodeHTTP;
        } else if (settings.url.toLowerCase().startsWith('https://')) {
            nodeClient = nodeHTTPS;
        } else {
            throw new Error('URL with an invalid protocol. Only is supported HTTP or HTTPS.');
        }
        settings.start();
        const nodeClientResponse = (response) => {
            if (settings.encoding) {
                response.setEncoding(settings.encoding);
            }
            const contentType = response.headers['content-type'];
            const info = {
                ok: response.statusCode >= 200 && response.statusCode < 300,
                status: response.statusCode,
                isJSON: contentType && contentType.toLowerCase().indexOf("application/json") === 0,
                contentType: contentType,
                response: response
            };
            if (response.statusCode === 204) {
                settings.success({...info});
                settings.end();
                return;
            }
            let textData = '';
            let blobData = [];
            response.on('data', (chunk) => {
                if (settings.blob && info.ok) {
                    blobData = blobData.concat([...chunk]);
                } else {
                    textData += chunk;
                }
            });
            response.on('end', () => {
                if (info.ok) {
                    if (settings.blob) {
                        settings.success({
                            ...info,
                            blob: blobData
                        });
                        settings.end();
                        return;
                    }
                    if (info.isJSON) {
                        try {
                            settings.success({
                                ...info,
                                json: JSON.parse(textData)
                            });
                        } catch (e) {
                            settings.fail({
                                error: e
                            });
                        }
                        settings.end();
                        return;
                    }
                    settings.success({
                        ...info,
                        text: textData
                    });
                    settings.end();
                    return;
                }
                if (info.isJSON) {
                    try {
                        settings.fail({
                            ...info,
                            error: new Error(`Service failed responding status ${info.status}.`),
                            json: JSON.parse(textData)
                        });
                    } catch (e) {
                        settings.fail({
                            error: e
                        });
                    }
                    settings.end();
                    return;
                }
                settings.fail({
                    ...info,
                    error: new Error(`Service failed responding status ${info.status}.`),
                    text: textData
                });
                settings.end();
            });
        };
        let nodeClientRequest = null;
        if (settings.method.toUpperCase() === 'GET') {
            nodeClientRequest = nodeClient.get(settings.url, settings, nodeClientResponse);
        } else {
            nodeClientRequest = nodeClient.request(settings.url, settings, nodeClientResponse);
        }
        nodeClientRequest.on("error", (e) => {
            settings.fail({
                error: e
            });
            settings.end();
        });
        if (settings.timeout && settings.timeout > 0) {
            nodeClientRequest.setTimeout(settings.timeout, () => {
                nodeClientRequest.abort();
            });
        }
        if (settings.method.toUpperCase() !== 'GET') {
            nodeClientRequest.write(settings.body);
            nodeClientRequest.end();
        }
        return;
    }
    settings.start();
    fetch(settings.url, settings).then(
        (response) => {
            const contentType = response.headers.get("Content-Type");
            const info = {
                ok: response.ok,
                status: response.status,
                isJSON: contentType && contentType.toLowerCase().indexOf("application/json") === 0,
                contentType: contentType,
                response: response
            };
            if (info.ok) {
                if (response.status === 204) {
                    settings.success({...info});
                    settings.end();
                    return;
                }
                if (settings.blob) {
                    response.blob().then((blob) => {
                        settings.success({
                            ...info,
                            blob: blob
                        });
                        settings.end();
                    });
                    return;
                }
                if (info.isJSON) {
                    response.json().then((data) => {
                        settings.success({
                            ...info,
                            json: data
                        });
                        settings.end();
                    });
                    return;
                }
                response.text().then((text) => {
                    settings.success({
                        ...info,
                        text: text
                    });
                    settings.end();
                });
                return;
            }
            if (info.isJSON) {
                response.json().then((data) => {
                    settings.fail({
                        ...info,
                        error: new Error(`Service failed responding status ${info.status}.`),
                        json: data
                    });
                    settings.end();
                });
                return;
            }
            response.text().then((text) => {
                settings.fail({
                    ...info,
                    error: new Error(`Service failed responding status ${info.status}.`),
                    text: text
                });
                settings.end();
            });
        }
    ).catch((e) => {
        settings.fail({
            error: e
        });
        settings.end();
    });
};

_service.urlWithEncodedParameters = (url, obj) => {
    const params = _service.encodedParameters(obj);
    if (params !== "") {
        return `${url}?${params}`;
    }
    return url;
};

_service.encodedParameters = (obj) => {
    return Object.keys(obj).reduce((a, k) => {
      const v = encodeURIComponent(obj[k])
      a.push(`${k}=${v}`)
      return a
    }, []).join('&');
};

_service.randomString = (length) => {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return result;
}

_service.url = (...params) => {
    let args = {};
    if (params.length === 1) {
        if (typeof params[0] === 'object' && params[0] != null && !Array.isArray(params[0])) {
            args = params[0];
        } else {
            args.url = params[0];
        }
    } else if (params.length >= 2) {
        args = params[0];
        args.url = params[1];
    }
    const settings = {};
    extend(true, settings, config);
    extend(true, settings, args);
    if (!settings.url.toLowerCase().startsWith('http://')
        && !settings.url.toLowerCase().startsWith('https://')
        && settings.prefix && settings.prefix !== ''
        && !settings.url.toLowerCase().startsWith(settings.prefix.toLowerCase())) {
        if (settings.prefix.endsWith('/') && settings.url.startsWith('/')) {
            settings.url = settings.url.substring(1);
        } else if (!settings.prefix.endsWith('/') && !settings.url.startsWith('/')) {
            settings.url = '/'+ settings.url;
        }
        let prefix = settings.prefix;
        if (prefix.indexOf('/') === 0) {
            let frontendServer = false;
            let hostname = '';
            let port = '';
            if (window && window.location.host.indexOf(':')) {
                hostname = window.location.host.substring(0, window.location.host.indexOf(':'));
                port = window.location.host.substring(window.location.host.indexOf(':') + 1);
            }
            if (port === '3000' || port === '5173') {
                frontendServer = true;
                port = '9000';
            }
            if (port.length > 2 && port.substring(port.length - 2, port.length) === '30') {
                frontendServer = true;
                port = port.substring(0, port.length - 2) + '90';
            }
            if (window && frontendServer) {
                prefix = window.location.protocol +'//'+ hostname +':'+ port + prefix;
            }
        }
        settings.url = prefix + settings.url;
    }
    return settings.url;
}

_service.config = (settings) => {
    if (!!settings) {
        extend(true, config, settings);
    }
    const newConfig = {};
    extend(true, newConfig, config);
    return newConfig;
};

module.exports = _service;
