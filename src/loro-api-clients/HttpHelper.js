
class HttpHelper {
    async #customFetch(endpoint, options) {
        const defaultHeader = {
            "Content-type": "application/json; charset=utf-8"
        }

        const controller = new AbortController();
        options.signal = controller.signal;
        options.method = options.method || "GET";
        options.headers = options.headers ? { ...defaultHeader, ...options.headers } : defaultHeader;

        options.body = JSON.stringify(options.body) || false;
        if (!options.body) delete options.body;

        setTimeout(() => { controller.abort() }, 10000);

        const res = await fetch(endpoint, options);
        const data = await res.json();

        if (!res.ok) {
            const {url, errCode, errInfo, errMessage, errType} = data;
            const error = new Error(errInfo || 'Error HTTP');

            error.url = url;
            error.errCode = errCode;
            error.errInfo = errInfo;
            error.errMessage = errMessage;
            error.errType = errType;

            throw error;
        }

        return data;
    }

    async get(url, options={}) {
        const data = await this.#customFetch(url,options);
        return data;
    }

    async post(url, options={}) {
        options.method = "POST";
        const data = await this.#customFetch(url,options);
        return data;
    }

    async put(url, options={}) {
        options.method = "PUT";
        const data = await this.#customFetch(url,options);
        return data;
    }

    async delete(url, options={}) {
        options.method = "DELETE";
        const data = await this.#customFetch(url,options);
        return data;
    }

}

export {HttpHelper};