
import { useParams } from "react-router-dom";

const useRouteIds = () => {
    const { adminId, gameId } = useParams();
    return { adminId, gameId };
}

export default useRouteIds;