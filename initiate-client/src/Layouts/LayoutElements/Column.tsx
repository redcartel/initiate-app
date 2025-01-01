
export const Column = ({ children, className }: React.PropsWithChildren &
{ className?: string }) => {
    return <div className={`flex flex-col w-full h-full justify-between items-center ${className ?? ''}`}>
        {children}
    </div>
}