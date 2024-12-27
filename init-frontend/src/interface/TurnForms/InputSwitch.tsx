import { useEffect, useId, useState } from 'react';
import { useAppState } from "../../hooks/useAppState";
import { Label, Text } from 'react-aria-components';
import { AppState } from '../../context/AppStateContext';
import InitButton from '../../components/individual-components/InitButton';
import SelectForm from './SelectForm';
import TextAreaForm from './TextAreaForm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputSwitch = ({ question, handleBackButton }: { page: number, question: any, handleBackButton?: () => void }) => {
    const { state, dispatch } = useAppState();
    const [showFollowUp, setShowFollowUp] = useState(false);

    const labelId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (document.getElementById(descriptionId)) {
            document.getElementById(descriptionId)!.innerHTML = question.description;
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
        <div className=''>
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
                        <div className='mt-2 mb-10'>
                            {question.description && <Text className='text-sm text-left __description' id={descriptionId}>
                                {question.description}
                            </Text>}
                        </div>
                    </>
                )
            }
            <div className='flex flex-col gap-2'>
                {
                    (
                        <>
                            {
                                handleBackButton &&
                                <InitButton onPress={handleBackButton} className='bg-yellow-100 text-gray-950'>Previous Sub-Section</InitButton>
                            }
                            {
                                !handleBackButton && state.page > 0 &&
                                <InitButton onPress={() => dispatch((state: AppState) => ({ ...state, page: state.page - 1 }))} className='text-black bg-green-300'>Previous Page</InitButton>
                            }
                            {
                                question.followUp &&
                                <InitButton isDisabled={
                                    !currentValue ||
                                    !(question.followUp[currentValue] || question.followUp['*'])
                                } onPress={() => setShowFollowUp(true)} className='bg-yellow-100 text-gray-950'>Continue Sub-Section</InitButton>
                            }
                            {
                                <InitButton
                                    isDisabled={
                                        question.followUp && (question.followUp[currentValue] || question.followUp['*'])
                                    }
                                    onPress={() => dispatch((state: AppState) => ({ ...state, page: state.page + 1 }))} className='text-black bg-green-300'>Next Page</InitButton>
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default InputSwitch;