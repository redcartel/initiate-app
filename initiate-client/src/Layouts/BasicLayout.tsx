import { useContext } from "react"
import { CGButton } from "../Components/CGButton"
import { CGText } from "../Components/CGText"
import { FooterArea } from "./LayoutElements/FooterArea"
import { FullPage } from "./LayoutElements/FullPage"
import SessionContext from "../Context/SessionContext"
import { CGYSpace } from "../Components/CGYSpace"

export const BasicLayout = ({ children, className }: React.PropsWithChildren & { className?: string }) => {
    const { errMsg } = useContext(SessionContext);

    return <FullPage>
        { errMsg && <CGYSpace className="flex flex-row items-center justify-center bg-destructive-900"><CGText theme="destructive"  className="text-lg font-bold">{errMsg}</CGText></CGYSpace> }
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