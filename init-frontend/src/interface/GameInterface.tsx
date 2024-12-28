import { useEffect } from "react";
import useCharacterSheet from "../hooks/useCharacterSheet";
import InitForm from "../components/individual-components/InitForm";
import TurnForm from "./TurnForms/TurnForm";
import { useAppState } from "../hooks/useAppState";
import ClearTurnButton from "../components/functional-components/ClearTurnButton";
import { AppState } from "../context/AppStateContext";

const GameInterface = ({ gameId, characterId }: { gameId: string | null, characterId: string | null }) => {
    const { characterSheet } = useCharacterSheet(gameId!, characterId!);
    const { state, dispatch } = useAppState();
    useEffect(() => {
        if (state.page === undefined) {
            dispatch((state: AppState) => ({ ...state, page: 0 }));
        }
    }, [state.page, dispatch]);


    useEffect(() => {

        if (!state.orders) {
            dispatch((state: AppState) => ({ ...state, orders: { [state.page ?? 0]: {} } }));
        }
        else if (state.orders[state.page ?? 0] === undefined) {
            dispatch((state: AppState) => ({ ...state, orders: { ...state.orders, [state.page ?? 0]: {} } }));
        }
    }, [state.orders, dispatch, state]);

    return (state.page !== undefined &&
        <InitForm onSubmit={() => {

        }} label='Enter Orders' description='Enter your orders for the turn'>
            <>
                <TurnForm characterSheet={characterSheet} />
                <div className='flex flex-row justify-center gap-2'>
                    <ClearTurnButton />
                </div >

            </>
        </InitForm>
    )
}

export default GameInterface;