import { FocusScope } from "react-aria";

const InitWrap = ({ children }: { children: React.ReactNode }) => {
    return <div className='flex flex-col p-0 mx-auto min-h-svh max-w-96'>
        <FocusScope contain autoFocus>
            {children}
        </FocusScope>
    </div>
}

export default InitWrap;