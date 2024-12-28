import { PosterOptions } from "../../../init-frontend/src/hooks/usePoster";
import { useRequest } from "./useRequest";

const usePoster = <T>(url: string, options: PosterOptions) => {
    return useRequest<T>(url, { ...options, method: 'POST' });
}

export { usePoster }