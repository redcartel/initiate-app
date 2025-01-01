import { useParams } from "react-router-dom";
import { AdminLayout } from "../Layouts/AdminLayout";
import { BasicLayout } from "../Layouts/BasicLayout"
import { ClientLayout } from "../Layouts/ClientLayout";
import { GetQuery } from "../Queries/GetQuery"
import { BasicView } from "./BasicView";
import { PostQuery } from "../Queries/PostQuery";
import { useEffect, useRef, useState } from "react";
import { PostBody } from "../QueryTypes/postBody";
import { useNavigate } from "react-router";

export const ParseView = () => {
    // const { sessionKey } = useContext(SessionContext);
    const { '*': path } = useParams();
    const [postBody, setPostBody] = useState<PostBody | null>(null);
    const navigate = useNavigate();
    const redirected = useRef(false);
    const [redirectTo, setRedirectTo] = useState<string | null>(null);

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

    return (
        <>
            {postBody !== null ?
                <PostQuery body={postBody} skip={!postBody}>
                    {(data, loading, error) => {
                        console.log('PostQuery', data, loading, error);
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
                                    return <AdminLayout>
                                        <div className="text-4xl text-center animate-pulse text-rose-600">Error: {error.message}</div>
                                    </AdminLayout>
                            }
                        }
                        else if (loading) {
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
                                    return <AdminLayout>
                                        <div className="text-4xl text-center animate-pulse text-slate-600">Loading...</div>
                                    </AdminLayout>
                            }
                        }
                        else if (data) {
                            console.log('data', data);
                            if (!redirected.current) {
                                setRedirectTo(data['!redirect']);
                                redirected.current = true;
                            }
                        }
                    }}
                </PostQuery>
                :
                <GetQuery>
                    {(data, loading, error) => {
                        console.log('ClientView data', data);

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
                                    return <AdminLayout>
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
                                    return <AdminLayout>
                                        <div className="text-4xl text-center animate-pulse text-rose-600">Error: {error.message}</div>
                                    </AdminLayout>
                            }
                        }

                        switch (data?.layout) {
                            case 'basic':
                                return <BasicView data={data} setPostBody={setPostBody} />
                            default:
                                return <BasicLayout>
                                    <div className="text-4xl text-center animate-pulse text-slate-100">Loading...</div>
                                </BasicLayout>
                        }
                    }}
                </GetQuery>
            }
        </>
    );
}