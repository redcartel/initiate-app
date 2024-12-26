import React, { useEffect, useId, useState } from 'react';
import { useAppState } from "../../hooks/useAppState";
import { Label, ListBox, ListBoxItem, Text } from 'react-aria-components';
import { AppState } from '../../context/AppStateContext';
import InitButton from '../../components/individual-components/InitButton';
import InitInput from '../../components/individual-components/InitInput';

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


    const handleChange = (value: string) => {
        console.log('handleChange', value);
        const _orders = state.orders ? state.orders : {};
        const newOrders = { ..._orders, [state.page ?? 0]: { ..._orders[state.page ?? 0], [question.key]: value } };
        dispatch((state: AppState) => ({ ...state, orders: newOrders }));
    }
    return state.orders && state.orders[state.page ?? 0] && (
        <div className=''>
            {

                showFollowUp && (state.orders[state.page ?? 0][question.key] in question.followUp || '*' in question.followUp) && (
                    <div className='flex flex-col items-center gap-2 p-4 border-2 rounded-lg bg-blue-50 border-blue-950'>
                        <InputSwitch page={state.page ?? 0} question={question.followUp[state.orders[state.page ?? 0][question.key]] || question.followUp['*']} handleBackButton={() => setShowFollowUp(false)} />
                    </div>
                ) ||
                (
                    <></>
                )
            }
            {!showFollowUp && (
                <div>
                    <Label id={labelId} className='text-lg font-bold text-center'>
                        {question.title}
                    </Label>
                </div>
            )}
            {
                !showFollowUp && question.type === "select" && (
                    <div className='flex flex-col items-center gap-2 p-4 border-2 rounded-lg bg-blue-50 border-blue-950'    >
                        {
                            question.type === "select" &&
                            <>

                                <ListBox
                                    aria-labelledby={labelId}
                                    onSelectionChange={(e) => {
                                        console.log('e', (e as Set<string>).values().next().value)
                                        if ((e as Set<string>).values().next().value === undefined) {
                                            handleChange(state.orders[state.page ?? 0][question.key] ?? question.options[0].default)
                                        }
                                        else {
                                            handleChange((e as Set<string>).values().next().value)
                                        }
                                        if (question.followUp && (question.followUp[state.orders[state.page ?? 0][question.key]] || question.followUp['*'])) {
                                            setShowFollowUp(true);
                                        }
                                        else {
                                            dispatch((state: AppState) => ({ ...state, page: state.page + 1 }));
                                        }
                                    }}
                                    selectionMode="single"
                                    selectedKeys={new Set([state.orders[state.page ?? 0][question.key] ?? question.options[0].default])}
                                >
                                    {question.options.map((option: { label: string, value: string }) => (
                                        <ListBoxItem className='p-2 m-2 text-center text-white bg-blue-600 border-2 rounded-lg border-blue-950'
                                            id={option.value} key={option.value} textValue={option.label}>
                                            {option.label}
                                        </ListBoxItem>
                                    ))}
                                </ListBox>
                            </>
                        }
                    </div>
                )
            }
            {
                !showFollowUp && question.type === "text" &&
                <>
                    <div className='mb-2'>
                        <Label id={labelId}>
                            {question.title}
                        </Label>
                    </div>
                    <div className='mb-2'>
                        <Text className='text-sm text-center'>
                            {question.description}
                        </Text>
                    </div>
                    <div className='flex flex-col gap-2 mb-2'>
                        <InitInput aria-labelledby={labelId} value={state.orders[state.page ?? 0][question.key] ?? ''} onChange={handleChange} className='min-h-20' />
                        {question.followUp && (question.followUp['*'] &&
                            <InitButton onPress={() => setShowFollowUp(true)}>Continue Section</InitButton>
                        )}
                        {!question.followUp &&
                            <InitButton onPress={() => dispatch((state: AppState) => ({ ...state, page: state.page + 1 }))} className='bg-green-500'>Next Page</InitButton>
                        }
                    </div>
                </>
            }
            {
                !showFollowUp && (
                    <>
                        <style>
                            {`
.__description p {
    margin-bottom: 1rem;
}                            
`}
                        </style>
                        <div className='mt-2'>
                            <Text className='text-sm text-left __description' id={descriptionId}>
                                {question.description}
                            </Text>
                        </div>
                    </>
                )
            }
            {
                handleBackButton &&
                <InitButton onPress={handleBackButton} className='bg-yellow-300'>Back</InitButton>
            }
        </div >
    )
}

export default InputSwitch;