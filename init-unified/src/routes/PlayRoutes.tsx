import { Route } from "react-router-dom"
import { Routes } from "react-router-dom"
import { InviteCode } from "../screens/InviteCode"
import { CharacterPicker } from "../screens/CharacterPicker"
import { CharacterOrdersHome } from "../screens/CharacterOrdersHome"

export const PlayRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<InviteCode />} />
            <Route path="/orders" element={<CharacterOrdersHome />} />
            <Route path="/:pubId" element={<CharacterPicker />} />
        </Routes>
    )
}