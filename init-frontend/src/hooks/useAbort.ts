import { useEffect } from "react";

export const useAbort = (controller: AbortController) => {
    useEffect(() => {
        return () => {
            controller.abort();
        };
    }, [controller]);
};
