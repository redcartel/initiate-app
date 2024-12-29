import { useNavigate } from "react-router-dom"
import { useAppState } from "../hooks/useAppState"
import { PlayAdminPicker } from "../widgets/specific/PlayAdminPicker"
import { TurnHeader } from "../widgets/specific/TurnHeader"
import { useEffect } from "react"
import { PhasePicker } from "../widgets/specific/PhasePicker"
import { TurnFooter } from "../widgets/specific/TurnFooter"

export const TurnViewLayout = ({ children }: { children: React.ReactNode }) => {

    const { state } = useAppState()

    const navigate = useNavigate()

    useEffect(() => {
        if (!state.adminSession) {
            navigate('/gm')
        }
        else if (!state.activeAdmin) {
            navigate('/play/orders')
        }
    }, [state.adminSession, state.activeAdmin, navigate])

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-amber-600">
            <TurnHeader title="Turn 7" subtitle="Capture the Flag #4" />
            <PlayAdminPicker />
            <PhasePicker phases={[
                { label: 'Reaction', id: 'reaction' },
                { label: 'Action', id: 'action1' },
                { label: 'Move', id: 'move1' },
                { label: 'Action', id: 'action2' },
                { label: 'Move', id: 'move2' }
            ]} />
            <div className="flex-grow w-full overflow-y-auto bg-slate-50">
                {children}
            </div>
            <TurnFooter />
        </div>
    )
}