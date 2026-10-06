import { useEffect, useState } from 'react';

/** True once `url` loads as a real image (a missing file never renders a broken icon). */
export function useImageAvailable(url: string): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setOk(img.naturalWidth > 0);
    img.onerror = () => setOk(false);
    img.src = url;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);
  return ok;
}
