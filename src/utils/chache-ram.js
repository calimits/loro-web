
const cache = new Map();

cache.set("contacts", {start: 0, limit: 10, isAllFetched: false, contacts: []});

export default cache;