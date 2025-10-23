import { httpHelper } from "./HttpHelperInstance";


class UserClient {
    #httpHelper = httpHelper;
    #baseURL;
    #accessToken;
    #userID;

    constructor(baseURL) {
        this.#baseURL = baseURL;
        this.#accessToken = null;
        this.#userID = null;
    }
    
    async getUserByName(name) {
        try {
            const user = await this.#httpHelper.get(`${this.#baseURL}/users/name/${name}`);
            return user;
        } catch (error) {
            return null;
        }
    }

    async signUp(username, email, password) {
        const body = {username, email, password};
        const res = await this.#httpHelper.post(`${this.#baseURL}/users/sign-up`,{body});
        return res;
    }

    async signIn(username, password) {
        const body = {username, password};
        const res = await this.#httpHelper.post(`${this.#baseURL}/users/sign-in`, {body,credentials: 'include'});
        this.#accessToken = res.token;
        this.#userID = res.userID;
    }

    async logout() {
        await this.#httpHelper.post(`${this.#baseURL}/users/logout`, {credentials: 'include'});
    }
}

export {UserClient};