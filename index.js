const extend = require('extend');

const config = {
    prefix: '',
    url: '',
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept':  'application/json'
    },
    success: (data) => { },
    fail: (data) => {}
}

const _service = (args) => {
    const settings = {};
    extend(settings, config);
    extend(settings, args);
    if (!settings.url.toLowerCase().startsWith('http://')
        && !settings.url.toLowerCase().startsWith('https://')
        && settings.prefix && settings.prefix != ''
        && !settings.url.toLowerCase().startsWith(settings.prefix.toLowerCase())) {
        if (settings.prefix.endsWith('/') && settings.url.startsWith('/')) {
            settings.url = settings.url.substring(1);
        } else if (!settings.prefix.endsWith('/') && !settings.url.startsWith('/')) {
            settings.url = '/'+ settings.url;
        }
        settings.url = settings.prefix + settings.url;
    }
    if (settings.method == 'GET' && settings.data) {
        if (typeof settings.data == "object") {
            settings.url = _service.urlWithParams(settings.url, settings.data);
        } else {
            settings.url += `?${settings.data}`;
        }
    } else if (settings.data && settings.headers['Content-Type'] == 'application/json') {
        if (typeof settings.data == "object") {
            settings.body = JSON.stringify(settings.data);
        } else {
            settings.body = settings.data;
        }
    }
    fetch(settings.url, settings).then(
        (response) => {
            if (response.ok) {
                if (response.status == 204) {
                    return settings.success();
                } else {
                    const info = {
                        status: response.status
                    };
                    const contentType = response.headers.get("Content-Type");
                    if (contentType && contentType.toLowerCase().indexOf("application/json") == 0) {
                        return response.json().then((data) => {
                            return settings.success({
                                ...info,
                                json: data
                            });
                        });
                    } else {
                        return response.text().then((text) => {
                            return settings.success({
                                ...info,
                                text: text
                            });
                        });
                    }
                }
            } else {
                return settings.fail({
                    response: response
                });
            }
        }
    ).catch(
        (e) => {
            return settings.fail({
                error: e
            });
        }
    )
};

_service.urlWithParams = (url, obj) => {
    const params = Object.keys(obj).reduce((a, k) => {
      const v = encodeURIComponent(obj[k])
      a.push(`${k}=${v}`)
      return a
    }, []).join('&');
    const str = "${url}?${params}";
    return str;
};

_service.config = (settings) => {
    extend(config, settings);
};

export default _service;
