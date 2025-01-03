import { Heading } from "react-aria-components"
import { HeaderArea } from "./LayoutElements/HeaderArea"
import { FullPage } from "./LayoutElements/FullPage"
import { FooterArea } from "./LayoutElements/FooterArea"
import { MainArea } from "./LayoutElements/MainArea"
import { GetResponse } from "../QueryTypes/getResponse"
import { PhaseSwitcherContents } from "./LayoutElements/PhaseSwitcher"
import { AdminModeSwitcher } from "./LayoutElements/AdminModeSwitcher"
import { useContext } from "react"
import SessionContext from "../Context/SessionContext"
import { CGText } from "../Components/CGText"
import { CGYSpace } from "../Components/CGYSpace"

export const AdminLayout = ({ children, headingContent, footerContent, data }: { children: React.ReactNode, headingContent?: React.ReactNode, footerContent?: React.ReactNode, data: GetResponse }) => {
    const { errMsg } = useContext(SessionContext);

    return <FullPage>
        <HeaderArea>
            {headingContent ?? <Heading level={1} className="text-xl">...</Heading>}
        </HeaderArea>
        { data.layout === 'admin' && data.phaseSelect && <div className="flex flex-row items-center justify-between bg-tertiary-500 p-1 w-full"><PhaseSwitcherContents phaseLinks={data.phaseSelect} /></div> }
        { errMsg && <CGYSpace className="flex flex-row items-center justify-center bg-destructive-900"><CGText theme="destructive"  className="text-lg font-bold">{errMsg}</CGText></CGYSpace> }
        <MainArea>
            {children}
        </MainArea>
        { data.layout === 'admin' && data.adminModeSelect && <div className="flex flex-row items-center justify-between bg-primary-900 p-1 w-full border-t-4 border-t-primary-600"><AdminModeSwitcher adminModeSelect={data.adminModeSelect} /></div> }
        <FooterArea>
            {footerContent ?? <Heading level={1} className="text-xl">...</Heading>}
        </FooterArea>
    </FullPage>
}