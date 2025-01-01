import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CGButton } from "../../Components/CGButton";
import CGHeading from "../../Components/CGHeading";
import { CGText } from "../../Components/CGText";
import { CGTextInput } from "../../Components/CGTextInput";
import { CGYSpace } from "../../Components/CGYSpace";
import { GetResponse } from "../../QueryTypes/getResponse"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { PostBody } from "../../QueryTypes/postBody";

export const TextInput = ({ data, setPostBody }: { data: GetResponse, setPostBody: (body: PostBody) => void }) => {
    const [value, setValue] = useState('');

    if (data.content.type !== 'text') {
        return null;
    }
    return <>
        <CGYSpace>
            <CGHeading level={1} theme="secondary" hue='light' className="text-2xl text-center border-none stroke-none">{data?.content.title}</CGHeading>
        </CGYSpace>
        <CGYSpace className="flex flex-row items-center justify-center w-full px-2">
            <CGText theme="secondary" light className="text-center">{data?.content.subtitle}</CGText>
        </CGYSpace>
        <CGYSpace className="flex flex-row items-center justify-center w-full px-2">
            <CGText theme="secondary" light className="text-center">{data?.content.description}</CGText>
        </CGYSpace>
        <CGYSpace className="flex flex-row justify-between w-full px-2">
            <CGTextInput value={value} onChange={e => setValue(e.target.value)} className="flex-1" />
            <CGButton theme="action" className="ml-4" onPress={() => {
                setPostBody({ value: value })
            }}><FontAwesomeIcon icon={faArrowRight} /></CGButton>
        </CGYSpace>
    </>
}