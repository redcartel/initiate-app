import { useParams } from "react-router-dom";

const Interface = () => {
    const params = useParams();

    return (
        <>
            <pre>
                {JSON.stringify(params, null, 2)}
            </pre>
        </>
    );
}

export default Interface;