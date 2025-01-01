import { BasicLayout } from "../Layouts/BasicLayout"
import { GetResponse } from "../QueryTypes/getResponse";
import { InfoContent } from "./MainContent/InfoContent";
import { TextInput } from "./MainContent/TextInputContents";
import { PostBody } from "../QueryTypes/postBody";

export const BasicView = ({ data, setPostBody }: { data: GetResponse, setPostBody: (body: PostBody) => void }) => {
    switch (data.content.type) {
        case 'info':
            return <BasicLayout>
                <InfoContent data={data} />
            </BasicLayout>
        case 'text':
            return <BasicLayout>
                <TextInput data={data} setPostBody={setPostBody} />
            </BasicLayout>
    }
}