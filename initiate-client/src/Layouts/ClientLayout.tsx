import { Heading } from "react-aria-components"
import { HeaderArea } from "./LayoutElements/HeaderArea"
import { FullPage } from "./LayoutElements/FullPage"
import { FooterArea } from "./LayoutElements/FooterArea"
import { MainArea } from "./LayoutElements/MainArea"
import { PhaseSwitcherContents } from "./LayoutElements/PhaseSwitcher"
import { PhaseLink } from "../QueryTypes/getResponse";
import { CGText } from "../Components/CGText"

export const ClientLayout = ({ children, headingContent, footerContent, phaseLinks }: { children: React.ReactNode, headingContent?: React.ReactNode, footerContent?: React.ReactNode, phaseLinks?: PhaseLink[] }) => {
    return <FullPage>
        <HeaderArea>
            {headingContent ?? <Heading level={1} className="text-xl">...</Heading>}
        </HeaderArea>
        {phaseLinks && phaseLinks.length > 0 && <div className="flex flex-row justify-between items-center px-1 py-2 bg-tertiary-200 w-full">
            <PhaseSwitcherContents phaseLinks={phaseLinks} />
        </div>}
        <MainArea>
            {children}
        </MainArea>
        <FooterArea>
            {footerContent ?? <CGText>...</CGText>}
        </FooterArea>
    </FullPage>
}