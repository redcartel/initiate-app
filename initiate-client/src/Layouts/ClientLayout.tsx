import { Heading } from "react-aria-components"
import { HeaderArea } from "./LayoutElements/HeaderArea"
import { FullPage } from "./LayoutElements/FullPage"
import { FooterArea } from "./LayoutElements/FooterArea"
import { MainArea } from "./LayoutElements/MainArea"

export const ClientLayout = ({ children, headingContent, footerContent }: { children: React.ReactNode, headingContent?: React.ReactNode, footerContent?: React.ReactNode }) => {
    return <FullPage>
        <HeaderArea>
            {headingContent ?? <Heading level={1} className="text-xl">...</Heading>}
        </HeaderArea>
        <MainArea>
            {children}
        </MainArea>
        <FooterArea>
            {footerContent ?? <Heading level={1} className="text-xl">...</Heading>}
        </FooterArea>
    </FullPage>
}