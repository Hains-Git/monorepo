import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore
} from 'react';

export default function createFastContext(initialState) {
  function useFastContextData() {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set());

    const set = useCallback((value) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = useCallback((callback) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);
    return {
      get,
      set,
      subscribe
    };
  }

  const FastContext = createContext(null);

  function FastContextProvider({ children }) {
    return React.createElement(
      FastContext.Provider,
      { value: useFastContextData() },
      children
    );
  }

  function useFastContext(selector) {
    const fastContext = useContext(FastContext);

    if (!fastContext) {
      throw new Error('Store not found');
    }

    const state = useSyncExternalStore(
      fastContext.subscribe,
      () => selector(fastContext.get()),
      () => selector(initialState)
    );

    return [state, fastContext.set];
  }

  function useFastContextFields(fieldNames) {
    const gettersAndSetters = {};
    for (const fieldName of fieldNames) {
      const [getter, setter] = useFastContext((fc) => fc[fieldName]);
      gettersAndSetters[fieldName] = {
        get: getter,
        set: (value) => setter({ [fieldName]: value })
      };
    }

    return gettersAndSetters;
  }

  return {
    FastContextProvider,
    useFastContextFields
  };
}
