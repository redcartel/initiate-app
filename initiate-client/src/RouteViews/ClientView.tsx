
import { GetResponse } from "../QueryTypes/getResponse";
import { ClientLayout } from "../Layouts/ClientLayout";
import { FooterArea } from "../Layouts/LayoutElements/FooterArea";
import { ClientHeaderContent } from "./HeaderContent/ClientHeaderContent";
import { HeaderArea } from "../Layouts/LayoutElements/HeaderArea";
import { ClientFooterContent } from "./FooterContent/ClientFooterContent";
import { InfoContent } from "./MainContent/InfoContent";
import { SelectContent } from "./MainContent/SelectContent";
import { TextInputContents } from "./MainContent/TextInputContents";
import { TextAreaInputContents } from "./MainContent/TextAreaInputContents";
// import { MoveContent } from "./MainContent/MoveContent";
// import { AutoContent } from "./MainContent/AutoContent";
import { PostBody } from "../QueryTypes/postBody";

export function ClientView({ data, setPostBody }: { data: GetResponse, setPostBody: (body: PostBody) => void }) {

    if (data?.layout !== 'client') return <></>

    return <ClientLayout headingContent={<HeaderArea><ClientHeaderContent data={data} /></HeaderArea>} footerContent={<FooterArea><ClientFooterContent data={data} /></FooterArea>}>
        {(() => {
            switch (data.content.type) {
                case 'info':
                    return <InfoContent data={data} />
                case 'select':
                    return <SelectContent data={data} setPostBody={setPostBody} multiSelect={data.content.multiSelect} instantSubmit={data.content.instantSubmit} multiMax={data.content.multiMax} multiMin={data.content.multiMin} />
                case 'text':
                    return <TextInputContents data={data} setPostBody={setPostBody} />
                case 'textarea':
                    return <TextAreaInputContents data={data} setPostBody={setPostBody} />
                // case 'move':
                //     return <MoveContent data={props.data.content} />
                // case 'auto':
                //     return <AutoContent data={props.data.content} />
            }
        })()}
    </ClientLayout>
}