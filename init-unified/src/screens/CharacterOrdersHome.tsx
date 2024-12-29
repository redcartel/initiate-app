import OrderForm from "../forms/OrderForm";
import { CharacterOrdersLayout } from "../layouts/CharacterOrdersLayout"

export const CharacterOrdersHome = () => {
    console.log('CharacterOrdersHome');

    return (
        <CharacterOrdersLayout>
            <OrderForm />
        </CharacterOrdersLayout>
    )
}