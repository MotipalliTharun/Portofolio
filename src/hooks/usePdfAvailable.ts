import { useAssetAvailable } from './useAssetAvailable';

/** True once `url` is confirmed to serve a PDF. */
export function usePdfAvailable(url: string): boolean {
  return useAssetAvailable(url, (type) => type.includes('pdf'));
}
