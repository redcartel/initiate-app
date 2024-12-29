import { Button, ButtonProps, Link, LinkProps } from "react-aria-components";
import { ButtonThemeOptions, ButtonSizeOptions } from "../types";

export const ColorButton = ({ theme = 'primary', size = 'md', icon, iconRight, href, ...props }: ButtonProps & { theme?: ButtonThemeOptions, size?: ButtonSizeOptions, icon?: React.ReactNode, iconRight?: React.ReactNode, href?: string }) => {
    let colorClassName = `bg-cyan-400 text-cyan-50 border-cyan-900`
    let actionClassName = `hover:bg-cyan-500 hover:text-cyan-200 hover:border-cyan-900 active:bg-cyan-100 active:text-cyan-700 active:border-cyan-400 border-2`
    let sizeClassName = `text-md font-extrabold h-12 px-4`

    if (theme === 'primary') {
        // pass
    }
    else if (theme === 'action') {
        colorClassName = `bg-lime-600 text-lime-100 border-lime-900`
        actionClassName = `hover:bg-lime-500 hover:text-lime-200 hover:border-lime-900 active:bg-lime-100 active:text-lime-600 active:border-lime-400 border-2`
    }
    else if (theme === 'main-nav') {
        colorClassName = `bg-amber-700 text-amber-100 border-amber-900`
        actionClassName = `hover:bg-amber-500 hover:text-amber-200 hover:border-amber-900 active:bg-amber-100 active:text-amber-700 active:border-amber-400 border-2`
    }
    else if (theme === 'destructive') {
        colorClassName = `bg-red-700 text-red-100 border-red-900`
        actionClassName = `hover:bg-red-500 hover:text-red-200 hover:border-red-900 active:bg-red-100 active:text-red-700 active:border-red-400 border-2`
    }

    if (size === 'md') {
        // pass 
    }
    else if (size === 'sm') {
        sizeClassName = `text-sm font-extrabold h-10 px-3`
    }
    else if (size === 'lg') {
        sizeClassName = `text-lg font-extrabold h-16 px-6`
    }

    if (props.isDisabled) {
        colorClassName = `bg-slate-400 text-slate-100 border-slate-900`
        actionClassName = `cursor-not-allowed`
    }

    const propsClass = props.className ?? ''

    return href ?
        (
            <Link  {...props as LinkProps} href={props.isDisabled ? '' : href} className={`cursor-pointer flex flex-row items-center justify-center rounded-md border-1 ${colorClassName} ${actionClassName} ${sizeClassName} ${propsClass}`}>
                {
                    !iconRight && icon
                }
                {props.children as React.ReactNode}
                {
                    iconRight && icon
                }
            </Link>
        )
        :
        (
            <Button  {...props} type={props.type ?? 'button'} className={`flex flex-row items-center justify-center rounded-md border-1 ${colorClassName} ${actionClassName} ${sizeClassName} ${propsClass}`}>
                {
                    !iconRight && icon
                }
                {props.children as React.ReactNode}
                {
                    iconRight && icon
                }
            </Button>
        )
}