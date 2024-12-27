import { FocusScope } from "react-aria";

const InitWrap = ({ children }: { children: React.ReactNode }) => {
    return <div className='flex flex-col p-0 min-h-svh'>
        <FocusScope contain autoFocus>
            {children}
        </FocusScope>
    </div>
}

export default InitWrap;