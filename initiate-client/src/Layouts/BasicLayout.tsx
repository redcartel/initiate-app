import { useContext } from "react"
import { CGButton } from "../Components/CGButton"
import { CGText } from "../Components/CGText"
import { FooterArea } from "./LayoutElements/FooterArea"
import { FullPage } from "./LayoutElements/FullPage"
import SessionContext from "../Context/SessionContext"
import { CGYSpace } from "../Components/CGYSpace"
import { HTMLModal } from "./LayoutElements/HTMLModal"

export const BasicLayout = ({ children, className }: React.PropsWithChildren & { className?: string }) => {
    const { errMsg } = useContext(SessionContext);

    return <FullPage>
        { errMsg && <CGYSpace className="flex flex-row items-center justify-center bg-destructive-900"><CGText theme="destructive"  className="text-lg font-bold">{errMsg}</CGText></CGYSpace> }
        <main className={`flex flex-col justify-start items-center w-96 flex-grow flex-1 overflow-y-auto`}>
            {children}
        </main>
        <FooterArea>
            <div className="flex flex-row justify-center items-center w-full">
                <CGButton theme="secondary" href="/basic" hue="dark">
                    <CGText>
                        App Root
                    </CGText>
                </CGButton>
                <HTMLModal htmlLink={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/html/index.html' : 'https://api.d20init.com/html/index.html'}>
                    <CGButton theme="primary" hue="light" className="ml-8">
                        Rulebook
                    </CGButton>
                </HTMLModal>
            </div>
        </FooterArea>
    </FullPage>
}