
export const FullPage = ({ children, className }: React.PropsWithChildren &
{ className?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center w-svw bg-tertiary-900 text-tertiary-200">
            <div className={`flex flex-col items-center justify-center h-svh max-w-[430px] min-w-[375px] margin-x-auto bg-tertiary-800 text-tertiary-200 ${className ?? ''}`}>
                {children}
            </div>
        </div>
    );
}