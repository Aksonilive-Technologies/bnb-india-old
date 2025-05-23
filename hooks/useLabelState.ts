import { useDebugValue, useState } from "react";

type UseLabelReturnType<T> = [T, React.Dispatch<React.SetStateAction<T>>];

/**
 * A custom React hook that manages the state of a value with an associated label for debugging purposes.
 *
 * @template T - The type of the value to be managed.
 * @param {T} initialValue - The initial value of the state.
 * @param {string} label - A human-readable label for the state, used for debugging.
 * @returns {UseLabelReturnType<T>} - An array containing:
 *   - The current value of the state (`T`).
 *   - A function to update the state value (`React.Dispatch<React.SetStateAction<T>>`).
 * @example
 * // Usage:
 * const [count, setCount] = useLabelState(0, 'Count');
 */
const useLabelState = <T>(
  initialValue: T,
  label: string,
): UseLabelReturnType<T> => {
  const [value, setValue] = useState(initialValue);
  useDebugValue(`${label}: ${value}`);
  return [value, setValue];
};
export default useLabelState;
