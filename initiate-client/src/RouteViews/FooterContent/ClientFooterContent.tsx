import { GetResponse } from "../../QueryTypes/getResponse";

export function ClientFooterContent(props: { data: GetResponse }) {
    if (props.data.layout !== 'client' || !props.data.footer) return <></>

    return <>
        <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-sm text-secondary-900">{props.data.footer.infoText ? 'info' : ''}</div>
        </div>
    </>
}