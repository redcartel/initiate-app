
const InitWrap = ({ children }: { children: React.ReactNode }) => {
    return <div className='flex flex-col min-h-svh'>
        {children}
    </div>
}

export default InitWrap;