import { ReactNode } from "react";
import { Button, ButtonProps, Link } from "react-aria-components";
import { ThemeOption } from "../types";

export type CGButtonProps = ButtonProps & { theme?: ThemeOption, hue?: 'light' | 'dark', size?: 'sm' | 'md' | 'lg' | 'xl', href?: string }

export const CGButton = ({ children, theme = 'secondary', hue, size, href, ...props }: CGButtonProps) => {
    let themeClassName = !props.isDisabled ? `bg-${theme}-400 text-${theme}-900 hover:bg-${theme}-300 hover:text-${theme}-950 ` : `bg-tertiary-300 text-tertiary-900 hover:bg-tertiary-300 hover:text-tertiary-950 `

    if (hue === 'light') {
        themeClassName = !props.isDisabled ? `bg-${theme}-200 text-${theme}-600 hover:bg-${theme}-300 hover:text-${theme}-700 ` : `bg-tertiary-100 text-tertiary-700 hover:bg-tertiary-100 hover:text-tertiary-700 `
    } else if (hue === 'dark') {
        themeClassName = !props.isDisabled ? `bg-${theme}-800 text-${theme}-100 hover:bg-${theme}-700 hover:text-${theme}-50 ` : `bg-tertiary-700 text-tertiary-100 hover:bg-tertiary-700 hover:text-tertiary-100 `
    }

    if (size === 'sm') {
        themeClassName += ' text-sm py-0.5 px-1 rounded-md sm:py-1 sm:px-2 sm:text-base '
    } else if (size === 'md' || size === undefined) {
        themeClassName += ' text-base py-1 px-2 rounded-lg sm:py-2 sm:px-4 sm:text-lg '
    } else if (size === 'lg') {
        themeClassName += ' text-lg py-2 px-4 rounded-xl sm:py-3 sm:px-6 sm:text-xl '
    } else if (size === 'xl') {
        themeClassName += ' text-xl py-3 px-6 rounded-2xl sm:py-4 sm:px-8 sm:text-2xl '
    }

    return href ? <Link href={href} className={`shadow-sm flex flex-row items-center justify-evenly ${themeClassName} ${props.className} `}>{children as ReactNode}</Link> : <Button {...props} className={`shadow-sm flex flex-row items-center justify-evenly ${themeClassName} ${props.className} `}>{children}</Button>
}