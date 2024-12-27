import { useCallback } from "react";
import { useAppState } from "../../hooks/useAppState";
import { ListBox, ListBoxItem } from "react-aria-components";
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectForm = ({ question, labelId }: { question: any, labelId: string }) => {

    const { state, dispatch } = useAppState();

    const currentValue = state.orders[state.page ?? 0][question.key] ?? undefined;

    const handleChange = useCallback((value: string | undefined) => {
        const newValue = value ?? currentValue ?? question.options[0].default;



        dispatch(state => ({
            ...state,
            orders: {
                ...state.orders,
                [state.page ?? 0]: {
                    ...state.orders[state.page ?? 0],
                    [question.key]: newValue
                }
            }
        }))
    }, [dispatch, currentValue, question]);

    let selectedKeys = new Set<string>();

    if (state.orders && state.orders[state.page ?? 0] && state.orders[state.page ?? 0][question.key]) {
        selectedKeys = new Set([state.orders[state.page ?? 0][question.key]])
    }
    else if (question.options && question.options[state.page ?? 0] && question.options[state.page ?? 0].default) {
        selectedKeys = new Set([question.options[state.page ?? 0].default])
    }


    return (
        <ListBox
            aria-labelledby={labelId}
            onSelectionChange={(e) => {

                if ((e as Set<string>).values().next().value === undefined) {
                    handleChange(state.orders[state.page ?? 0][question.key] ?? question.options[0].default)
                }
                else {
                    handleChange((e as Set<string>).values().next().value)
                }
            }}
            selectionMode="single"
            selectedKeys={selectedKeys}
        >
            {
                (question.options ?? []).map((option: { label: string, value: string }) => (
                    <ListBoxItem className={`min-w-72 p-2 m-2 text-center text-white bg-blue-600 border-2 rounded-lg border-blue-950 [&[data-selected]]:bg-blue-300 [&[data-selected]]:border-blue-500 [&[data-selected]]:text-blue-950`}
                        id={option.value} key={option.value} textValue={option.label}>
                        <div className='flex flex-row gap-2'>
                            <div className='flex-1'>
                                {option.label}
                            </div>
                            {
                                state.orders[state.page ?? 0][question.key] === option.value &&
                                <div className='flex-0'>
                                    <span className='text-green-200'>
                                        <FontAwesomeIcon icon={faCheck} size='sm' />
                                    </span>
                                </div>
                            }
                        </div>
                    </ListBoxItem>
                ))}
        </ListBox>
    )
}

export default SelectForm;