
const cache = new Map();

cache.set("contacts", {start: 0, limit: 100000, isAllFetched: false, contacts: []});
cache.set("chats", [])

export default cache;