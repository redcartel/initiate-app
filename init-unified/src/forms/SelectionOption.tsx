import { OrderOption } from "../data-representation/OrderOptions";
import { useAppState } from "../hooks/useAppState";

const SelectionOption = ({ orderOption }: { orderOption: OrderOption }) => {
    const { state, dispatch } = useAppState();

    return <div>
        <pre>{orderOption.vals.label}</pre>
    </div>
}

export default SelectionOption;