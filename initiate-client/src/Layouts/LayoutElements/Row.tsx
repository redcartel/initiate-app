
export const Row = ({ children, className }: React.PropsWithChildren &
{ className?: string }) => {
    return <div className={`flex flex-row w-full ${className ?? ''}`}>
        {children}
    </div>
}