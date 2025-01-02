import { CGButton } from "../../Components/CGButton";
import { CGIcon } from "../../Components/CGIcon";
import { HTMLModal } from "../../Layouts/LayoutElements/HTMLModal";
import { GetResponse } from "../../QueryTypes/getResponse";

export function ClientFooterContent(props: { data: GetResponse }) {
    if (props.data.layout !== 'client' || !props.data.footer) return <></>

    return <>
        <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-sm text-primary-100">
                {props.data.footer.htmlLink ? <HTMLModal htmlLink={props.data.footer.htmlLink}><CGButton theme="primary" hue="light"><CGIcon iconKey="scroll" className="mr-2"/>Character Sheet</CGButton></HTMLModal> : <></>}
            </div>
        </div>
    </>
}