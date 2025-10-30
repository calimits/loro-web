import cache from "../utils/chache-ram";
import { httpHelper } from "./HttpHelperInstance";


class LoroClient {
    #httpHelper = httpHelper;
    #baseURL;
    #accessToken;
    #userID;

    constructor(baseURL) {
        this.#baseURL = baseURL;
        this.#accessToken = null;
        this.#userID = null;
    }

    //USER ENDPOINTS FUNCTIONS
    getUserID() {
        return this.#userID;
    }

    async getUserByName(name) {
        try {
            const user = await this.#httpHelper.get(`${this.#baseURL}/users/name/${name}`);
            return user;
        } catch (error) {
            return null;
        }
    }

    async getUserByID() {
        try {
            const user = await this.#httpHelper.get(`${this.#baseURL}/users/${this.#userID}`);
            return user;
        } catch (error) {
            return null;
        }
    }

    async signUp(username, email, password) {
        const body = { username, email, password };
        const res = await this.#httpHelper.post(`${this.#baseURL}/users/sign-up`, { body });
        return res;
    }

    async signIn(username, password) {
        const body = { username, password };
        const res = await this.#httpHelper.post(`${this.#baseURL}/users/sign-in`, { body, credentials: 'include' });
        this.#accessToken = res.token;
        this.#userID = res.userID;
        cache.set("acces-token", res.token);
        cache.set("user-ID", res.userID);
    }

    async logout() {
        await this.#httpHelper.post(`${this.#baseURL}/users/logout`, { credentials: 'include' });
    }

    async refreshTokens() {
        const res = await this.#httpHelper.post(`${this.#baseURL}/users/refresh-tokens`, { credentials: 'include' });
        this.#accessToken = res.token;
        this.#userID = res.userID;
        cache.set("acces-token", res.token);
        cache.set("user-ID", res.userID);
    }

    async putUserName(name) {
        const body = {
            userID: this.#userID,
            username: name
        }

        await this.#httpHelper.put(`${this.#baseURL}/users/update/name/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });
    }

    async putUserEmail(email) {

        const body = {
            userID: this.#userID,
            email: email
        }

        await this.#httpHelper.put(`${this.#baseURL}/users/update/email/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });
    }

    async putUserDescription(description) {
        const body = {
            userID: this.#userID,
            description: description
        }

        await this.#httpHelper.put(`${this.#baseURL}/users/update/description/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });
    }

    async putUserPassword(currentPassword, newPassword) {
        const body = {
            oldPassword: currentPassword,
            newPassword: newPassword
        };
        const user = await this.getUserByID();
        await this.#httpHelper.put(`${this.#baseURL}/users/update/password/${user.username}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });
    }

    async deleteUser() {
        await this.#httpHelper.delete(`${this.#baseURL}/users/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            credentials: 'include'
        });
        this.#accessToken = null;
        this.#userID = null;
    }

    async addContact2User(name) {
        const body = {
            userID: this.#userID,
            contactName: name
        };

        await this.#httpHelper.post(`${this.#baseURL}/users/add-contact/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });
    }

    async getUserContacts(start = 0, limit = 50) {
        const contacts = await this.#httpHelper.get(`${this.#baseURL}/users/contacts/${this.#userID}?start=${start}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            }
        });

        return contacts;
    }

    async deleteContacts(contactIDs) {
        const body = { contactIDs };

        await this.#httpHelper.delete(`${this.#baseURL}/users/contacts/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });
    }

    //CHAT ENDPOINTS FUNCTIONS
    async postChat(name, info, memberIDs) {
        const chatUsers = [];
        memberIDs.forEach(id => {
            chatUsers.push({
                userID: id,
                isAdmin: id === this.#userID,
                hasArchivedThisChat: false
            })
        });

        const body = {
            userID: this.#userID,
            chat: {
                name: name,
                description: info,
                lastUpdated: new Date().toISOString(),
                chatUsers
            }
        };

        await this.#httpHelper.post(`${this.#baseURL}/chats`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });
    }
}

export { LoroClient };