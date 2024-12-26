import { useAppState } from "../hooks/useAppState";
import DropDown from "./EntryForm-components/DropDown";

export default function EntryForm() {
    const { state } = useAppState();

    console.log(state);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formOptions = state.formOptions ? Object.keys(state.formOptions).reduce<any[]>((acc, curr) => {
        acc.push([curr, state.formOptions[curr]]);
        return acc;
    }, []).map(formOption => <DropDown onUpdateValue={(value) => console.log(value)} key={JSON.stringify(formOption)} formOption={formOption} />) : [];

    return (
        <div>
            {formOptions}
        </div>
    )
}