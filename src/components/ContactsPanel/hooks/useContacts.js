import { useEffect, useState } from "react";
import { loroClient } from "../../../loro-api-clients/loroClientInstance";
import cache from "../../../utils/chache-ram";
import useInfiniteScroll from "../../../custom-hooks/useInfiniteScroll";

export default function useContacts() {

    const defaultStart = cache.get("contacts").start;
    const defaultLimit = cache.get("contacts").limit;
    const isCached = cache.get("contacts").contacts.length > 0;

    const [start, setStart] = useState(defaultStart);
    const [limit, setLimit] = useState(defaultLimit);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [selected, setSelected] = useState([]);
    const [error, setError] = useState(false);

    const handleCancelClick = (e) => {
        setEdit(false);
        setSelected([]);
    }

    const handleDeleteClick = async (e) => {
        try {
            await loroClient.deleteContacts(selected);
            const remainContacts = contacts.filter((contact => !selected.includes(contact.id)));
            setContacts(remainContacts);
            cache.set("contacts", { ...cache.get('contacts'), contacts: [...remainContacts] });
            setEdit(false);
        } catch (error) {
            setError(true);
        }
    }

    const fetchData = async (e) => {
        try {
            setLoading(true);
            const res = await loroClient.getUserContacts(start, limit);
            cache.set("contacts", { start: start + res.length, limit: limit, contacts: [...res] });
            setStart(start + res.length);
            setContacts([...contacts, ...res]);
            setLoading(false);
            setError(false);
        } catch (error) {
            setError(true);
        }
    }

    useEffect(() => {
        async function getContacts() {
            await fetchData();
        }
        if (!isCached) getContacts();
        if (isCached) setContacts([...contacts, ...cache.get("contacts").contacts]);

    }, []);

    return {
        contacts,
        loading,
        edit,
        setEdit,
        error,
        selected,
        setSelected,
        handleCancelClick,
        handleDeleteClick,
        fetchData
    }
}