const InitMain = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <main className={`my-2 p-0 bg-gray-50 text-gray-900 ${className} flex-grow`}>
        {children}
    </main>
}

export default InitMain;