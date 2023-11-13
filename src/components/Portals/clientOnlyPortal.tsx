import { useRef, useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export default function ClientOnlyPortal({
  children,
  selector,
}: {
  children: ReactNode;
  selector: string;
}) {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current = document.querySelector(selector);
      setMounted(true);
    }
  }, [selector]);

  mounted && ref.current ? createPortal(children, ref?.current) : null;
}
