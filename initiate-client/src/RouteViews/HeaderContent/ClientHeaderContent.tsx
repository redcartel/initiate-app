import { CGButton } from "../../Components/CGButton"
import { CGIcon } from "../../Components/CGIcon"
import { GetResponse } from "../../QueryTypes/getResponse"

export function ClientHeaderContent(props: { data: GetResponse }) {
    if (props.data.layout !== 'client' || !props.data.header) return <></>
    
    return <>
        <div className="w-8 ml-2">
            
        </div>
        <div className="flex flex-col items-center justify-center py-1">
            <div className="text-2xl font-bold">{props.data.header.title}</div>
            <div className="text-sm text-primary-200">{props.data.header.subtitle}</div>
        </div>
        <CGButton theme="primary" size="sm" hue='light' className="w-8 mr-2">
            <CGIcon iconKey="menu" />
        </CGButton>
    </>
}