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
