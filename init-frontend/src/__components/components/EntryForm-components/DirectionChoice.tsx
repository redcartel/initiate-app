import { useEffect, useState } from "react";

export default function DirectionChoice({ handleUpdate }: { handleUpdate: (value: string) => void }) {
    const [ewDistance, setEwDistance] = useState<number>(0);
    const [nsDistance, setNsDistance] = useState<number>(0);

    useEffect(() => {
        handleUpdate(Math.abs(ewDistance) + (ewDistance >= 0 ? 'E' : 'W') + ':' + Math.abs(nsDistance) + (nsDistance >= 0 ? 'N' : 'S'));
    }, [ewDistance, handleUpdate, nsDistance]);

    return (
        <div className="form-group">
            <div className="mb-3">
                <label className="form-label">East/West Movement (ft)</label>
                <input
                    type="range"
                    className="form-range"
                    min={-300}
                    max={300}
                    step={5}
                    value={ewDistance}
                    onChange={(e) => setEwDistance(parseInt(e.target.value))}
                />
                <div className="text-center">
                    {Math.abs(ewDistance)}ft {ewDistance >= 0 ? 'East' : 'West'}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">North/South Movement (ft)</label>
                <input
                    type="range"
                    className="form-range"
                    min={-300}
                    max={300}
                    step={5}
                    value={nsDistance}
                    onChange={(e) => setNsDistance(parseInt(e.target.value))}
                />
                <div className="text-center">
                    {Math.abs(nsDistance)}ft {nsDistance >= 0 ? 'North' : 'South'}
                </div>
            </div>
        </div>
    )
}