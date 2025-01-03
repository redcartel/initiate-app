import { CGButton } from "../../Components/CGButton"
import { CGIcon } from "../../Components/CGIcon"
import { GetResponse } from "../../QueryTypes/getResponse"

export function ClientHeaderContent(props: { data: GetResponse }) {
    if (props.data.layout === 'basic' || !props.data.header) return <></>

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    let  pathName = url.pathname
    pathName += searchParams.get('__headerMenu__') ? '' : '/HEADERMENU';
    const menuUrl = new URL(pathName, window.location.href);
    searchParams.forEach((value, key) => {
            menuUrl.searchParams.set(key, value);
    });

    return <>
        <div className="w-8 ml-2">
            
        </div>
        <div className="flex flex-col items-center justify-center py-1">
            <div className="text-2xl font-bold">{props.data.header.title}</div>
            <div className="text-sm text-primary-200">{props.data.header.subtitle}</div>
        </div>
        { url.href.includes('__headerMenu__') ? <></> : <CGButton theme="primary" size="sm" hue='light' className="w-8 mr-2" href={menuUrl.href}>
            <CGIcon iconKey="menu" />
        </CGButton>}
    </>
}