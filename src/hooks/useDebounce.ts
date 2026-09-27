import { useCallback, useEffect, useRef } from "react"

export function useDebounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 300,
) {
  const callbackRef = useRef(callback)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => () => clearTimeout(timerRef.current), [delay])

  return useCallback((...args: TArgs) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => callbackRef.current(...args), delay)
  }, [delay])
}
