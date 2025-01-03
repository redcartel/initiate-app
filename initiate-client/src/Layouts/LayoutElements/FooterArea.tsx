
export const FooterArea = ({ children, className }: React.PropsWithChildren & { className?: string }) => {
    console.log('FooterArea');
    return <div className={`flex flex-row items-center justify-center flex-shrink w-full min-h-24 bg-primary-600 text-primary-50 flex-0 ${className ?? ''}`}>
        {children}
    </div>
}   