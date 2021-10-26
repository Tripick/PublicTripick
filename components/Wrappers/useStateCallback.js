import { useCallback, useEffect, useRef, useState } from "react";

export default function useStateCallback(initialState) {
  const [state, _setState] = useState(initialState);

  const callbackRef = useRef();
  const isFirstCallbackCall = useRef(true);

  const setState = (newState, callback) => {
    callbackRef.current = callback;
    _setState(newState);
  };

  useEffect(() => {
    if (isFirstCallbackCall.current) isFirstCallbackCall.current = false;
    else callbackRef.current?.(state);
  }, [state]);

  return [state, setState];
}
