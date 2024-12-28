import { PutterOptions } from "../../../init-frontend/src/hooks/usePutter";
import { useRequest } from "./useRequest";

const usePutter = <T>(url: string, options: PutterOptions) => {
    return useRequest<T>(url, { ...options, method: 'PUT' });
}

export { usePutter }