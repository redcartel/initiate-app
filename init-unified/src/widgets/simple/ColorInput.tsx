import { Input, InputProps, Label, Text } from "react-aria-components"
import { ButtonThemeOptions, ButtonSizeOptions } from "../types"
import { useId } from "react"

export const ColorInput = ({ theme, size, label, description, errorMessage, outerClassName, ...props }: InputProps & { theme?: ButtonThemeOptions, size?: ButtonSizeOptions, label?: string, description?: string, errorMessage?: string, outerClassName?: string }) => {
    let colorClassName = 'bg-cyan-100 text-cyan-900 border-cyan-900'
    let sizeClassName = 'text-xl font-extrabold h-16 px-6'
    let actionClassName = 'active:bg-slate-200 focus:bg-slate-200'
    let labelColorClassName = 'text-lg font-extrabold text-cyan-400'
    let labelSizeClassName = 'text-lg font-extrabold'
    let descriptionColorClassName = 'text-sm text-cyan-200'
    let descriptionSizeClassName = 'text-sm'

    const id = useId()

    if (theme === 'primary') {
        // pass
    }
    else if (theme === 'action') {
        colorClassName = 'bg-lime-100 text-lime-900 border-lime-900'
        actionClassName = 'active:bg-lime-200 focus:bg-lime-200'
        labelColorClassName = 'text-lg font-extrabold text-lime-400'
        labelSizeClassName = 'text-lg font-extrabold'
        descriptionColorClassName = 'text-sm text-lime-200'
        descriptionSizeClassName = 'text-sm'
    }
    else if (theme === 'main-nav') {
        colorClassName = 'bg-amber-100 text-amber-900 border-amber-900'
        actionClassName = 'active:bg-amber-200 focus:bg-amber-200'
        labelColorClassName = 'text-lg font-extrabold text-amber-400'
        labelSizeClassName = 'text-lg font-extrabold'
        descriptionColorClassName = 'text-sm text-amber-200'
        descriptionSizeClassName = 'text-sm'
    }
    else if (theme === 'destructive') {
        colorClassName = 'bg-red-100 text-red-900 border-red-900'
        actionClassName = 'active:bg-red-200 focus:bg-red-200'
        labelColorClassName = 'text-lg font-extrabold text-red-400'
        labelSizeClassName = 'text-lg font-extrabold'
        descriptionColorClassName = 'text-sm text-red-200'
        descriptionSizeClassName = 'text-sm'
    }

    if (props.disabled) {
        colorClassName = 'bg-slate-400 text-slate-100 border-slate-900'
        actionClassName = 'cursor-not-allowed'
    }

    if (size === 'sm') {
        sizeClassName = 'text-lg font-extrabold h-12 px-4'
    }
    else if (size === 'md') {
        // pass
    }
    else if (size === 'lg') {
        sizeClassName = 'text-2xl font-extrabold h-20 px-8'
    }



    const propsClass = props.className ?? ''

    return (!label && !description ? (
        <div className={`flex flex-col items-start justify-start w-full gap-1 ${outerClassName}`}>
            <Input className={`rounded-md ${sizeClassName} ${colorClassName} ${actionClassName} ${propsClass}`} {...props} />
            {errorMessage && <Text className={`text-sm text-red-500 font-bold`} slot="errorMessage">{errorMessage}</Text>}
        </div>
    ) : (
        <div className={`flex flex-col items-start justify-start w-full gap-1 ${outerClassName}`}>
            <div className="flex flex-row items-baseline justify-start w-full gap-2">
                {label && <Label className={`${labelColorClassName} ${labelSizeClassName}`} id={`${id}-label`}>{label}</Label>}
                {errorMessage && <Text className={`ml-2 text-sm text-red-500 font-bold`} slot="errorMessage">{errorMessage}</Text>}
            </div>
            <Input aria-describedby={`${id}-description`} aria-labelledby={`${id}-label`} className={`rounded-md ${sizeClassName} ${colorClassName} ${actionClassName}  ${propsClass}`} {...props} />
            {description && <Text slot="description" className={`italic ${descriptionColorClassName} ${descriptionSizeClassName}`} id={`${id}-description`}>{description}</Text>}
        </div>
    ))
}