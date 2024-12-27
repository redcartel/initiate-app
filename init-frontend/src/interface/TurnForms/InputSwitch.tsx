import { useEffect, useId, useState } from 'react';
import { useAppState } from "../../hooks/useAppState";
import { Label, Text } from 'react-aria-components';
import InitButton from '../../components/individual-components/InitButton';
import SelectForm from './SelectForm';
import TextAreaForm from './TextAreaForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputSwitch = ({ question, handleBackButton }: { page: number, question: any, handleBackButton?: () => void }) => {
    const { state } = useAppState();
    const [showFollowUp, setShowFollowUp] = useState(false);

    const labelId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (question && document.getElementById(descriptionId)) {
            document.getElementById(descriptionId)!.innerHTML = question.description ?? '';
        }
    }, [question, showFollowUp, descriptionId, state.orders, state.page])

    const followUp = question.followUp && (question.followUp[state.orders[state.page ?? 0][question.key]] || question.followUp['*'])

    const currentValue = state.orders && state.orders[state.page ?? 0] && question.key && state.orders[state.page ?? 0][question.key];

    if (showFollowUp && followUp) {
        return (
            <div className=''>
                <InputSwitch page={state.page ?? 0} question={question.followUp[state.orders[state.page ?? 0][question.key]] || question.followUp['*']} handleBackButton={() => setShowFollowUp(false)} />
            </div>
        )
    }

    return state.orders && state.orders[state.page ?? 0] && (
        <div className='flex flex-col gap-2'>
            {
                <div>
                    <InitButton isDisabled={!handleBackButton} onPress={handleBackButton} className='w-full bg-yellow-100 text-gray-950'>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Previous Sub-Section
                    </InitButton>
                </div>
            }
            <div>
                <Label id={labelId} className='text-lg font-bold text-center'>
                    {question.title}
                </Label>
            </div>
            {
                question.type === "select" && (
                    <SelectForm question={question} labelId={labelId} />
                )
            }
            {
                question.type === "text" &&
                <TextAreaForm question={question} labelId={labelId} />
            }
            {
                (
                    <>
                        <style>
                            {`
.__description p {
    margin-bottom: 1rem;
}                            
`}
                        </style>
                        <div className='mt-2'>
                            {question.description && <Text className='text-sm text-left __description' id={descriptionId}>
                                {question.description}
                            </Text>}
                        </div>
                    </>
                )
            }
            <div className='flex flex-col'>
                {
                    (
                        <>

                            {
                                question.followUp &&
                                <InitButton isDisabled={
                                    !currentValue ||
                                    !(question.followUp[currentValue] || question.followUp['*'])
                                } onPress={() => setShowFollowUp(true)} className='flex flex-row items-center justify-between mb-2 bg-yellow-100 text-gray-950'>Continue Sub-Section
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </InitButton>
                            }
                        </>
                    )
                }
            </div>
        </div >
    )
}

export default InputSwitch;