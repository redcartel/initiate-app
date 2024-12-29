import { ColorInput } from "../widgets/simple/ColorInput";
import { Heading, Text } from "react-aria-components";
import { ColorPressIcon } from "../widgets/simple/ColorPressIcon";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons/faArrowAltCircleLeft";
import { ColorButton } from "../widgets/simple/ColorButton";
import { useNavigate } from "react-router-dom";

export const InviteCode = () => {
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('submitted');
        e.preventDefault();
        console.log('submitted', e);
        navigate('/play/select')
    }

    return (
        <div className="flex flex-col items-center justify-center w-full gap-4 px-10 min-h-svh bg-cyan-900">
            <ColorPressIcon icon={faArrowAltCircleLeft} theme="action" size="lg" href="/" />
            <Heading className="text-4xl font-extrabold text-amber-600">Game Invite Code</Heading>
            <Text className="text-lg italic text-center text-slate-200">
                Enter an invite code or request a link to join a game.
            </Text>
            <form onSubmit={handleSubmit}>
                <ColorInput theme="action" label="Invite Code" description="Enter an invite code or request a link to join a game." />
                <ColorInput theme="primary" label="Email (Optional)" description="Receive a link to your session. Address not saved in any database." />
                <ColorButton type='submit' theme="main-nav" size="md">
                    Join Game Now
                </ColorButton>
            </form>
        </div>
    )
}