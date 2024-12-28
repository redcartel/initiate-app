import { useRequest } from "./useRequest";
import { DeleterOptions } from "../../../init-frontend/src/hooks/useDeleter";

const useDeleter = <T>(url: string, options: DeleterOptions) => {
    return useRequest<T>(url, { ...options, method: 'DELETE' });
}

export { useDeleter }