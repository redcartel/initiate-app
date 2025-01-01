import { ReactNode } from "react";
import { Button, ButtonProps, Link } from "react-aria-components";
import { ThemeOption } from "../types";

export type CGButtonProps = ButtonProps & { theme: ThemeOption, hue?: 'light' | 'dark', size?: 'sm' | 'md' | 'lg' | 'xl', href?: string }

export const CGButton = ({ children, theme = 'secondary', hue, size, href, ...props }: CGButtonProps) => {
    let themeClassName = !props.isDisabled ? `bg-${theme}-400 text-${theme}-900 hover:bg-${theme}-300 hover:text-${theme}-950 ` : `bg-${theme}-400 text-${theme}-900 hover:bg-${theme}-400 hover:text-${theme}-900 `

    if (hue === 'light') {
        themeClassName = !props.isDisabled ? `bg-${theme}-200 text-${theme}-600 hover:bg-${theme}-300 hover:text-${theme}-700 ` : `bg-${theme}-200 text-${theme}-600 hover:bg-${theme}-200 hover:text-${theme}-600 `
    } else if (hue === 'dark') {
        themeClassName = !props.isDisabled ? `bg-${theme}-800 text-${theme}-100 hover:bg-${theme}-700 hover:text-${theme}-50 ` : `bg-${theme}-800 text-${theme}-100 hover:bg-${theme}-800 hover:text-${theme}-100 `
    }

    if (size === 'sm') {
        themeClassName += ' text-base py-1 px-2 rounded-md '
    } else if (size === 'md' || size === undefined) {
        themeClassName += ' text-lg py-2 px-4 rounded-lg '
    } else if (size === 'lg') {
        themeClassName += ' text-xl py-3 px-6 rounded-xl '
    } else if (size === 'xl') {
        themeClassName += ' text-2xl py-4 px-8 rounded-2xl '
    }

    return href ? <Link href={href} className={`shadow-sm flex flex-row items-center justify-evenly ${themeClassName} ${props.className} `}>{children as ReactNode}</Link> : <Button {...props} className={`shadow-sm flex flex-row items-center justify-evenly ${themeClassName} ${props.className} `}>{children}</Button>
}