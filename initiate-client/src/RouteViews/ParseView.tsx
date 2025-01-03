import { useParams } from "react-router-dom";
import { AdminLayout } from "../Layouts/AdminLayout";
import { BasicLayout } from "../Layouts/BasicLayout"
import { ClientLayout } from "../Layouts/ClientLayout";
import { GetQuery } from "../Queries/GetQuery"
import { BasicView } from "./BasicView";
import { useEffect, useRef, useState } from "react";
import { PostBody } from "../QueryTypes/postBody";
import { useNavigate } from "react-router";
import { usePostQuery } from "../Queries/usePostQuery";
import { ClientView } from "./ClientView";
import { AdminView } from "./AdminView";

export const ParseView = () => {
    console.log('ParseView');
    
    // const { setSessionKey } = useContext(SessionContext);
    const { '*': path } = useParams();
    const [postBody, setPostBody] = useState<PostBody | null>(null);
    const navigate = useNavigate();
    const redirected = useRef(false);
    const [redirectTo, setRedirectTo] = useState<string | null>(null);
    const postQuery = usePostQuery();

    useEffect(() => {
        if (redirectTo) {
            navigate(redirectTo);
            setRedirectTo(null);
        }
    }, [navigate, redirectTo]);

    const pathLayout = (path ?? '').split('/').length > 0 ? (path ?? '').split('/')[0] as 'basic' | 'client' | 'admin' : 'basic';

    useEffect(() => {
        redirected.current = false;
    }, [path]);

    useEffect(() => {
        if (postBody) {
            const data = postQuery.fetchData(postBody);
            setPostBody(null);
            console.log('data', data);
        }
    }, [postBody]);

    return (
        // <>
        //     {postBody !== null ?
        //         <PostQuery body={postBody} skip={!postBody}>
        //             {(_data, _loading, error) => {
        //                 if (error) {
        //                     switch (pathLayout) {
        //                         case 'basic':
        //                             return <BasicLayout>
        //                                 <div className="text-4xl text-center animate-pulse text-rose-200">Error: {error.message}</div>
        //                             </BasicLayout>
        //                         case 'client':
        //                             return <ClientLayout>
        //                                 <div className="text-4xl text-center animate-pulse text-rose-600">Error: {error.message}</div>
        //                             </ClientLayout>
        //                         case 'admin':
        //                             return <AdminLayout>
        //                                 <div className="text-4xl text-center animate-pulse text-rose-600">Error: {error.message}</div>
        //                             </AdminLayout>
        //                     }
        //                 }
        //                 else {
        //                     switch (pathLayout) {
        //                         case 'basic':
        //                             return <BasicLayout>
        //                                 <div className="text-4xl text-center animate-pulse text-slate-100">Loading...</div>
        //                             </BasicLayout>
        //                         case 'client':
        //                             return <ClientLayout>
        //                                 <div className="text-4xl text-center animate-pulse text-slate-600">Loading...</div>
        //                             </ClientLayout>
        //                         case 'admin':
        //                             return <AdminLayout>
        //                                 <div className="text-4xl text-center animate-pulse text-slate-600">Loading...</div>
        //                             </AdminLayout>
        //                     }
        //                 }
        //             }}
        //         </PostQuery>
        //         :
                <GetQuery>
                    {(data, loading, error) => {
                        if (data) {
                            console.log('GetQuery data', data);
                        }
                        else {
                            console.log('laoding,error', loading, error);
                        }

                        if (!error && (loading || !data)) {
                            switch (pathLayout) {
                                case 'basic':
                                    return <BasicLayout>
                                        <div className="text-4xl text-center animate-pulse text-slate-100">Loading...</div>
                                    </BasicLayout>
                                case 'client':
                                    return <ClientLayout>
                                        <div className="text-4xl text-center animate-pulse text-slate-600">Loading...</div>
                                    </ClientLayout>
                                case 'admin':
                                    return <AdminLayout data={{ layout: 'admin', content: { type: 'info', title: 'Loading...', linkButtons: [{
                                        label: 'Home',
                                        href: '/',
                                        theme: 'primary'
                                    }] } }}>
                                        <div className="text-4xl text-center animate-pulse text-slate-600">Loading...</div>
                                    </AdminLayout>
                            }
                        }

                        if (error) {
                            switch (pathLayout) {
                                case 'basic':
                                    return <BasicLayout>
                                        <div className="text-4xl text-center animate-pulse text-rose-200">Error: {error.message}</div>
                                    </BasicLayout>
                                case 'client':
                                    return <ClientLayout>
                                        <div className="text-4xl text-center animate-pulse text-rose-600">Error: {error.message}</div>
                                    </ClientLayout>
                                case 'admin':
                                    return <AdminLayout data={{ layout: 'admin', content: { type: 'info', title: 'Error', linkButtons: [{
                                        label: 'Home',
                                        href: '/',
                                        theme: 'primary'
                                    }] } }}>
                                        <div className="text-4xl text-center animate-pulse text-rose-600">Error: {error.message}</div>
                                    </AdminLayout>
                            }
                        }

                        console.log('data?.layout', data?.layout);

                        switch (data?.layout) {
                            case 'basic':
                                return <BasicView data={data} setPostBody={setPostBody} />
                            case 'client':
                                return <ClientView data={data} setPostBody={setPostBody} />
                            case 'admin':
                                return <AdminView data={data} setPostBody={setPostBody} />
                            default:
                                return <BasicLayout>
                                    <div className="text-4xl text-center animate-pulse text-slate-100">Loading...</div>
                                </BasicLayout>
                        }
                    }}
                </GetQuery>
        //     }
        // </>
    );
}