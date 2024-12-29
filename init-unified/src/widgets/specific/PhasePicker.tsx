import { useAppState } from "../../hooks/useAppState";
import { ColorButton } from "../simple/ColorButton";
import { ButtonThemeOptions } from "../types";

export const PhasePicker = ({ phases }: { phases: { label: string, id: string, theme?: ButtonThemeOptions }[] }) => {

    const { state, dispatch } = useAppState();

    const currentPhase = state?.activeAdmin ? state?.adminState?.phase : (state.currentPlayerId ? state?.playerStates[state?.currentPlayerId]?.phase : null);

    const handlePhaseChange = (phase: string) => {
        if (state.activeAdmin) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dispatch((state: any) => ({
                ...state,
                adminState: {
                    ...state.adminState,
                    phase: phase
                }
            }))
        }
        else if (state.currentPlayerId && state.playerStates[state.currentPlayerId]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dispatch((state: any) => ({
                ...state,
                playerStates: {
                    ...state.playerStates,
                    [state.currentPlayerId]: {
                        ...state.playerStates[state.currentPlayerId],
                        phase: phase
                    }
                }
            }))
        }
    }

    return (
        <div className="flex flex-row items-center justify-between w-full h-12 gap-0.5 p-1 bg-slate-200">
            {phases.map(phase => (
                <ColorButton size="sm" theme={phase.theme} key={phase.id} onPress={() => handlePhaseChange(phase.id)} className={`flex-1 
                ${phase.theme === 'action' ?
                        (currentPhase === phase.id ? 'bg-lime-600 text-lime-100' : 'bg-lime-200 text-lime-900') :
                        (currentPhase === phase.id ? 'bg-cyan-600 text-cyan-100' : 'bg-cyan-200 text-cyan-900')}`}>
                    {phase.label}
                </ColorButton>
            ))}
        </div>
    )
}