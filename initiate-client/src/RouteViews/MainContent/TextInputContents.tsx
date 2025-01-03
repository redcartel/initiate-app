import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CGButton } from "../../Components/CGButton";
import CGHeading from "../../Components/CGHeading";
import { CGText } from "../../Components/CGText";
import { CGTextInput } from "../../Components/CGTextInput";
import { CGYSpace } from "../../Components/CGYSpace";
import { GetResponse } from "../../QueryTypes/getResponse"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { PostBody } from "../../QueryTypes/postBody";
import SessionContext from "../../Context/SessionContext";

export const TextInputContents = ({ data, setPostBody, hue }: { data: GetResponse, setPostBody: (body: PostBody) => void, hue?: 'light' | 'dark' }) => {
    if (data.content.type !== 'text') {
        throw new Error('TextInputContents called with non-text content');
    }

    const [value, setValue] = useState(data.content.savedValue ?? '');
    const { setErrMsg } = useContext(SessionContext);

    return <>
        <CGYSpace>
            <CGHeading level={1} theme="secondary" hue={hue} className="text-2xl text-center border-none stroke-none">{data?.content.title}</CGHeading>
        </CGYSpace>
        <CGYSpace className="flex flex-row items-center justify-center w-full px-2">
            <CGText theme="secondary" hue={hue} className="text-center">{data?.content.subtitle}</CGText>
        </CGYSpace>
        <CGYSpace className="flex flex-row items-center justify-center w-full px-2">
            <CGText theme="secondary" hue={hue} className="text-center">{data?.content.description}</CGText>
        </CGYSpace>
        <CGYSpace className="flex flex-row justify-between w-full px-2">
            <CGTextInput value={value} onChange={e => { setValue(e.target.value); setErrMsg(null); }} className="flex-1" hue={hue} />
            <CGButton theme="action" hue={hue} className="ml-4" onPress={() => {
                setErrMsg(null);
                setPostBody({ value: value })
            }}><FontAwesomeIcon icon={faArrowRight} /></CGButton>
        </CGYSpace>
    </>
}