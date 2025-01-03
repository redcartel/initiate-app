import { CGButton } from "../Components/CGButton"
import { CGText } from "../Components/CGText"
import { FooterArea } from "./LayoutElements/FooterArea"
import { FullPage } from "./LayoutElements/FullPage"

export const BasicLayout = ({ children, className }: React.PropsWithChildren & { className?: string }) => {
    console.log('BasicLayout');
    return <FullPage>
        <main className={`flex flex-col justify-evenly items-center ${className} w-full flex-grow flex-1`}>
            {children}
        </main>
        <FooterArea>
            <div className="flex flex-row justify-center items-center w-full">
                <CGButton theme="secondary" href="/" hue="dark">
                    <CGText>
                        Home
                    </CGText>
                </CGButton>
            </div>
        </FooterArea>
    </FullPage>
}