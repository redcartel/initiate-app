import { useEffect, useState } from 'react';
import FollowUpQuestion from './FollowUpQuestion';

interface SingleQuestionDropDownProps {
    formData: {
        title: string;
        name: string;
        options: [string, string][]; // [name, displayName]
    };
    handleUpdate: (value: string) => void;
    initialSelection?: string;
}

const SingleQuestionDropDown: React.FC<SingleQuestionDropDownProps> = ({
    formData,
    handleUpdate,
    initialSelection,
}) => {

    const [value, setValue] = useState<string>(initialSelection || '');

    useEffect(() => {
        handleUpdate(value);
    }, [handleUpdate, value]);

    return (
        <div className="form-group mb-3">
            <label className="form-label">{formData.title}</label>
            <select
                className="form-select"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            >
                <option value="">Select an option</option>
                {formData.options.map(([value, displayName]) => (
                    <option key={value} value={value}>
                        {displayName}
                    </option>
                ))}
            </select>
            <FollowUpQuestion previousValue={value} handleUpdate={(newValue: string) => handleUpdate(value + ':' + newValue)} />
        </div>
    );
};

export default SingleQuestionDropDown;