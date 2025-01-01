import { BasicLayout } from "../Layouts/BasicLayout"
import { GetResponse } from "../QueryTypes/getResponse";
import { InfoContent } from "./MainContent/InfoContent";
import { TextInput } from "./MainContent/TextInputContents";
import { PostBody } from "../QueryTypes/postBody";
import { SelectContent } from "./MainContent/SelectContent";
import { TextAreaInputContents } from "./MainContent/TextareaInputContents";

export const BasicView = ({ data, setPostBody }: { data: GetResponse, setPostBody: (body: PostBody) => void }) => {
    console.log('BasicView', data);
    switch (data.content.type) {
        case 'info':
            return <BasicLayout>
                <InfoContent data={data} />
            </BasicLayout>
        case 'text':
            return <BasicLayout>
                <TextInput data={data} setPostBody={setPostBody} />
            </BasicLayout>
        case 'select':
            return <BasicLayout>
                <SelectContent data={data} setPostBody={setPostBody} multiSelect={data.content.multiSelect} instantSubmit={data.content.instantSubmit} multiMax={data.content.multiMax} multiMin={data.content.multiMin} />
            </BasicLayout>
        case 'textarea':
            return <BasicLayout>
                <TextAreaInputContents data={data} setPostBody={setPostBody} />
            </BasicLayout>
    }
}