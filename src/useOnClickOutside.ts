import { useEffect, type RefObject } from "react";

export function useOnClickOutside(ref: RefObject<Element | null>, handler: Function) {
    useEffect(() => {
        function listener(event: MouseEvent | TouchEvent) {
            
            if (!ref.current || (ref.current.contains(event.target as Element))) return;
            
                handler();
        }

        document.addEventListener("click", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("click", listener);
            document.removeEventListener("touchstart", listener);
        }
    }, [ref, handler])
}