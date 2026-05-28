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




Problem 3. pointerWithin appears to solve the "Maximum Depth update exceeded" error, but it causes jitter because it detects columns between margins of tasks in column.

    =>  To use ClosestCorner or ClosestCenter in custom collision function.........
    
    sub-Problem a:  Closestcenter will not let you detect empty columns even if you are exactly over them.
        Solution: dndkit gives you value of closestCenter collisions, we can use that to compare which is nearest and return instead of using length > 0 


    sub-Problem b: The Problem with "Closest Center" (The Kanban Example) Imagine a Kanban board (like Trello). You have a big Column container, and inside that column, you have small Task containers stacked on top of each other.

            Now, imagine you are dragging a Task card and you place it right between two small Task containers.

            The center of the small Task container above you is pretty close.
            The center of the small Task container below you is pretty close.
            BUT, the center of the big Column container itself is exactly right where you are hovering!
            
            Because the big Column's center is sitting right under your cursor, the Closest Center algorithm gets confused. It measures the distances and says, "Ah! The big Column's center is the closest! I will select the whole column." This feels wrong to a human, because visually you are aiming at the small tasks inside the column, not the column itself.

        Solution: Why Closest Corners fixes this:
                    With Closest Corners, it looks at the edges. The big Column's corners are far away at the edges of the screen. But the corners of the small Task containers are right next to your dragged item. So, Closest Corners correctly selects the small Task container, which matches what your eyes expect.
