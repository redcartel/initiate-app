import { useParams } from "react-router";
import { useRequest as _useRequest, RequestOptions } from "../../../init-frontend/src/hooks/useRequest";

const useRequest = <T>(url: string, options: RequestOptions) => {
    const params = useParams();
    const { adminId, gameId } = params;

    let authorization = '';

    if (adminId && gameId) {
        authorization = `Bearer ${adminId}:${gameId}`;
    }
    else {
        authorization = `Bearer ${adminId}: `;
    }

    const _options = { headers: { 'Authorization': authorization, ...options.headers }, ...options }
    return _useRequest<T>(url, _options);
}

export { useRequest }