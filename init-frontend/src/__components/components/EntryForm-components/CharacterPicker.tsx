import React, { useState, useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';

interface CharacterSelectProps {
    handleUpdate: (character: string) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ handleUpdate }) => {
    const { state } = useAppState();
    const [selectedCharacter, setSelectedCharacter] = useState<string>('');

    useEffect(() => {
        if (selectedCharacter) {
            handleUpdate(selectedCharacter);
        }
    }, [selectedCharacter, handleUpdate]);

    return (
        <form>
            <select
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
            >
                <option value="" disabled>Select a character</option>
                {['nearest enemy', 'nearest friend', ...state.characters].map((character: string) => (
                    <option key={character} value={character}>
                        {character.charAt(0).toUpperCase() + character.slice(1)}
                    </option>
                ))}
            </select>
        </form>
    );
};