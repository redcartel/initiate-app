import { useEffect } from "react";
import useCharacterSheet from "../hooks/useCharacterSheet";
import InitButton from "../components/individual-components/InitButton";
import InitForm from "../components/individual-components/InitForm";
import TurnForm from "./TurnForms/TurnForm";
import { useAppState } from "../hooks/useAppState";
import { ReviewForm } from "./TurnForms/ReviewForm";
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
        console.log('state.orders', state)
        if (!state.orders) {
            dispatch((state: AppState) => ({ ...state, orders: { [state.page ?? 0]: {} } }));
        }
        else if (state.orders[state.page ?? 0] === undefined) {
            dispatch((state: AppState) => ({ ...state, orders: { ...state.orders, [state.page ?? 0]: {} } }));
        }
    }, [state.orders, dispatch, state]);

    return (state.page !== undefined &&
        <InitForm onSubmit={() => {
            if (characterSheet?.turnPages && state.page < characterSheet?.turnPages.length) {
                dispatch((state: AppState) => ({ ...state, page: state.page + 1 }));
            }
            else {
                console.log('submit orders')
            }
        }} label='Enter Orders' description='Enter your orders for the turn'>
            <>
                {
                    characterSheet && state.page < characterSheet?.turnPages.length &&
                    <TurnForm characterSheet={characterSheet} />
                }
                {
                    characterSheet && state.page === characterSheet?.turnPages.length &&
                    <ReviewForm characterSheet={characterSheet} />
                }
                <div className='flex flex-row justify-center gap-2'>
                    {
                        (state.page > 0 &&
                            <InitButton onPress={() => dispatch((state: AppState) => ({ ...state, page: state.page - 1 }))}>Previous</InitButton>)
                        ||
                        (
                            <ClearTurnButton />
                        )
                    }
                    {
                        (state.page <= characterSheet?.turnPages.length &&
                            <InitButton type='submit' className='text-white bg-blue-500'>Next</InitButton>)
                        ||
                        (
                            <InitButton type='submit' className='text-white bg-green-500'>Submit Orders</InitButton>
                        )
                    }
                </div >

            </>
        </InitForm >
    )
}

export default GameInterface;