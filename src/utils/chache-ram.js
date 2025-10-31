
const cache = new Map();

cache.set("contacts", {start: 0, limit: 100000, isAllFetched: false, contacts: []});
cache.set("chats", {start: 0, limit: 50, isAllFetched: false, chats: []})

export default cache;