import { Route, Routes } from "react-router-dom"
import { ParseView } from "./RouteViews/ParseView"

export const AppRouter = () => {
    console.log('AppRouter');
    return <Routes>
        <Route path="/*" element={<ParseView />} />
    </Routes>
}