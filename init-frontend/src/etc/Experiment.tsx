import { useGetter } from "../hooks/useGetter";

export const Experiment = () => {
    const { data, error } = useGetter('/api/v1/orderOptions', {
        execute: true,
    });


    return <pre>
        {JSON.stringify(data, null, 2)}
        ---
        {JSON.stringify(error, null, 2)}
    </pre>;
}