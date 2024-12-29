import OrderForm from "../forms/OrderForm";
import { CharacterOrdersLayout } from "../layouts/CharacterOrdersLayout"

export const CharacterOrdersHome = () => {
    return (
        <CharacterOrdersLayout>
            <OrderForm />
        </CharacterOrdersLayout>
    )
}