
export const HeaderArea = ({ children, className }: React.PropsWithChildren & { className?: string }) => {
    return <div className={`flex flex-row items-center justify-between flex-shrink w-full min-h-12 bg-primary-600 text-primary-50 flex-0 ${className ?? ''}`}>
        {children}
    </div>
}