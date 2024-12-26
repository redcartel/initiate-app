import { Heading } from "react-aria-components";
import { useAppState } from "../../hooks/useAppState";
import { CharacterSheet } from "../../hooks/useCharacterSheet";
import InputSwitch from "./InputSwitch";

const TurnForm = ({ characterSheet }: { characterSheet: CharacterSheet }) => {
    const { state } = useAppState();

    return (
        <>
            {state.orders &&
                <>
                    <div className="flex flex-col gap-2 text-center">
                        <Heading level={2} className="text-xl font-bold text-center">{characterSheet?.turnPages[state.page ?? 0].title}</Heading>
                        <p>{characterSheet?.turnPages[state.page ?? 0].description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <InputSwitch question={characterSheet?.turnPages[state.page ?? 0].question} page={state.page ?? 0} />
                    </div>
                </>}
        </>
    )
}

export default TurnForm;