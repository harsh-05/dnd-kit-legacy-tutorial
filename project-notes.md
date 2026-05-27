Problem: 

 1. 

Why this error occurs ?? what's really breaking inside the code ?? 

```Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
    at getRootForUpdatedFiber (react-dom_client.js?v=57279746:3526:128)
    at enqueueConcurrentHookUpdate (react-dom_client.js?v=57279746:3510:16)
    at dispatchSetStateInternal (react-dom_client.js?v=57279746:6832:20)
    at dispatchSetState (react-dom_client.js?v=57279746:6803:9)
    at measureRect (chunk-5OB5MRBJ.js?v=57279746:1903:5)
    at chunk-5OB5MRBJ.js?v=57279746:1939:5
    at Object.react_stack_bottom_frame (react-dom_client.js?v=57279746:18567:20)
    at runWithFiberInDEV (react-dom_client.js?v=57279746:997:72)
    at commitHookEffectListMount (react-dom_client.js?v=57279746:9411:163)
    at commitHookLayoutEffects (react-dom_client.js?v=57279746:9391:60)
    ```

This might be happening because of frequent detection of column that causes to call dragOver function which might changes react state too frequently. 

This problem can be solved by throttling in dragOver function, or making the robust collision detection function. 

Need much more understanding......... Whereas there are plenty of blogs are available to solve this problem.


Problem: 2. 

```
fractional-indexing.js?v=57279746:136 Uncaught Error: a2 >= a2
    at KanbanBoard.tsx:307:23
    at KanbanBoard (KanbanBoard.tsx:27:29)
```


Possible causes: generateTask() in KanbanBoard, and dragEnd function uses .sort((a, b) => (a.rank < b.rank ? -1 : 1)); instead of .sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0));



active.data.current.task.colId; --> this changes when I change the state in react, on dragOver handler. Why ?? Am I breaking something ??
