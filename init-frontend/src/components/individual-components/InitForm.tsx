import { useId } from "react";
import { Form, Label, Text } from "react-aria-components";
const InitForm = ({ children, onSubmit, label, description, className }: { children: React.ReactNode, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, label: string, description: string, className?: string }) => {
    const id = useId();
    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e);
            return false;
        }} className={`flex flex-col flex-1 gap-2 p-2 py-6 m-4 border-2 border-blue-200 rounded-lg bg-blue-50 ${className}`} aria-labelledby={id} aria-describedby={`${id}-description`}>
            <div className="flex flex-col items-center gap-2 p-1 text-white bg-blue-600 rounded-lg">
                <Label id={id} className="text-lg">{label}</Label>
                <Text className="text-sm" id={`${id}-description`} slot='description'>{description}</Text>
            </div>
            {children}
        </Form>
    );
}

export default InitForm;