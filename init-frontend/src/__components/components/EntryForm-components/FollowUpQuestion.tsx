
import { useEffect, useState } from 'react';
import { CharacterSelect } from './CharacterPicker';
import DirectionChoice from './DirectionChoice';
import SingleQuestionDropDown from './SingleQuestionDropDown';

interface FollowUpQuestionProps {
    previousValue: string;
    handleUpdate: (value: string) => void;
}

const FollowUpQuestion: React.FC<FollowUpQuestionProps> = ({
    previousValue,
    handleUpdate
}) => {
    const [followUpValue, setFollowUpValue] = useState<string>('');

    useEffect(() => {
        if (followUpValue) {
            handleUpdate(previousValue + ':' + followUpValue);
        }
    }, [followUpValue, handleUpdate, previousValue]);

    if (typeof previousValue === 'string') {
        if (previousValue === '->') {
            return <CharacterSelect handleUpdate={setFollowUpValue} />;
        }

        if (previousValue === 'XX') {
            return <DirectionChoice handleUpdate={setFollowUpValue} />;
        }

        if (previousValue === '__') {
            return <input type="text" value={followUpValue} onChange={(e) => setFollowUpValue(e.target.value)} />;
        }

        if (previousValue === '&&') {
            return <SingleQuestionDropDown formData={appSt} handleUpdate={setFollowUpValue} />;
        }

        return null;
    };

    if (typeof previousValue === 'object') {
        return <SingleQuestionDropDown formData={previousValue} handleUpdate={setFollowUpValue} />;
    }
}

export default FollowUpQuestion
