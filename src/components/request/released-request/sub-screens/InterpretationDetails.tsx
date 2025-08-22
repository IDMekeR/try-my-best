import React, { useState, useEffect } from 'react';
import { message, Progress, Spin } from 'components/shared/AntComponent';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getResultDocList } from 'services/actions/releasedReqAction';
import { DownloadOutlined } from 'components/shared/AntIcons';
import { saveAs } from 'file-saver';
import { triggerBase64Download } from 'common-base64-downloader-react';
import { documentDownload } from 'services/actions/pipeline/pipelineAction';

const InterpretationDetails: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { resultInfo, loading4 } = useSelector((state: any) => state.wizard);
    const { rDocListInfo, loading3 } = useSelector((state: any) => state.released);
    const { loading14, downloadInfo, success14, error14 } = useSelector((state: any) => state.pipeline);
    const { excelDownProgress } = useSelector((state: any) => state.download);
    const [fileName, setFileName] = useState('');
    const [docType, setDocType] = useState('');
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success14 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error14 : false;
    const assEcDoc = !loading4 ? resultInfo?.req_info?.document_EC : [];
    const assEoDoc = !loading4 ? resultInfo?.req_info?.document_EO : [];
    const resultDocEO = !loading3 ? rDocListInfo?.report_excel_list?.filter((item: any) => item.doc_type === 'Eye Open') : [];
    const resultDocEC = !loading3 ? rDocListInfo?.report_excel_list?.filter((item: any) => item.doc_type === 'Eye Close') : [];
    const summaryFindings = ` <p class="mb-0"> * Impression-EC: Mildly elevated frontal high beta. EO: Mildly elevated frontal high beta. </p>
    <p class="mb-0"> * Posterior Dominant Rhythm - 13.0. </p> 
    <p class="mb-0"> * Theta/beta ratio - Eyes Closed - Null. Eyes Opened - Null. </p>
    <p class="mb-0"> * Alpha/beta ratio - Eyes Closed - Null. Eyes Opened - Null. </p> 
    <p class="mb-0"> * Relative power - EC: Mildly elevated frontal high beta. EO: Mildly elevated frontal high beta </p>
    <p class="mb-0"> * Asymmetry present - Eyes Closed - NO . Eyes Opened - NO. </p>`;

    function getResDocList() {
        dispatch(getResultDocList(location.state.id) as any);
    }

    const removeFileExtension = (filename: any) => {
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex !== -1 && lastDotIndex !== 0) {
            return filename.slice(0, lastDotIndex);
        } else {
            return filename;
        }
    };
    const DownloadFile = (id: any, fileName: string) => {
        setFileName(fileName);
        const inputJson = {
            docid: id,
        };
        dispatch(documentDownload(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrormsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            downloadDocument();
        }
        if (errormsg) {
            message.error("Document couldn't be downloaded");
        }
    }, [successmsg, errormsg]);

    const downloadDocument = () => {
        const fileExt = fileName?.split('.').pop();
        const filenameWithoutExtension = removeFileExtension(fileName);
        if (fileExt == 'xlsx' || fileExt == 'xls') {
            triggerBase64Download(`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${downloadInfo?.data?.encodefiledata}`, `${filenameWithoutExtension}`);
        } else if (fileExt == 'docx') {
            triggerBase64Download(
                `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64, ${downloadInfo?.data?.encodefiledata}`,
                `${filenameWithoutExtension}`,
            );
        } else if (fileExt == 'doc') {
            triggerBase64Download(`data:application/msword;base64,${downloadInfo?.data?.encodefiledata}`, `${filenameWithoutExtension}`);
        } else if (fileExt == 'pdf') {
            triggerBase64Download(`data:application/pdf;base64,${downloadInfo?.data?.encodefiledata}`, `${filenameWithoutExtension}`);
        } else if (fileExt == 'edf') {
            const bytes = new Uint8Array(
                atob(downloadInfo?.data?.encodefiledata)
                    .split('')
                    .map((char) => char.charCodeAt(0)),
            );
            const blob = new Blob([bytes], { type: 'text/plain;charset=utf-8;base64' });
            saveAs(blob, `${fileName}`);
        } else return;
    };

    useEffect(() => {
        getResDocList();
    }, []);

    return (
        <div className="p-3 template-height released-req dataset">
            <Spin spinning={loading4}>
                <div className="section-title mb-3">
                    <h6 className="mb-1 p-2 fs-17">
                        <span className="ps-2">Associated Document</span>
                    </h6>
                </div>
                <div className="d-flex">
                    <div className="col-md-6 pe-3 py-0">
                        <div className="border-end ">
                            <h6 className="ps-1 text-dark">Eyes Closed Document</h6>
                            <div className="d-flex flex-wrap ">
                                {assEcDoc?.map((item: any) => {
                                    return (
                                        <div key={item.doc_id} className="bg-tblHeadblue text-dark fw-bold px-2 py-1 m-1 d-flex">
                                            <div className="my-auto"> {item.doc_original_name}</div>
                                            <div className="ms-auto my-auto col-auto ps-3">
                                                <span
                                                    onClick={() => {
                                                        DownloadFile(item.doc_id, item.doc_original_name);
                                                        setDocType('A1');
                                                    }}
                                                >
                                                    <DownloadOutlined className="pointer" />
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {docType === 'A1' ? (
                                    loading14 ? (
                                        <Progress
                                            size={[485, 20]}
                                            percent={excelDownProgress}
                                            percentPosition={{ align: 'center', type: 'inner' }}
                                            strokeColor={{ from: '#108ee9', to: '#87d068' }}
                                        />
                                    ) : (
                                        ''
                                    )
                                ) : (
                                    ''
                                )}
                            </div>
                            {assEcDoc && assEcDoc?.length === 0 ? (
                                <div className="col bg-light p-4 text-center me-3">{loading4 ? 'Loading...' : 'No Eyes closed associated document associated'}</div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="">
                            <h6 className="ps-1 text-dark">Eyes Opened Document</h6>
                            <div className="d-flex flex-wrap">
                                {assEoDoc?.map((item: any) => {
                                    return (
                                        <div key={item.doc_id} className="bg-tblHeadblue text-dark fw-bold px-2 py-1 m-1  d-flex">
                                            <div className="my-auto"> {item.doc_original_name}</div>
                                            <div className="ms-auto my-auto col-auto ps-3">
                                                <span
                                                    onClick={() => {
                                                        DownloadFile(item.doc_id, item.doc_original_name);
                                                        setDocType('A2');
                                                    }}
                                                >
                                                    <DownloadOutlined className="pointer" />
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {docType === 'A2' ? (
                                    loading14 ? (
                                        <Progress
                                            size={[485, 20]}
                                            percent={excelDownProgress}
                                            percentPosition={{ align: 'center', type: 'inner' }}
                                            strokeColor={{ from: '#108ee9', to: '#87d068' }}
                                        />
                                    ) : (
                                        ''
                                    )
                                ) : (
                                    ''
                                )}
                            </div>
                            {assEoDoc && assEoDoc?.length === 0 ? (
                                <div className="col bg-light p-4 text-center resetResultDownloadProgress me-3">{loading4 ? 'Loading...' : 'No Eyes opened associated document associated'}</div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </div>
                <div className="section-title my-3">
                    <h6 className="mb-1 p-2 fs-17">
                        <span className="ps-2">EDF Output Document</span>
                    </h6>
                </div>
                <div className="d-flex">
                    <div className="col-md-6 pe-3 py-0">
                        <div className="border-end ">
                            <h6 className="ps-1 text-dark">Eyes Closed Document</h6>
                            <Spin spinning={loading3}>
                                <div className="d-flex flex-wrap ">
                                    {resultDocEC?.map((item: any) => {
                                        return (
                                            <div key={item.id} className="bg-tblHeadblue text-dark fw-bold px-2 py-1 m-1 col-auto d-flex">
                                                <div className="my-auto"> {item.filename}</div>
                                                <div className="ms-auto my-auto col-auto ps-3">
                                                    <span
                                                        onClick={() => {
                                                            DownloadFile(item.id, item.filename);
                                                            setDocType('B1');
                                                        }}
                                                    >
                                                        <DownloadOutlined className="pointer" />
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {docType === 'B1' ? (
                                        loading14 ? (
                                            <Progress
                                                size={[485, 20]}
                                                percent={excelDownProgress}
                                                percentPosition={{ align: 'center', type: 'inner' }}
                                                strokeColor={{ from: '#108ee9', to: '#87d068' }}
                                            />
                                        ) : (
                                            ''
                                        )
                                    ) : (
                                        ''
                                    )}
                                </div>
                                {resultDocEC && resultDocEC?.length === 0 ? (
                                    <div className="col bg-light p-4 text-center me-3">{loading3 ? 'Loading...' : 'No Eyes closed edf result document associated'}</div>
                                ) : (
                                    ''
                                )}
                            </Spin>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="">
                            <h6 className="ps-1 text-dark">Eyes Opened Document</h6>
                            <Spin spinning={loading3}>
                                <div className="d-flex flex-wrap">
                                    {resultDocEO?.map((item: any) => {
                                        return (
                                            <div key={item.id} className="bg-tblHeadblue text-dark fw-bold px-2 py-1 m-1 col-auto d-flex">
                                                <div className="my-auto"> {item.filename}</div>
                                                <div className="ms-auto my-auto col-auto ps-3">
                                                    <span
                                                        onClick={() => {
                                                            DownloadFile(item.id, item.filename);
                                                            setDocType('B2');
                                                        }}
                                                    >
                                                        <DownloadOutlined className="pointer" />
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {docType === 'B2' ? (
                                        loading14 ? (
                                            <Progress
                                                size={[485, 20]}
                                                percent={excelDownProgress}
                                                percentPosition={{ align: 'center', type: 'inner' }}
                                                strokeColor={{ from: '#108ee9', to: '#87d068' }}
                                            />
                                        ) : (
                                            ''
                                        )
                                    ) : (
                                        ''
                                    )}
                                </div>
                                {resultDocEO && resultDocEO?.length === 0 ? (
                                    <div className="col bg-light p-4 text-center">{loading3 ? 'Loading...' : 'No Eyes opened edf result document associated'}</div>
                                ) : (
                                    ''
                                )}
                            </Spin>
                        </div>
                    </div>
                </div>
                <div className="section-title my-3">
                    <h6 className="mb-1 p-2 fs-17">
                        <span className="ps-2">Interpretation</span>
                    </h6>
                </div>
                <div>
                    <table className="edf-step-header table-bordered w-100">
                        <thead>
                            <tr className="">
                                <th className="p-2 text-center">S.No</th>
                                <th className="p-2">Marker Name</th>
                                {/* <th className="p-2 text-center">Field Type</th> */}
                                <th className="p-2 text-center">Eyes Closed</th>
                                <th className="p-2 text-center">Eyes Opened</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultInfo?.req_info?.summarydata ? (
                              resultInfo?.req_info?.summarydata?.map((item: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td className="p-2 text-center">{index + 1}</td>
                                            <td className="p-2">{item.markername}</td>
                                            {/* <td className="p-2 text-center">{item.mfieldtype}</td> */}
                                            <td className="p-2 text-center">{item.marker_eyeclosed || '--'}</td>
                                            <td className="p-2 text-center">{item.marker_eyeopen || '--'}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="col bg-light p-4 text-center">{loading4 ? 'Loading...' : 'No interpretation markers associated'}</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="section-title my-3">
                    <h6 className="mb-1 p-2 fs-17">
                        <span className="ps-2">Recording Analysis</span>
                    </h6>
                </div>
                <div className="">
                    <h6 className="text-dark">Diagnosis</h6>
                    <div className="d-flex flex-wrap mb-3 p-1 border">
                        {resultInfo?.req_info?.Diagnosis ? (
                            resultInfo?.req_info?.Diagnosis?.map((item: any, index: number) => {
                                return (
                                    <div className="col-auto fw-bold p-2 bg-tblHeadblue m-1" key={index + 1}>
                                        {item}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col bg-light p-4 text-center">{loading4 ? 'Loading...' : 'No Diagnosis associated'}</div>
                        )}
                    </div>
                    <h6 className="text-dark">Symptoms</h6>

                    <div className="d-flex flex-wrap mb-3 p-1 border">
                        {resultInfo?.req_info?.com_symptoms ? (
                            (() => {
                            let hasChoices = false;
                            const renderedItems = resultInfo.req_info.com_symptoms.map((item: any, index: any) => {
                                if (item.ischoices) {
                                hasChoices = true;
                                return (
                                    <div className="col-auto fw-bold p-2 bg-tblHeadblue m-1" key={index + 1}>
                                    {item.symptoms_name}
                                    </div>
                                );
                                }
                                return null;
                            });

                            return hasChoices ? renderedItems : (
                                <div className="col bg-light p-4 text-center">
                                {loading4 ? 'Loading...' : 'No Symptoms associated'}
                                </div>
                            );
                            })()
                        ) : (
                            <div className="col bg-light p-4 text-center">
                            {loading4 ? 'Loading...' : 'No Symptoms associated'}
                            </div>
                        )}
                    </div>

                    <h6 className="text-dark">Recording and Analysis procedure</h6>
                    {resultInfo?.req_info?.RTAnalysisProcedures_data ? (
                        <div className="p-2 border mb-3" dangerouslySetInnerHTML={{ __html: resultInfo?.req_info?.RTAnalysisProcedures_data }}></div>
                    ) : (
                        <div className="p-2 border mb-3">
                            {loading4 ? <div className="col bg-light p-4 text-center">{loading4 ? 'Loading...' : ''}</div> : ''}
                            The electroencephalograph (EEG) was digitally recorded utilizing 19 electrodes with the International 10/20 System of electrode placement. Electrode impedances
                            were reduced to below 5 kohms. The EEG was recorded continuously in the awake state with eyes closed and eyes opened. The EEG has been visually inspected, and the
                            artifact was rejected utilizing EEG DataHub™ ICA and Components Artifactual Rejection System (CARS). The absolute and relative spectral analysis has been
                            computed for each task. When age-appropriate, the client`s data has been compared to the EEG DataHub™ qEEG database with AI consisting of over 10,000 studies in
                            eyes opened and eyes closed conditions. The output is displayed in tables and topographical maps. The output of magnitude, power, ratio, and coherence have been
                            included. This analysis and report are generated using EEG DataHub™ software and AI technology. A summary of findings, along with interpretation and
                            recommendations, have been provided by Dr. Steven Rondeau BCIA-EEG. A shared variance (connectivity) analysis may have been completed
                        </div>
                    )}

                    <h6 className="text-dark">Summary of Findings</h6>
                    <div className="p-2 border mb-3" dangerouslySetInnerHTML={{ __html: summaryFindings }}></div>
                    <h6 className="text-dark">Interpretation of Findings</h6>
                    {resultInfo?.req_info?.interpretation_findings ? (
                        <div className="p-2 border mb-3" dangerouslySetInnerHTML={{ __html: resultInfo?.req_info?.interpretation_findings }}></div>
                    ) : (
                        <div className="p-2 border mb-3">
                            <div className="col bg-light p-4 text-center">{loading4 ? 'Loading...' : 'No interpretation findings associated'}</div>
                        </div>
                    )}
                    <h6 className="text-dark">Neurofeedback Recommendations</h6>
                    <div className="row mx-0 mb-3">
                        <div className="col-md-6 ps-0">
                            <h6 className="fs-14">With Eyes Closed Condition</h6>
                            <div className="p-2 border h-100">
                                {resultInfo?.req_info?.neurofeedback_EC ? (
                                    <div dangerouslySetInnerHTML={{ __html: resultInfo?.req_info?.neurofeedback_EC }}></div>
                                ) : (
                                    <div className="col bg-light h-100 p-4 text-center justify-content-center d-flex align-items-center">
                                        {loading4 ? 'Loading...' : 'No Eyes closed neurofeedback associated'}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 pe-0">
                            <h6 className="fs-14">With Eyes Opened Condition</h6>
                            <div className="p-2 border h-100">
                                {resultInfo?.req_info?.neurofeedback_EO ? (
                                    <div dangerouslySetInnerHTML={{ __html: resultInfo?.req_info?.neurofeedback_EC }}></div>
                                ) : (
                                    <div className="col bg-light h-100 p-4 text-center justify-content-center d-flex align-items-center">
                                        {loading4 ? 'Loading...' : 'No Eyes opened neurofeedback associated'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <h6 className="text-dark mt-4 pt-3">Adjunct Therapies</h6>
                    <div className="p-2 border h-100 mb-3">
                        {resultInfo?.req_info?.AdjunctTherapies_data ? (
                            <div dangerouslySetInnerHTML={{ __html: resultInfo?.req_info?.AdjunctTherapies_data }}></div>
                        ) : (
                            <div className="col bg-light h-100 p-4 text-center justify-content-center d-flex align-items-center">
                                {loading4 ? 'Loading...' : 'No adjunct therapies associated'}
                            </div>
                        )}
                    </div>
                    <h6 className="text-dark">Possible Appropriate Medication</h6>
                    <div className="d-flex flex-wrap w-100 mb-3 border p-1">
                        {resultInfo?.req_info?.com_medic_templ && resultInfo?.req_info?.com_medic_templ?.some((item: any) => item.ischoices) ? (
                            resultInfo?.req_info?.com_medic_templ
                                ?.filter((item: any) => item.ischoices)
                                .map((item: any) => (
                                    <div className="col-auto fw-bold p-2 bg-tblHeadblue m-1" key={item.id}>
                                        {item.medication_name}
                                    </div>
                                ))
                        ) : (
                            <div className="col bg-light p-4 text-center">{loading4 ? 'Loading...' : 'No medicine associated'}</div>
                        )}
                    </div>
                    <h6 className="text-dark">Possible Supplementation</h6>
                    <div className="d-flex flex-wrap w-100 border p-2 mb-3">
                        {resultInfo?.req_info?.com_mdnutritional_supplementation_templ &&
                        resultInfo?.req_info?.com_mdnutritional_supplementation_templ?.some((item: any) => item.ischoices) ? (
                            resultInfo?.req_info?.com_mdnutritional_supplementation_templ
                                ?.filter((item: any) => item.ischoices)
                                .map((item: any) => (
                                    <div className="col-auto fw-bold p-2 bg-tblHeadblue m-1" key={item.id}>
                                        {item?.nutritional_supplementation_name}
                                    </div>
                                ))
                        ) : (
                            <div className="col bg-light p-4 text-center">{loading4 ? 'Loading...' : 'No Supplement associated'}</div>
                        )}
                    </div>
                    <h6 className="text-dark">Lifestyle Interventions</h6>
                    <div className="d-flex flex-wrap w-100 border p-2">
                        {resultInfo?.req_info?.com_lifestyle_templ && resultInfo?.req_info?.com_lifestyle_templ?.some((item: any) => item.ischoices) ? (
                            resultInfo?.req_info?.com_lifestyle_templ
                                ?.filter((item: any) => item.ischoices)
                                .map((item: any) => (
                                    <div className="col-auto fw-bold p-2 bg-tblHeadblue m-1" key={item.id}>
                                        {item?.lifestyle_name}
                                    </div>
                                ))
                        ) : (
                            <div className="col bg-light p-4 text-center">{loading4 ? 'Loading...' : 'No Supplement associated'}</div>
                        )}
                    </div>
                </div>
                <div className="section-title my-3">
                    <h6 className="mb-1 p-2 fs-17">
                        <span className="ps-2">Medication Details</span>
                    </h6>
                </div>
                <h6 className="text-dark">Provided all the medication you have taken past 30 days</h6>
                <table className="w-100 table-bordered edf-step-header">
                    <thead>
                        <tr>
                            <th className="p-2">Medicine Name</th>
                            <th className="p-2 text-center">Dosage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultInfo?.req_info?.medication_data?.medications_present && resultInfo?.req_info?.medication_data?.medications_present?.length > 0 ? (
                            resultInfo?.req_info?.medication_data?.medications_present?.map((item: any, index: number) => {
                                return (
                                    <tr key={index + 1}>
                                        <td className="p-2">{item.medic_name}</td>
                                        <td className="p-2 text-center">{item.medic_dosage || '--'}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={2}>
                                    <div className="col bg-light p-4 text-center">{loading4 ? 'Loading...' : 'No Medicine associated'}</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Spin>
        </div>
    );
};

export default InterpretationDetails;
