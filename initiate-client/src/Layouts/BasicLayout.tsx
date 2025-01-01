import { FullPage } from "./LayoutElements/FullPage"

export const BasicLayout = ({ children, className }: React.PropsWithChildren & { className?: string }) => {
    return <FullPage>
        <main className={`flex flex-col justify-evenly items-center ${className}`}>
            {children}
        </main>
    </FullPage>
}