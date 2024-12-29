import { makeOrderOption } from "../data-representation/OrderOptions";
import { findOrderOption } from "../etc/destructure";
import { useAppState } from "../hooks/useAppState";
import { ColorButton } from "../widgets/simple/ColorButton";

const SelectionOption = () => {
    const { state } = useAppState();

    const currentKey = state.playerStates[state.currentPlayerId].openKey;

    const option = findOrderOption(currentKey, state.currentPlayerId, state);


    console.log('option', option);
    if (option?.type !== 'select') {
        console.log('not a select', option);
        return <></>
    }

    const optionObject = makeOrderOption(option);

    console.log(optionObject?.vals.label);


    return <div className="flex flex-col w-full gap-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {optionObject?.vals.selectOptions!.filter((option: any) => option !== undefined).map((option: any) => {
            return <div key={option.vals.key} className="flex flex-row gap-2">
                <ColorButton>{option.vals.label}</ColorButton>
            </div>
        })}
    </div>
}

export default SelectionOption;