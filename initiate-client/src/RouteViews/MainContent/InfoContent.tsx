import { CGButton } from "../../Components/CGButton"
import CGHeading from "../../Components/CGHeading"
import CGLogo from "../../Components/CGLogo"
import { CGText } from "../../Components/CGText"
import { CGYSpace } from "../../Components/CGYSpace"
import { GetResponse } from "../../QueryTypes/getResponse"

export const InfoContent = ({ data }: { data: GetResponse }) => {
    if (data.content.type !== 'info') {
        return null;
    }
    return (<>{
        data.content.logo &&
        <CGYSpace className="flex-1">
            <CGLogo className="w-96" theme="primary" />
        </CGYSpace>
    }
        < CGYSpace className="mb-8" >
            <CGHeading level={1} theme="primary" hue='light' className="text-[64px] text-center">{data?.content.title}</CGHeading>
        </CGYSpace >
        <CGYSpace>
            <CGHeading level={2} theme="secondary" hue='light' className="font-sans text-xl italic font-extrabold text-center">{data?.content.subtitle}</CGHeading>
        </CGYSpace>
        <CGYSpace className="text-center">
            <CGText theme="secondary" light className="text-center">{data?.content.description}</CGText>
        </CGYSpace>
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