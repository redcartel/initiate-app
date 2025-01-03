import { Heading } from "react-aria-components"
import { HeaderArea } from "./LayoutElements/HeaderArea"
import { FullPage } from "./LayoutElements/FullPage"
import { FooterArea } from "./LayoutElements/FooterArea"
import { MainArea } from "./LayoutElements/MainArea"
import { PhaseSwitcherContents } from "./LayoutElements/PhaseSwitcher"
import { PhaseLink } from "../QueryTypes/getResponse";
import { CGText } from "../Components/CGText"
import { useContext } from "react"
import SessionContext from "../Context/SessionContext"
import { CGYSpace } from "../Components/CGYSpace"

export const ClientLayout = ({ children, headingContent, footerContent, phaseLinks }: { children: React.ReactNode, headingContent?: React.ReactNode, footerContent?: React.ReactNode, phaseLinks?: PhaseLink[] }) => {
    const { errMsg } = useContext(SessionContext);
    
    return <FullPage>
        <HeaderArea>
            {headingContent ?? <Heading level={1} className="text-xl">...</Heading>}
        </HeaderArea>
        {phaseLinks && phaseLinks.length > 0 && <div className="flex flex-row justify-between items-center px-1 py-2 bg-tertiary-200 w-full">
            <PhaseSwitcherContents phaseLinks={phaseLinks} />
        </div>}
        { errMsg && <CGYSpace className="flex flex-row items-center justify-center bg-destructive-900"><CGText theme="destructive"  className="text-lg font-bold">{errMsg}</CGText></CGYSpace> }
        <MainArea>
            {children}
        </MainArea>
        <FooterArea>
            {footerContent ?? <CGText>...</CGText>}
        </FooterArea>
    </FullPage>
}