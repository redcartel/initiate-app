import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CGButton } from "../../Components/CGButton";
import CGHeading from "../../Components/CGHeading";
import { CGText } from "../../Components/CGText";
import { CGTextAreaInput } from "../../Components/CGTextAreaInput";
import { CGYSpace } from "../../Components/CGYSpace";
import { GetResponse } from "../../QueryTypes/getResponse"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { PostBody } from "../../QueryTypes/postBody";

export const TextAreaInputContents = ({ data, setPostBody }: { data: GetResponse, setPostBody: (body: PostBody) => void }) => {
    const [value, setValue] = useState('');

    if (data.content.type !== 'textarea') {
        return null;
    }
    return <>
        <CGYSpace>
            <CGHeading level={1} theme="secondary" hue='light' className="text-2xl text-center border-none stroke-none">{data?.content.title}</CGHeading>
        </CGYSpace>
        <CGYSpace className="flex flex-row items-center justify-center w-full px-2">
            <CGText theme="secondary" hue="light" className="text-center">{data?.content.subtitle}</CGText>
        </CGYSpace>
        <CGYSpace className="flex flex-row items-center justify-center w-full px-2">
            <CGText theme="secondary" hue="light" className="text-center">{data?.content.description}</CGText>
        </CGYSpace>
        <CGYSpace className="flex flex-column justify-between items-center w-full px-2">
            <CGTextAreaInput value={value} onChange={e => setValue(e.target.value)} className="w-full" />

        </CGYSpace>
        <CGYSpace className="flex flex-row justify-center w-full px-2">
            <CGButton theme="action" className="ml-4 h-10 w-12" onPress={() => {
                setPostBody({ value: value })
            }}><FontAwesomeIcon icon={faArrowRight} /></CGButton>
        </CGYSpace>
    </>
}