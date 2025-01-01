import { Input, InputProps } from "react-aria-components";

export const CGTextInput = ({ ...props }: InputProps) => {
    return <Input type="text"  {...props} className={`px-8 py-4 text-2xl tracking-wider text-center rounded-xl bg-tertiary text-primary-950 rounded-2xl ${props.className}`} />
}