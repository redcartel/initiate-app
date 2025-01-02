import { useContext, useEffect, useState } from "react";
import { GetResponse } from "../../QueryTypes/getResponse";
import { PostBody } from "../../QueryTypes/postBody";
import CGHeading from "../../Components/CGHeading";
import { CGText } from "../../Components/CGText";
import { CGButton } from "../../Components/CGButton";
import { CGYSpace } from "../../Components/CGYSpace";
import { CGIcon } from "../../Components/CGIcon";
import { Dialog } from "react-aria-components";
import { DialogTrigger, Modal, ModalOverlay } from "react-aria-components";
import SessionContext from "../../Context/SessionContext";

export const SelectContent = ({ data, setPostBody, multiSelect, instantSubmit, multiMax, multiMin, hue }: { data: GetResponse, setPostBody: (body: PostBody) => void, multiSelect?: boolean, instantSubmit?: boolean, multiMax?: number, multiMin?: number, hue?: 'light' | 'dark' }) => {
    if (data.content.type !== 'select') {
        throw new Error('SelectContent called with non-select content');
    }

    const [singleValue, setSingleValue] = useState<string | null>(!Array.isArray(data.content.savedValue) ? (data.content.savedValue ?? null) : null);
    const [multiValue, setMultiValue] = useState<string[]>(Array.isArray(data.content.savedValue) ? data.content.savedValue : []);
    const { errMsg, setErrMsg } = useContext(SessionContext);

    if (data.content.type !== 'select') {
        return <>not select</>
    }

    useEffect(() => {
        if (data.content.type === 'select') {
            const deselect = data.content.options.find(option => {
                if (multiSelect) {
                    return multiValue.includes(option.value) && option.disabled;
                } else {
                    return singleValue === option.value && option.disabled;
                }
            })
            if (deselect) {
                if (multiSelect) {
                    setMultiValue(multiValue.filter(value => value !== deselect.value));
                } else {
                    setSingleValue(null);
                }
            }
        }
    }, [data.content.options]);

    return (<>
        <CGYSpace>
            <CGHeading level={2} className="text-center" theme="primary">{data.content.title}</CGHeading>
        </CGYSpace>
        {errMsg && <CGYSpace className="flex flex-row items-center justify-center">
            <CGText theme="destructive" hue={hue} className="text-center">{errMsg}</CGText>
        </CGYSpace>}
        <CGYSpace className="flex flex-row items-center justify-center">
            <CGHeading level={4} className="text-center" hue={hue}>{data.content.subtitle}</CGHeading>
        </CGYSpace>
        <CGYSpace className="flex flex-row items-center justify-center">
            <CGText className="text-center" hue={hue}>{data.content.description}</CGText>
        </CGYSpace>
        <CGYSpace className="flex flex-col gap-2 w-full px-2">
            {data.content.options.map((option) => (
                <div className="flex flex-row items-center justify-center w-full" key={option.value}>
                    <div className="w-12 mr-2 ml-3"></div>
                    <CGButton isDisabled={option.disabled} key={option.value} theme={option.theme} hue={singleValue === option.value || multiValue.includes(option.value) ? 'light' : hue === 'light' ? undefined : 'dark'} onPress={() => {
                        if (multiSelect) {
                            if (multiValue.includes(option.value)) {
                                setMultiValue(multiValue.filter(value => value !== option.value));
                                setErrMsg(null);
                            } else {
                                if (multiValue.length < (multiMax || Infinity)) {
                                    setMultiValue(prev => [...prev, option.value]);
                                    setErrMsg(null);
                                }
                            }
                        } else {
                            setSingleValue(option.value);
                            if (instantSubmit) {
                                setPostBody({
                                    value: option.value
                                });
                                setErrMsg(null);
                            }
                        }
                    }} className="w-full px-2">
                        <div className="flex flex-row gap-2 items-center justify-between w-full">
                            <div className="w-2 min-h-10">
                                {(multiValue ?? []).includes(option.value) || singleValue === option.value ? <div className={`flex flex-row items-center justify-center px-4 py-2 border-2 border-${option.theme}-700 rounded-full`}><CGIcon iconKey='check' className={`text-${option.theme}-700`} /></div> : <></>}
                            </div>
                            <div className="flex flex-col gap-1 items-end justify-end flex-1">
                                <CGText theme={option.disabled ? 'tertiary' : option.theme} hue={hue} className="text-2xl">{option.label}</CGText>
                                <CGText className="text-s italic font-bold text-tertiary-950">{option.description}</CGText>
                            </div>
                        </div>
                    </CGButton>
                    <div className="w-12 mr-2 ml-3">
                        {option.longDescription ?
                            <DialogTrigger>
                                <CGButton theme="secondary" hue={hue} className="rounded-full">
                                    <CGIcon iconKey='scroll' theme='blue' hue={hue === 'light' ? 'dark' : 'light'} />
                                </CGButton>
                                <ModalOverlay className={({ isEntering, isExiting }) => `
          fixed inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
          ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''}
          ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''}
        `}>
                                    <Modal className={({ isEntering, isExiting }) => `
            w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle bg-secondary-100 shadow-xl
            ${isEntering ? 'animate-in zoom-in-95 ease-out duration-300' : ''}
            ${isExiting ? 'animate-out zoom-out-95 ease-in duration-200' : ''}
          `}>
                                        <Dialog className="outline-none relative w-[100vw-8rem] bg-secondary-100">
                                            <div className="__htmlContainer" dangerouslySetInnerHTML={{ __html: option.longDescription }} />
                                            <div className="w-full flex flex-row items-center justify-center">
                                                <CGButton slot='close' theme="secondary">Ok</CGButton>
                                            </div>
                                        </Dialog>
                                    </Modal>
                                </ModalOverlay>
                            </DialogTrigger> : <></>}
                    </div>
                </div>
            ))}
        </CGYSpace>
        <CGYSpace className="flex flex-row items-center justify-center">
            {!instantSubmit && <CGButton theme="action" isDisabled={!(multiValue.length >= (multiMin || 1) && multiValue.length <= (multiMax || Infinity)) && !singleValue} onPress={() => {
                if (multiSelect && multiValue.length >= (multiMin || 1) && multiValue.length <= (multiMax || Infinity)) {
                    setPostBody({
                        value: multiValue
                    });
                } else if (singleValue) {
                    setPostBody({
                        value: singleValue
                    });
                }
            }}>
                Submit
            </CGButton>}
        </CGYSpace>
    </>)
}