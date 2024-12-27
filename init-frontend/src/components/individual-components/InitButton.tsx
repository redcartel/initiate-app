import { Button, PressEvent } from "react-aria-components";

const InitButton = ({ children,
    onPress,
    type,
    className,
    autoFocus, isDisabled }: { children: React.ReactNode, onPress?: (e: PressEvent) => void, type?: 'button' | 'submit' | 'reset', className?: string, autoFocus?: boolean, isDisabled?: boolean }) => {
    return (
        <Button isDisabled={isDisabled} onPress={onPress} type={type} className={`p-2 bg-blue-200 border-2 border-blue-900 rounded-md ${className} [&[data-disabled]]:bg-gray-200 [&[data-disabled]]:border-gray-900 [&[data-disabled]]:text-gray-900`} autoFocus={autoFocus}>{children}</Button>
    )
}

export default InitButton;