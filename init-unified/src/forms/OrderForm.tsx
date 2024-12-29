
import { findOrderOption } from "../etc/destructure";
import { useAppState } from "../hooks/useAppState";
import SelectionOption from "./SelectionOption";

const OrderForm = () => {
    const { state } = useAppState();

    if (!state.currentPlayerId) {
        return <>no player</>
    }

    const currentPlayerId = state.currentPlayerId;

    const currentKey = state.playerStates[currentPlayerId].openKey;


    console.log('currentKey', currentKey);

    const orderOption = findOrderOption(currentKey, currentPlayerId, state);


    console.log('orderOption', orderOption);
    // const orderOption = findOrderOption(currentKey, currentPlayerId, state);

    return <div>
        {orderOption?.type === 'select' ? <SelectionOption /> : <></>}
    </div>
}

export default OrderForm;
