import InitTextArea from "../../components/individual-components/InitTextArea";
import { AppState } from "../../context/AppStateContext";
import { useAppState } from "../../hooks/useAppState";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextAreaForm = ({ question, labelId }: { question: any, labelId: string }) => {
    const { state, dispatch } = useAppState();

    const handleChange = (value: string) => {
        dispatch((state: AppState) => ({ ...state, orders: { ...state.orders, [state.page ?? 0]: { ...state.orders[state.page ?? 0], [question.key]: value } } }));
    }

    return (
        <InitTextArea aria-labelledby={labelId} value={state.orders[state.page ?? 0][question.key] ?? ''} onChange={handleChange} />
    )
}

export default TextAreaForm;