import { useEffect, useState } from 'react';

/**
 * True once `url` is confirmed to serve a PDF. Checks the content type, because
 * SPA hosts and the Vite dev server answer missing files with index.html (200).
 */
export function usePdfAvailable(url: string): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch(url, { method: 'HEAD' })
      .then((r) => alive && setOk(r.ok && (r.headers.get('content-type') ?? '').includes('pdf')))
      .catch(() => alive && setOk(false));
    return () => {
      alive = false;
    };
  }, [url]);
  return ok;
}
