
const cache = new Map();

cache.set("contacts", {start: 0, limit: 50, isAllFetched: false, contacts: []});

export default cache;