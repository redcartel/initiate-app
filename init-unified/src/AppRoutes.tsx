import { Route, Routes } from "react-router";
import { Welcome } from "./screens/Welcome";
import { CharacterOrdersHome } from "./screens/CharacterOrdersHome";
import { CharacterPicker } from "./screens/CharacterPicker";
import { StartGame } from "./screens/StartGame";
import { InviteCode } from "./screens/InviteCode";
import { useAppState } from "./hooks/useAppState";
import { dummyState } from "./context/dummyState";
import { useEffect } from "react";
import { TurnViewHome } from "./screens/TurnViewHome";

export const AppRoutes = () => {

    const { state, dispatch } = useAppState()

    useEffect(() => {
        if (!state.adminSession) {
            dispatch(state => ({ ...state, ...dummyState }))
        }
    }, [dispatch, state.adminSession])

    return (
        <div className="h-svh w-svw bg-slate-900">
            <div className="flex flex-col items-center justify-center h-full mx-auto max-w-112">
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/play" element={<InviteCode />} />
                    <Route path="/play/orders" element={<CharacterOrdersHome />} />
                    <Route path="/play/select" element={<CharacterPicker />} />
                    <Route path="/gm" element={<StartGame />} />
                    <Route path="/gm/turn" element={<TurnViewHome />} />
                </Routes>
            </div>
        </div>
    )
}