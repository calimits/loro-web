import { useEffect, useRef, useState } from "react";
import { userClient } from "../../../loro-api-clients/UserClientInstance";
import cache from "../../../utils/chache-ram";
import useInfiniteScroll from "../../../custom-hooks/useInfiniteScroll";

export default function useContacts() {
    const contactsRef = useRef();

    const defaultStart = cache.get("contacts").start;
    const defaultLimit = cache.get("contacts").limit;
    const isAllFetched = cache.get("contacts").isAllFetched;
    const isCached = cache.get("contacts").contacts.length > 0;

    const [start, setStart] = useState(defaultStart);
    const [limit, setLimit] = useState(defaultLimit);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    const getContacts = async (e) => {
        setLoading(true);
        const res = await userClient.getUserContacts(start, limit);
        if (res.length === 0) {
            setLoading(false);
            cache.set("contacts", { ...cache.get("contacts"), isAllFetched: true });
            return
        }
        const currentContacts = cache.get("contacts").contacts;
        cache.set("contacts", { start: start + res.length, limit: limit, contacts: [...currentContacts, ...res] });
        setStart(start + res.length);
        setContacts([...contacts, ...res]);
        setLoading(false);
    }

    useInfiniteScroll({ scrollEnd: isAllFetched }, getContacts, contactsRef);

    useEffect(() => {
        async function getContacts() {
            setLoading(true);
            const res = await userClient.getUserContacts(start, limit);
            cache.set("contacts", { start: start + res.length, limit: limit, contacts: [...res] });
            setStart(start + res.length);
            setContacts([...contacts, ...res]);
            setLoading(false);
        }
        if (!isCached) getContacts();
        if (isCached) setContacts([...contacts, ...cache.get("contacts").contacts]);

    }, []);

    return {
        contacts,
        loading, 
        contactsRef
    }
}