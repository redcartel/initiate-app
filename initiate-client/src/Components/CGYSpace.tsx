import { ReactNode } from "react"

export const CGYSpace = ({ children, className }: { children: ReactNode, className?: string }) => {
    return <div className={`my-2 w-full ${className ?? ''}`}>{children}</div>
}