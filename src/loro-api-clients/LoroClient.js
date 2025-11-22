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

    async getManyUsersByID(IDs) {
        const body = { userIDs: IDs };
        const users = await this.#httpHelper.post(`${this.#baseURL}/users/ids`, { body });
        return users;
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
    async getChats41User(start = 0, limit = 50) {
        const res = await this.#httpHelper.get(`${this.#baseURL}/chats/${this.#userID}?start=${start}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            }
        })

        return res;
    }

    async postChat(chat) {
        const body = {
            userID: this.#userID,
            chat
        };

        const res = await this.#httpHelper.post(`${this.#baseURL}/chats`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });

        return res;
    }

    async putChatName(name, chatID) {
        const body = { name };
        this.#httpHelper.put(`${this.#baseURL}/chats/update/name/${chatID}/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });
    }

    async putChatAdminStatus41User(isAdmin, chatID, memberID) {
        const body = { isAdmin };
        await this.#httpHelper.put(`${this.#baseURL}/chats/update/members/is-admin/${chatID}/${this.#userID}/${memberID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });
    }

    async putChatDescription(description, chatID) {
        const body = { description };
        this.#httpHelper.put(`${this.#baseURL}/chats/update/description/${chatID}/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });
    }

    async deleteOneChatMember(chatID, memberID) {
        this.#httpHelper.delete(`${this.#baseURL}/chats/members/${chatID}/${this.#userID}/${memberID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            }
        });
    }

    //MESSAGE ENDPOINTS
    async getMessages41Chat(chatID, start=0, limit=100) {
        const messages = await this.#httpHelper.get(`${this.#baseURL}/messages/${chatID}/${this.#userID}?start=${start}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            }
        });
        return messages;
    }

    async getAllUnrecievedMessages41User(start=0, limit=100000) {
        const res = await this.#httpHelper.get(`${this.#baseURL}/messages/all/unrecieved/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            }
        });

        return res;
    }

    async sendTextMessage(message) {
        const formData = new FormData();
        formData.append("dateTime", message.dateTime);
        formData.append("type", "text");
        formData.append("chatID", message.chatID);
        formData.append("emisorUserID", this.#userID);
        formData.append("content", message.content);

        const res = await fetch(`${this.#baseURL}/messages/send-one`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body: formData
        });

        return res;
    }

    async deleteManyMessages(chatID, msgIDs) {
        const body = { msgIDs };
        this.#httpHelper.delete(`${this.#baseURL}/messages/delete-many/${chatID}/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        })
    }


}


export { LoroClient };