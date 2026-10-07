import { useEffect, useState } from 'react';

/**
 * True once `url` is confirmed to serve a real file of the expected kind. Checks the
 * content type, because SPA hosts and the Vite dev server answer missing files with
 * index.html (200).
 */
export function useAssetAvailable(url: string, accepts: (contentType: string) => boolean): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch(url, { method: 'HEAD' })
      .then((r) => alive && setOk(r.ok && accepts(r.headers.get('content-type') ?? '')))
      .catch(() => alive && setOk(false));
    return () => {
      alive = false;
    };
    // `accepts` is an inline predicate at call sites, so only a new url re-checks
  }, [url]);
  return ok;
}
