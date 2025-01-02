import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CGButton } from "../../Components/CGButton";
import CGHeading from "../../Components/CGHeading";
import { CGText } from "../../Components/CGText";
import { CGTextAreaInput } from "../../Components/CGTextAreaInput";
import { CGYSpace } from "../../Components/CGYSpace";
import { GetResponse } from "../../QueryTypes/getResponse"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { PostBody } from "../../QueryTypes/postBody";
import SessionContext from "../../Context/SessionContext";

export const TextAreaInputContents = ({ data, setPostBody, hue }: { data: GetResponse, setPostBody: (body: PostBody) => void, hue?: 'light' | 'dark' }) => {
    if (data.content.type !== 'textarea') {
        throw new Error('TextAreaInputContents called with non-textarea content');
    }

    const [value, setValue] = useState(data.content.savedValue ?? '');
    const { errMsg, setErrMsg } = useContext(SessionContext);

    return <>
        <CGYSpace>
            <CGHeading level={2} theme="primary" className="text-2xl text-center border-none stroke-none">{data?.content.title}</CGHeading>
        </CGYSpace>
        {errMsg && <CGYSpace className="text-center">
            <CGText theme="destructive" hue={hue} className="text-center">{errMsg}</CGText>
        </CGYSpace>}
        <CGYSpace className="flex flex-row items-center justify-center w-full px-2">
            <CGText theme="secondary" hue={hue} className="text-center">{data?.content.subtitle}</CGText>
        </CGYSpace>
        <CGYSpace className="flex flex-row items-center justify-center w-full px-2">
            <CGText theme="secondary" hue={hue} className="text-center">{data?.content.description}</CGText>
        </CGYSpace>
        <CGYSpace className="flex flex-column justify-between items-center w-full px-2">
            <CGTextAreaInput value={value} hue='light' onFocus={() => {
                setErrMsg(null);
            }} onChange={e => {
                setValue(e.target.value);
            }} className="w-full bg-secondary-200" />

        </CGYSpace>
        <CGYSpace className="flex flex-row justify-center w-full px-2">
            <CGButton theme="action" className="ml-4 h-10 w-12" onPress={() => {
                setPostBody({ value: value })
            }}><FontAwesomeIcon icon={faArrowRight} /></CGButton>
        </CGYSpace>
    </>
}