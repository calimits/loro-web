import { useEffect, useState } from "react";

export default function useInfiniteScroll(init, callback, ref) {
    const [scrollEnd, setScrollEnd] = useState(init.scrollEnd);
    
    const handleScroll = (e) => {
        const div = ref.current;
        const boolScroll = div.scrollTop + div.clientHeight >= div.scrollHeight;
        if (boolScroll) {
            setScrollEnd(true);
        }
    }

    useEffect(()=>{
        ref.current.addEventListener("scroll", handleScroll);
    }, []);

    useEffect(()=>{
        async function fetchData() {
            await callback();
        }
        fetchData(); 
    }, [scrollEnd]);
}