import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { AddIcon, CrossIcon } from "./Icons";
import { useOnClickOutside } from "./useOnClickOutside";

export function AddColumn({ handleColumnAdd }: {handleColumnAdd: (name:string)=>void}) {
    const [name, setName] = useState<string>("");
    const [active, setActive] = useState<boolean>(false);

    const ref = useRef<HTMLDivElement | null>(null);
    const inputref = useRef<HTMLInputElement | null>(null);

    useOnClickOutside(ref, () => {
        console.log("Clicked outside");
        if (active) setActive(false);
       
    })

    function handleCancel() {
        setName("");
        setActive(false);
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
          
            handleColumnAdd(name);
            setName('');
      }
      if (e.key === "Escape") {
        handleCancel();
      }
    }

    useEffect(() => {
        console.log(name)
    }, [name]);

     useEffect(() => {
       if (active && inputref.current) {
         inputref.current.focus();
       }
     }, [active]);


    if (!active) {
        return (
            <button onClick={() => {
                setActive(true);
            }} className="min-w-68 max-w-68 min-h-12 bg-white flex gap-4 items-center p-2 rounded-md shadow-md active:shadow-sm">
            <AddIcon></AddIcon> Add Column
          </button>
        );
    } else {
        return (
            <div ref={ref} className="min-w-68 bg-white p-2 rounded-md shadow-md flex flex-col gap-2">
                <input
                    ref={inputref}
                    onKeyDown={handleKeyDown}
              onChange={(e) => setName(e.target.value)}
              type="text"
                    placeholder="Enter Column Name...."
                    value={name}
            />
            <div className="flex items-center">
              <button onClick={()=>handleColumnAdd(name)} className="bg-blue-500 text-white rounded-md p-2 w-32"> Add Column</button>
              <button onClick={handleCancel}>
                <CrossIcon></CrossIcon>
              </button>
            </div>
          </div>
        );
    }
}