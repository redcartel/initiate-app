import { CGButton } from "../../Components/CGButton"
import { CGIcon } from "../../Components/CGIcon"
import { GetResponse } from "../../QueryTypes/getResponse"

export function ClientHeaderContent(props: { data: GetResponse }) {
    if (props.data.layout !== 'client' || !props.data.header) return <></>
    
    return <>
        <div>
            
        </div>
        <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-2xl font-bold">{props.data.header.title}</div>
            <div className="text-sm text-primary-500">{props.data.header.subtitle}</div>
        </div>
        <CGButton theme="primary" size="sm" hue='light'>
            <CGIcon iconKey="menu" />
        </CGButton>
    </>
}