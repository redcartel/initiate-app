import { GetterOptions } from "../../../init-frontend/src/hooks/useGetter";
import { useRequest } from "./useRequest";

const useGetter = <T>(url: string, options: GetterOptions) => {
    return useRequest<T>(url, { ...options, method: 'GET' });
}

export { useGetter }
