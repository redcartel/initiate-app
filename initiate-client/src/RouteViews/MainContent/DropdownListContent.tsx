import { useState } from "react";
import { CGButton } from "../../Components/CGButton";
import { CGDropdown } from "../../Components/CGDropdown";
import CGHeading from "../../Components/CGHeading";
import { CGIcon } from "../../Components/CGIcon";
import { CGText } from "../../Components/CGText";
import { CGYSpace } from "../../Components/CGYSpace";
import { HTMLModal } from "../../Layouts/LayoutElements/HTMLModal";
import { AdminResponse, ClientResponse, DropdownListContent as DropdownListContentType } from "../../QueryTypes/getResponse";
import { usePostQuery } from "../../Queries/usePostQuery";

export const DropdownListContent = ({ data, errMsg }: { data: AdminResponse<DropdownListContentType> | ClientResponse<DropdownListContentType>, errMsg?: string }) => {
    let hue = undefined;

    const [openKeys, setOpenKeys] = useState([data.content.options.map(option => option.key).find(key => !data.content.savedValue?.includes(key))] ?? []);
    const [selectedKeys, setSelectedKeys] = useState(data.content.savedValue || []);

    const { fetchData } = usePostQuery();

    const handleToggle = (key: string) => {
        let newSelectedKeys = selectedKeys.includes(key) ? selectedKeys.filter((k: string) => k !== key) : [...selectedKeys, key];
        fetchData({value: newSelectedKeys})
        setSelectedKeys(newSelectedKeys);
    }

    return (
        <>
        <CGYSpace>
            <div className="flex flex-row items-center justify-between">
                <div className="w-10 ml-2"></div>
                    <CGHeading level={2} className="text-center" theme="primary">{data.content.title}</CGHeading>

                    
                    <div className="w-12 mr-2">
                        {data.content.htmlLink ? <HTMLModal htmlLink={data.content.htmlLink}>
                            <CGButton theme="primary" hue={hue} className="rounded-full mr-2">
                                <CGIcon iconKey='scroll' theme='blue' hue={hue === 'light' ? 'dark' : 'light'} />
                            </CGButton>
                        </HTMLModal> : <></>}
                    </div>
                    <div>

                    </div>
            </div>
        </CGYSpace>
        {errMsg && <CGYSpace className="flex flex-row items-center justify-center">
            <CGText theme="destructive" hue={hue} className="text-center">{errMsg}</CGText>
        </CGYSpace>}
        <CGYSpace className="flex flex-row items-center justify-center">
            <CGHeading level={4} className="text-center" hue={hue}>{data.content.subtitle}</CGHeading>
        </CGYSpace>
        { data.content.options.map(option => {
            let descriptionSegment = option.description?.split('::') ?? ['missing description'];
            return (
            <CGYSpace key={option.key} className="flex flex-row items-start justify-between w-full">
            <div className="w-14 h-12 mt-4 mr-2">
            { selectedKeys.includes(option.key) ? <CGButton theme={selectedKeys.includes(option.key) ? 'action' : 'tertiary'} hue={hue} className="rounded-full mr-2 w-10" onPress={() => handleToggle(option.key)}>
                <CGIcon iconKey='check' theme='action' />
            </CGButton> : <CGButton theme="tertiary" className="rounded-full mr-2 w-10" onPress={() => handleToggle(option.key)}>
                <CGIcon iconKey='check' theme='action' />
            </CGButton>}
        </div>
            <CGYSpace key={option.value}>
                <CGDropdown key={option.value} theme={selectedKeys.includes(option.key) ? 'tertiary' : 'secondary'} hue={hue} label={option.label} open={openKeys.includes(option.key)} onToggle={(open) => {
                if (open) {
                    setOpenKeys([...openKeys, option.key]);
            } else {
                    setOpenKeys(openKeys.filter((key: string | undefined) => key && key !== option.key));
                    }
                }}>
                    <>
                    {descriptionSegment.map((segment, index) => <CGYSpace key={index}><CGText>{segment}</CGText></CGYSpace>)}
                    </>
                </CGDropdown>
            </CGYSpace>
            <div className="w-14 h-12">
            {option.htmlLink ? <HTMLModal htmlLink={option.htmlLink}>
                            <CGButton theme='secondary' className="rounded-full mx-2 mt-4 w-10">
                                <CGIcon iconKey='scroll' theme='blue' hue={hue === 'light' ? 'dark' : 'light'} />
                            </CGButton>
                        </HTMLModal> : <div className="w-14 h-12"></div>}
            </div>
            </CGYSpace>
        )
    })}
        </>
    )
}
