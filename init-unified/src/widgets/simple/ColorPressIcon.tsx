import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { Button, ButtonProps, Link, LinkProps } from "react-aria-components"
import { ButtonSizeOptions, ButtonThemeOptions } from "../types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const ColorPressIcon = ({ icon, href, theme, size, ...props }: ButtonProps & { icon: IconDefinition, href?: string, theme?: ButtonThemeOptions, size?: ButtonSizeOptions }) => {
    let colorClassName = 'text-cyan-700'
    let activeClassName = 'active:text-cyan-400 focus:text-cyan-400 [&[data-hovered]]:text-cyan-400';
    let sizeClassName = 'text-lg'
    let buttonClassName = ''

    if (theme === 'action') {
        colorClassName = 'text-lime-600'
        activeClassName = 'active:text-lime-400 focus:text-lime-400 [&[data-hovered]]:text-lime-400'
    }
    else if (theme === 'main-nav') {
        colorClassName = 'text-amber-700'
        activeClassName = 'active:text-amber-400 focus:text-amber-400 [&[data-hovered]]:text-amber-400'
    }
    else if (theme === 'destructive') {
        colorClassName = 'text-red-700'
        activeClassName = 'active:text-red-400 focus:text-red-400 [&[data-hovered]]:text-red-400'
    }

    if (props.isDisabled) {
        colorClassName = 'text-slate-400'
        buttonClassName = 'cursor-not-allowed'
    }

    if (size === 'sm') {
        sizeClassName = 'text-lg'
    }
    else if (size === 'md') {
        sizeClassName = 'text-2xl'
    }
    else if (size === 'lg') {
        sizeClassName = 'text-3xl'
    }

    return href ? (
        <Link {...props as LinkProps} className={`flex flex-col items-center justify-center ${colorClassName} ${activeClassName}`} href={props.isDisabled ? '' : href} aria-disabled={props.isDisabled} >
            <FontAwesomeIcon className={`${sizeClassName}`} icon={icon} />
        </Link>
    ) : (
        <Button  {...props} className={`${colorClassName} ${activeClassName} bg-none p-0 m-0 ${buttonClassName}`}>
            <FontAwesomeIcon className={`${sizeClassName}`} icon={icon} />
        </Button>
    )
}