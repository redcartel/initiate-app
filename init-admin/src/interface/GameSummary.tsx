import { useNavigate, useParams } from "react-router"
import { AdminButton } from "../components/individual-components"
import { useGetter } from "../hooks/useGetter"
import { usePutter } from "../hooks/usePutter"

export const GameSummary = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { request: getGame, data: game, loading: gameLoading } = useGetter<any>('/api/v1/adminGame', { execute: true })
    const { data: templates, loading: templatesLoading } = useGetter<{ templates: string[] }>('/api/v1/adminGame/templateList', { execute: true })
    const { request: setTemplate } = usePutter<{ templates: string[] }>('/api/v1/adminGame/setTemplate', {})
    const { gameId, adminId } = useParams()
    const navigate = useNavigate()

    if (gameLoading) {
        return <div>Loading...</div>
    }

    if (!game?.template) {
        if (templatesLoading) {
            <div>Loading templates...</div>
        }
        if (templates) {
            console.log(templates)
            return <div>
                {templates.templates?.map((template, idx) => {
                    console.log(template)
                    return (
                        <AdminButton key={idx} onPress={() => {
                            setTemplate({
                                params: {},
                                body: {
                                    template: template,
                                },
                            }).then(() => {
                                getGame({
                                    params: {},
                                    body: {}
                                })
                                navigate(`/${adminId}/${gameId}`)
                            })
                        }}>
                            {template}
                        </AdminButton>
                    )
                })}
            </div>
        }
    }

    return <div className="flex flex-col gap-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {game?.characters?.map((character: any) => {
            return <div>
                {character.name} : {character.id} <AdminButton onPress={() => {
                    navigator.share({
                        title: character.name,
                        url: `${import.meta.env.VITE_CLIENT_URL}/${adminId}/${gameId}/${character.id}`
                    })
                }}>View</AdminButton>
            </div>
        })}
    </div>
}

export default GameSummary;
