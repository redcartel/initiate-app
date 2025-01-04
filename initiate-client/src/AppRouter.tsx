import { Route, Routes } from "react-router-dom"
import { ParseView } from "./RouteViews/ParseView"
import { usePostQuery } from "./Queries/usePostQuery"
import { useEffect } from "react";
import { specialKeys } from "../../initiate-backend/src/consts";
export const AppRouter = () => {
    const { fetchData } = usePostQuery();

    useEffect(() => {
        if (window.localStorage.getItem('sessionKey') && window.location.pathname === '/') {
            fetchData({value: specialKeys.requestRedirect})
        }
    }, []);
    return <Routes>
        <Route path="/*" element={<ParseView />} />
    </Routes>
}