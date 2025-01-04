import { CGButton } from "../../Components/CGButton"
import CGHeading from "../../Components/CGHeading"
import CGLogo from "../../Components/CGLogo"
import { CGText } from "../../Components/CGText"
import { CGYSpace } from "../../Components/CGYSpace"
import { GetResponse } from "../../QueryTypes/getResponse"


export const InfoContent = ({ data, hue }: { data: GetResponse, hue?: 'light' | 'dark' }) => {
    const descriptionSegments = data.content.description?.split('__break__') ?? [];

    if (data.content.type !== 'info') {
        return null;
    }
    return (<>{
        data.content.logo &&
        <CGYSpace className="flex flex-row items-center justify-center">
            <CGLogo className="w-96" theme="primary" />
        </CGYSpace>
    }
        < CGYSpace className="mb-8" >
            <CGHeading level={1} theme="primary" hue={hue} className="text-[64px] text-center">{data?.content.title}</CGHeading>
        </CGYSpace >
        <CGYSpace>
            <CGHeading level={2} theme="secondary" hue={hue} className="font-sans text-xl italic font-extrabold text-center">{data?.content.subtitle}</CGHeading>
        </CGYSpace>
        {descriptionSegments.map((segment, index) => (
            <CGYSpace key={index} className="text-center">
                <CGText theme="secondary" hue={hue} className="text-center">{segment}</CGText>
            </CGYSpace>
        ))}
        <CGYSpace className="mt-8">
            <div className="flex flex-row w-full justify-evenly">
                {data?.content.linkButtons.map((button, index) => (
                    <CGButton key={index} theme={button.theme} href={button.href}>{button.label}</CGButton>
                ))}
            </div>
        </CGYSpace>
    </>
    )
}