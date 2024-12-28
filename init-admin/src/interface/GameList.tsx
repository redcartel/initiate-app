import { useNavigate } from "react-router-dom";
import { AdminButton, AdminForm } from "../components/individual-components";
import { useGetter } from "../hooks/useGetter";
import useRouteIds from "../hooks/useRouteIds";
import { Text } from "react-aria-components";
import { usePoster } from "../hooks/usePoster";

const GameList = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = useGetter<any>(`/api/v1/adminAccess`, { execute: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: createData, request: createRequest } = usePoster<any>(`/api/v1/adminAccess/createAdmin`, { execute: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: createGameData, request: createGameRequest } = usePoster<any>(`/api/v1/adminAccess`, { execute: false });
    const navigate = useNavigate();
    const { adminId } = useRouteIds();


    if (error) {
        console.error(error);
        return <div>
            Error loading game list
        </div>
    }

    if (data?.createAdmin) {
        return <AdminForm onSubmit={() => {
            if (createData?.adminId) {
                window.location.href = `/${createData?.adminId}`;
            }
            else {
                createRequest({});
            }
        }} label="Enter Admin" description="Enter the admin ID to enter the admin interface." className="flex flex-col items-center justify-center gap-2">
            <Text>
                {createData?.adminId || 'Create a new admin'}
            </Text>
            <AdminButton type="submit">{createData?.adminId ? 'Create Admin' : 'Enter Admin'}</AdminButton>
        </AdminForm>
    }



    if (data) {
        return <div>
            {
                Object.keys(data).map((gameId) => {
                    return <div>
                        <AdminButton onPress={() => {
                            navigate(`/${adminId}/${gameId}`);
                        }}>{gameId}</AdminButton>
                    </div>
                })
            }
            <AdminButton onPress={() => {
                if (!createGameData?.id) {
                    createGameRequest({
                        params: {},
                        body: {}
                    })
                }
                else {
                    navigate(`/${adminId}/${createGameData?.id}`);
                }
            }}>
                {createGameData?.id ? createGameData.id : 'Create Game'}
            </AdminButton>
        </div>
    }
}

export default GameList;