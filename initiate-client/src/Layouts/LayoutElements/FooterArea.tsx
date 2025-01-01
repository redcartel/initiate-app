
export const FooterArea = ({ children, className }: React.PropsWithChildren & { className?: string }) => {
    return <div className={`flex flex-row items-center justify-center flex-shrink w-full min-h-24 bg-amber-600 text-amber-50 flex-0 ${className ?? ''}`}>
        {children}
    </div>
}   