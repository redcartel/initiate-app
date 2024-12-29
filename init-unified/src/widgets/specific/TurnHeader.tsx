import { faBars } from "@fortawesome/free-solid-svg-icons/faBars"
import { Heading } from "react-aria-components"
import { ColorPressIcon } from "../simple/ColorPressIcon"
import { ClearButton } from "../simple/ClearButton"

type OrdersHeaderProps = {
    title: string
    subtitle?: string
    onBack?: () => void
    onMenu?: () => void
    onCharacterInfo?: () => void
}

export const TurnHeader = ({ title, onMenu, onCharacterInfo }: OrdersHeaderProps) => {
    return (
        <header className="w-full h-14 bg-amber-200">
            <div className="flex flex-col items-center justify-between">
                <div className="flex flex-row items-center justify-between w-full p-2">
                    <div></div>
                    <ClearButton onPress={onCharacterInfo}><Heading className="text-xl font-bold text-center text-amber-600"> {title}</Heading></ClearButton>
                    <ColorPressIcon onPress={onMenu} icon={faBars} theme="main-nav" size="lg" aria-label="Menu" />
                </div>
            </div>
        </header>
    )
}