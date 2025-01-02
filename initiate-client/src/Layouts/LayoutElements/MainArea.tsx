
export const MainArea = ({ children, className }: React.PropsWithChildren & { className?: string }) => {
    return <div className={`flex flex-col items-center flex-1 flex-grow w-full h-full overflow-y-auto justify-start ${className}`}>
        {children}
    </div>
}