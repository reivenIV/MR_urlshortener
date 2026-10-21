import { useEffect, type RefObject } from "react";

// While `active` is true, call `onOutside` when the user presses the mouse
// anywhere outside the element in `ref`. Used to cancel edits / close inputs.
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onOutside: () => void,
) {
  useEffect(() => {
    if (!active) return;
    function handleMouseDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handleMouseDown);
    // Cleanup: stop listening when editing ends or the component disappears.
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [ref, active, onOutside]);
}
