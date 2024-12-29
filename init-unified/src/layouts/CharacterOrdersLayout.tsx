import { useNavigate } from "react-router-dom"
import { useAppState } from "../hooks/useAppState"
import { OrdersFooter } from "../widgets/specific/OrdersFooter"
import { OrdersHeader } from "../widgets/specific/OrdersHeader"
import { PlayAdminPicker } from "../widgets/specific/PlayAdminPicker"
import { useEffect } from "react"
import { PhasePicker } from "../widgets/specific/PhasePicker"
export const CharacterOrdersLayout = ({ children }: { children: React.ReactNode }) => {

    const { state } = useAppState()

    const navigate = useNavigate()

    useEffect(() => {
        if (state.activeAdmin) {
            navigate('/gm/turn')
        }
    }, [state.activeAdmin, navigate])

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-amber-600">
            <OrdersHeader title="Red Fighter" />
            <PlayAdminPicker />
            <PhasePicker phases={[
                { label: 'Reaction', id: 'reaction' },
                { label: 'Move', id: 'move1' },
                { label: 'Action', id: 'action' },
                { label: 'Move', id: 'move2' },
                { label: 'Review', id: 'review', theme: 'action' },
            ]} />
            <div className="flex-grow w-full overflow-y-auto bg-slate-50">
                {children}
            </div>
            <OrdersFooter />
        </div>
    )
}