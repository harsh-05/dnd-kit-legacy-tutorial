import { useEffect, type RefObject } from "react";

export function useOnClickOutside(ref: RefObject<Element | null>, handler: Function) {
    useEffect(() => {
        function listener(event: MouseEvent | TouchEvent) {
            
            if (!ref.current || (ref.current.contains(event.target as Element))) return;
            
                handler();
        }

        document.addEventListener("click", listener, true);
        document.addEventListener("touchstart", listener, true);
        return () => {
            document.removeEventListener("click", listener, true);
            document.removeEventListener("touchstart", listener, true);
        }
    }, [ref, handler])
}