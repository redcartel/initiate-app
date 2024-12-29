
import { makeOrderOption } from "../data-representation/OrderOptions";
import { useAppState } from "../hooks/useAppState";

const OrderForm = () => {
    const { state, dispatch } = useAppState();

    if (!state.currentPlayerId) {
        return <>no player</>
    }

    if (!state.orderOptions[state.currentPlayerId]) {
        dispatch(state => ({
            ...state,
            orderOptions: {
                ...state.orderOptions,
                [state.currentPlayerId]: {}
            }
        }));
        return <></>
    }

    let phase = 'reaction';

    if (state.playerTurnStates[state.currentPlayerId].phase) {
        phase = state.playerTurnStates[state.currentPlayerId].phase;
    }

    const questionOption = makeOrderOption(state.orderOptions[state.currentPlayerId][phase]);

    console.log(questionOption);

    return <div>
        <pre>{questionOption?.vals.label}</pre>
    </div>
}

export default OrderForm;