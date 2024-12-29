
import { useAppState } from "../../hooks/useAppState";
import { ColorButton } from "../simple/ColorButton";

export const PlayAdminPicker = () => {
    const { state, dispatch } = useAppState()

    console.log(JSON.stringify(state, null, 2))

    if (!state.adminSession) {
        return null
    }

    return (
        <div className="flex flex-row items-center justify-center w-full gap-2 p-2 h-13 bg-slate-400">
            <ColorButton onPress={() => {
                dispatch(state => ({ ...state, activeAdmin: false }))
            }} className={`flex-1 ${state.activeAdmin ? 'bg-cyan-600 text-cyan-100' : 'bg-cyan-200 text-cyan-900'}`}
            >
                Player View
            </ColorButton>
            <ColorButton onPress={() => {
                dispatch(state => ({ ...state, activeAdmin: true }))
            }} className={`flex-1 ${state.activeAdmin ? 'bg-cyan-200 text-cyan-900' : 'bg-cyan-600 text-cyan-100'}`}
            >
                GM View
            </ColorButton>
        </div>
    )
}