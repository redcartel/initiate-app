import { ButtonProps, Button } from "react-aria-components"

export const ClearButton = (props: ButtonProps) => {
    return (
        <Button {...props} className={`bg-transparent border-none outline-none`} {...props}>{props.children}</Button>
    )
}