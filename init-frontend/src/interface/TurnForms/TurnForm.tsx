import { Heading } from "react-aria-components";
import { useAppState } from "../../hooks/useAppState";
import { CharacterSheet } from "../../hooks/useCharacterSheet";
import InputSwitch from "./InputSwitch";
import InitButton from "../../components/individual-components/InitButton";
import { AppState } from "../../context/AppStateContext";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReviewForm } from "./ReviewForm";

const TurnForm = ({ characterSheet }: { characterSheet: CharacterSheet }) => {
    const { state, dispatch } = useAppState();

    return (
        <>
            {state.orders &&
                <>

                    <div>
                        <InitButton isDisabled={state.page < 1} onPress={() => dispatch((state: AppState) => ({ ...state, page: state.page - 1 }))} className='flex flex-row items-center justify-between w-full text-black bg-green-300 [&[data-disabled]]:bg-gray-600 [&[data-disabled]]:text-gray-300'>
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Previous Page
                        </InitButton>
                    </div>
                    <div className="flex flex-col w-full gap-2 p-2 border-4 rounded-md border-gray-950">
                        {
                            state.page !== undefined && state.page < characterSheet?.turnPages.length &&
                            <>
                                <div className="flex flex-col gap-2 text-center">
                                    <Heading level={2} className="text-xl font-bold text-center">{characterSheet?.turnPages[state.page ?? 0].title}</Heading>
                                    <p>{characterSheet?.turnPages[state.page ?? 0].description}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <InputSwitch question={characterSheet?.turnPages[state.page ?? 0].question} page={state.page ?? 0} />
                                </div>
                            </>
                        }
                        {
                            state.page !== undefined && state.page >= characterSheet?.turnPages.length &&
                            <div className="flex flex-col gap-2 text-center">
                                <Heading level={2} className="text-xl font-bold text-center">Turn Complete</Heading>
                                <ReviewForm characterSheet={characterSheet} />
                            </div>
                        }
                    </div>

                    <InitButton
                        isDisabled={
                            characterSheet?.turnPages[state.page ?? 0]?.question?.followUp && (characterSheet?.turnPages[state.page ?? 0].question.followUp[state.orders[state.page ?? 0]] || characterSheet?.turnPages[state.page ?? 0].question.followUp['*'])
                        }
                        onPress={() => dispatch((state: AppState) => ({ ...state, page: state.page + 1 }))} className='flex flex-row items-center justify-between bg-green-300 text-black bg-green-300[&[data-disabled]]:bg-gray-600 [&[data-disabled]]:text-gray-300'>
                        Next Page
                        <FontAwesomeIcon icon={faArrowRight} />
                    </InitButton>
                </>}
        </>
    )
}

export default TurnForm;