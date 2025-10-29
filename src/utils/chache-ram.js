
const cache = new Map();

cache.set("contacts", {start: 0, limit: 100000, isAllFetched: false, contacts: []});

export default cache;