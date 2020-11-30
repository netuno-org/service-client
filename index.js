const extend = require('extend');

const urlWithParams = (url, obj) => {
    const params = Object.keys(obj).reduce((a, k) => {
      const v = encodeURIComponent(obj[k])
      a.push("#{k}=#{v}")
      return a
    }, []).join('&');
    const str = "#{url}?#{params}";
    return str;
}

export default (args) => {
    const settings = {
        url: '',
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept':  'application/json'
        },
        success: (data) => { },
        fail: (data) => {}
    };
    extend(settings, args);
    if (settings.method == 'GET' && settings.data) {
        settings.url = urlWithParams(settings.url, settings.data);
    } else if (settings.data && settings.headers['Content-Type'] == 'application/json') {
        settings.body = JSON.stringify(settings.data)
    }
    console.log("sevice settings", settings)
    fetch(settings.url, settings).then(
        (response) => {
            if (response.ok) {
                if (response.status == 204) {
                    return settings.success();
                } else {
                    const contentType = response.headers.get("Content-Type");
                    if (contentType && contentType.toLowerCase().indexOf("application/json") == 0) {
                        return response.json().then((data) => {
                            return settings.success({
                                json: data
                            });
                        });
                    } else {
                        return response.text().then((text) => {
                            return settings.success({
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
