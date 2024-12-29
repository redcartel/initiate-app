import { ColorInput } from "../widgets/simple/ColorInput";
import { Heading } from "react-aria-components";
import { ColorPressIcon } from "../widgets/simple/ColorPressIcon";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons/faArrowAltCircleLeft";
import { ColorButton } from "../widgets/simple/ColorButton";

export const StartGame = () => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted");
    }

    return (
        <div className="flex flex-col items-center justify-center w-full gap-4 px-10 min-h-svh bg-cyan-900">
            <ColorPressIcon icon={faArrowAltCircleLeft} theme="action" size="lg" href="/" />
            <Heading className="text-4xl font-extrabold text-amber-600">Start A Game</Heading>
            <form onSubmit={handleSubmit}>
                <ColorInput type="email" theme="primary" label="Email (Optional)" description="Receive a link to your game's admin page. Address not saved in any database." outerClassName="my-8" />
                <ColorButton type="submit" theme="action" size="md">
                    Start a New Game
                </ColorButton>
            </form>
        </div>
    )
}