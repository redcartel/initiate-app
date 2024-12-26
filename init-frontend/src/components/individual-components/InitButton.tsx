import { Button, PressEvent } from "react-aria-components";

const InitButton = ({ children, onPress, type, className }: { children: React.ReactNode, onPress?: (e: PressEvent) => void, type?: 'button' | 'submit' | 'reset', className?: string }) => {
    return (
        <Button onPress={onPress} type={type} className={`p-2 bg-blue-200 border-2 border-blue-900 rounded-md ${className}`}>{children}</Button>
    )
}

export default InitButton;