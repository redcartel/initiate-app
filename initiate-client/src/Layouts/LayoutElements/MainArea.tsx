
export const MainArea = ({ children }: React.PropsWithChildren) => {
    return <div className="flex flex-col items-center flex-1 flex-grow w-full h-full overflow-y-auto justify-evenly bg-tertiary-50 text-tertiary-950">
        {children}
    </div>
}