import { useId } from "react";
import { Form, Label, Text } from "react-aria-components";
import { FocusScope } from "react-aria";
const InitForm = ({ children, onSubmit, label, description }: { children: React.ReactNode, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, label: string, description: string }) => {
    const id = useId();
    return (
        <FocusScope restoreFocus contain autoFocus>
            <Form onSubmit={onSubmit} className="flex flex-col flex-1 gap-2 p-2 m-4 border-2 border-blue-200 rounded-lg bg-blue-50" aria-labelledby={id} aria-describedby={`${id}-description`}>
                <Label id={id} className="text-lg text-gray-900">{label}</Label>
                <Text className="text-sm text-gray-900" id={`${id}-description`} slot='description'>{description}</Text>
                {children}
            </Form >
        </FocusScope>
    );
}

export default InitForm;