import socketioClient from "../socket-io-client/socketioClientInstance";
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
        socketioClient.emmitInfoEvent();
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
        socketioClient.emmitInfoEvent();
    }

    async putUserName(name) {
        const body = {
            userID: this.#userID,
            username: name
        }

        try {
            await this.#httpHelper.put(`${this.#baseURL}/users/update/name/${this.#userID}`, {
            headers: {
                'Authorization': `Bearer ${this.#accessToken}`
            },
            body
        });    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.putUserName(name);
            } else {
                throw error;
            }
            
        }
        
    }

    async putUserEmail(email) {

        const body = {
            userID: this.#userID,
            email: email
        }

        try {
            await this.#httpHelper.put(`${this.#baseURL}/users/update/email/${this.#userID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body
            });    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.putUserEmail(email);
            } else {
                throw error;
            }
        }
        
    }

    async putUserDescription(description) {
        const body = {
            userID: this.#userID,
            description: description
        }

        try {
            await this.#httpHelper.put(`${this.#baseURL}/users/update/description/${this.#userID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body
            });
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.putUserDescription(description);
            } else {
                throw error;
            }
        }
        
    }

    async putUserPassword(currentPassword, newPassword) {
        const body = {
            oldPassword: currentPassword,
            newPassword: newPassword
        };

        try {
            const user = await this.getUserByID();
            await this.#httpHelper.put(`${this.#baseURL}/users/update/password/${user.username}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body
            });    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.putUserPassword(currentPassword, newPassword);
            } else {
                throw error;
            }
        }
        
    }

    async deleteUser() {
        
        try {
            await this.#httpHelper.delete(`${this.#baseURL}/users/${this.#userID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                credentials: 'include'
            });
            this.#accessToken = null;
            this.#userID = null;    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.deleteUser();
            } else {
                throw error;
            }
        }    
        
    }

    async addContact2User(name) {
        const body = {
            userID: this.#userID,
            contactName: name
        };
        
        try {
            await this.#httpHelper.post(`${this.#baseURL}/users/add-contact/${this.#userID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body
            }); 
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.addContact2User(name);
            } else {
                throw error;
            }
        }    
        
    }

    async getUserContacts(start = 0, limit = 50) {

        try {
            const contacts = await this.#httpHelper.get(`${this.#baseURL}/users/contacts/${this.#userID}?start=${start}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                }
            });

            return contacts;    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                const contacts = await this.getUserContacts(start, limit);
                return contacts;
            } else {
                throw error;
            }
        }     
    }

    async deleteContacts(contactIDs) {
        const body = { contactIDs };

        try {
            await this.#httpHelper.delete(`${this.#baseURL}/users/contacts/${this.#userID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body
            });    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.deleteContacts(contactIDs);
            } else {
                throw error;
            }
        }    
        
    }

    //CHAT ENDPOINTS FUNCTIONS
    async getChats41User(start = 0, limit = 50) { 
        try {
            const res = await this.#httpHelper.get(`${this.#baseURL}/chats/${this.#userID}?start=${start}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                }
            })
            return res;
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                const res = await this.getChats41User(start, limit);
                return res;
            } else {
                throw error;
            }      
        }
        
    }

    async postChat(chat) {
        const body = {
            userID: this.#userID,
            chat
        };

        try {
            const res = await this.#httpHelper.post(`${this.#baseURL}/chats`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body
            });
            return res;    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.postChat(chat);
            } else {
                throw error;
            } 
        }
        
    }

    async putChatName(name, chatID) {
        const body = { name };
        try {
            await this.#httpHelper.put(`${this.#baseURL}/chats/update/name/${chatID}/${this.#userID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body
            });
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.putChatName(name, chatID);
            } else {
                throw error;
            }     
        }
    }

    async putChatAdminStatus41User(isAdmin, chatID, memberID) {
        const body = { isAdmin };
        try {
            await this.#httpHelper.put(`${this.#baseURL}/chats/update/members/is-admin/${chatID}/${this.#userID}/${memberID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body
            });
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.putChatAdminStatus41User(isAdmin, chatID, memberID);
            } else {
                throw error;
            } 
        } 
    }

    async putChatDescription(description, chatID) {
        const body = { description };

        try {
            await this.#httpHelper.put(`${this.#baseURL}/chats/update/description/${chatID}/${this.#userID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body
            });    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.putChatDescription(description, chatID);
            } else {
                throw error;
            }     
        } 
    }

    async deleteOneChatMember(chatID, memberID) {
        try {
            await this.#httpHelper.delete(`${this.#baseURL}/chats/members/${chatID}/${this.#userID}/${memberID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                }
            });    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.deleteOneChatMember(chatID, memberID);
            } else {
                throw error;
            }    
        }   
    }

    //MESSAGE ENDPOINTS
    async getMessages41Chat(chatID, start=0, limit=100) {
        try {
            const messages = await this.#httpHelper.get(`${this.#baseURL}/messages/${chatID}/${this.#userID}?start=${start}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                }
            });
            return messages;    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                const messages = await this.getMessages41Chat(chatID, start=0, limit=100);
                return messages;
            } else {
                throw error;
            }    
        }
    }

    async getAllUnrecievedMessages41User(start=0, limit=100000) {
        try {
            const res = await this.#httpHelper.get(`${this.#baseURL}/messages/all/unrecieved/${this.#userID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                }
            });
            return res;    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                const res = await this.getAllUnrecievedMessages41User(start, limit);
                return res;
            } else {
                throw error;
            }     
        }
    }

    async sendTextMessage(message) {
        const formData = new FormData();
        formData.append("dateTime", message.dateTime);
        formData.append("type", "text");
        formData.append("chatID", message.chatID);
        formData.append("emisorUserID", this.#userID);
        formData.append("content", message.content);

        try {
            const res = await fetch(`${this.#baseURL}/messages/send-one`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body: formData
            });

            return res;    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                const res = await this.sendTextMessage(message);
                return res;
            } else {
                throw error;
            }    
        }
    }

    async sendManyTextMessages(messages) {
        const formData = new FormData();
        formData.append("textMsgs", JSON.stringify(messages));

        try {
            const res = await fetch(`${this.#baseURL}/messages/send-many`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body: formData
            });

            return res;    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                const res = await this.sendManyTextMessages(messages);
                return res;
            } else {
                throw error;
            }     
        }
        
    }

    async deleteManyMessages(chatID, msgIDs) {
        const body = { msgIDs };
        try {
            this.#httpHelper.delete(`${this.#baseURL}/messages/delete-many/${chatID}/${this.#userID}`, {
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`
                },
                body
            });    
        } catch (error) {
            if (error.errCode === 401) {
                await this.refreshTokens();
                await this.deleteManyMessages(chatID, msgIDs);
            } else {
                throw error;
            }     
        }
        
    }

}


export { LoroClient };