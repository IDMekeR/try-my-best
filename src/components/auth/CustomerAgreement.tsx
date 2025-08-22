import React, { useState, useEffect, useRef } from 'react';
import { Image, message, Tooltip } from 'components/shared/AntComponent';
import { Form, Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import LoginImg from 'assets/img/login-image.png';
import EEGLogo from 'assets/img/brandname.png';
import 'assets/styles/auth.scss';
import 'assets/styles/form.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from 'services/actions/authAction';
import { useSelector } from 'react-redux';
import SignatureCanvas from 'react-signature-canvas'
import { saveAgreement } from 'services/actions/accountAction';


const CustomerAgreement: React.FC = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state: any) => state.auth);
    const {userAgree, loading15, error15, success15 } = useSelector((state: any) => state.account);
    const sigCanvas = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [penColor, setPenColor] = useState("black");
    const [isSigned, setIsSigned] = useState(false);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success15 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error15 : false;
    const clearSignature = () => {
        sigCanvas.current?.clear();
        handleEnd();
    };
  
    const handleEnd = () => {
        if (sigCanvas.current) {
            setIsSigned(!sigCanvas.current.isEmpty()); // Enable button if canvas is not empty
        }
    };

    const handleUpload = async () => {
        if (!sigCanvas.current) return;

        setLoading(true);
        const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
        const blob = await fetch(signatureData).then(res => res.blob());
        const file = new File([blob], "signature.png", { type: "image/png" });

        try {
            const inputJson = {
                userid: userInfo?.data?.userid,
                accountid: userInfo?.data?.user_acctid 
            };
            const formData = new FormData();
            formData.append("File", file);
            formData.append("InputJson", JSON.stringify(inputJson));
            dispatch(saveAgreement(formData) as any)
            setShowSuccessmsg(true);
            setShowErrormsg(true);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() =>{
        if(successmsg){
            message.success('Logged in successfully');
            setShowSuccessmsg(false)
            navigate('/dashboard');
        }
        if(errormsg){
            message.error(error15?.msg || "Something went wrong please try again later.")
            setShowErrormsg(false)
        }
    }, [successmsg, errormsg])
    
    return(
        <div className="p-4 customer-agreement">
            <Image src={EEGLogo} height="50px" preview={false}/>
            <div className="mx-auto w-75 mt-5 ">
                <div className="d-flex">
                    <h3 className="text- mb-3 col-md-7 ps-3 ms-auto">USER AGREEMENT</h3>
                </div>

                <div className="bg-white p-4 shadow-sm template-height" style={{ height: '650px', overflow: 'auto' }}>
                    <div>
                        <div className="d-flex mt-3">
                            <Image src={EEGLogo} height={100} preview={false} />
                            <div className="ms-auto">
                                <p className="mb-0 fw-bold">Healthy Paths Inc.</p>
                                <p className="mb-0 fw-bold">dba Axon EEG</p>
                                <p className="mb-0 fw-bold">Solutions (&quot;Axon&quot;)</p>
                                <p className="mb-0 fw-bold">2620 East Prospect</p>
                                <p className="mb-0 fw-bold">Road, Suite 190</p>
                                <p className="mb-0 fw-bold">Fort Collins, CO 80525</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-center mb-3 mt-3">TERMS AND CONDITIONS</h5>
                        <div className="h-inherit overflow-y">
                            <p className="text-indent mb-3">
                                <span className="fw-">WHEREAS,</span> Axon has developed and uses TIEReportTM technology to match brain patterns with the right medication and neurofeedback protocols (the{' '}
                                <span className="fw-bold">“Technology”</span>); and
                            </p>
                            <p className="text-indent mb-3">
                                <span className="fw-"> WHEREAS,</span> utilizing the data from the Technology, Axon has developed a proprietary database of digital qEEG or Quantitative Electroencephalograms{' '}
                                <span className="fw-bold">(“Database”)</span>
                                that allow Axon to provide recommended diagnoses and medication regimens; and
                            </p>
                            <p className="text-indent mb-3">
                                <span className="fw-">WHEREAS,</span> Service Provider is a doctor, who is the leader of Axon; and
                            </p>
                            <p className="text-indent mb-3">
                                <span className="fw-">WHEREAS,</span> Client is in the medical field and has access to the Technology (or other third-party technology similar to the Technology, which for purposes herein
                                will also be referred to as the Technology) for its own purposes in connection with rendering medical services to patients; and
                            </p>
                            <p className="text-indent mb-3">
                                <span className="fw-">WHEREAS,</span> Client has collected data points on certain of its patients using the Technology <span className="fw-bold">(“Patient Data”)</span>; and
                            </p>
                            <p className="text-indent mb-3">
                                <span className="fw-">WHEREAS,</span> Client desires to engage Axon and Service Provider to read and analyze the Patient Data and provide recommendations on diagnoses and medication
                                regimens based on the Database <span className="fw-bold">(the “Services”)</span>; and
                            </p>
                            <p className="text-indent mb-3">
                                <span className="fw-"> WHEREAS,</span> the parties have entered into a Purchase Order in connection herewith and wish to set forth the terms related to the Purchase Order and Services
                                noted above.
                            </p>
                            <p className="text-indent mb-3">
                                <span className="fw-bold">NOW, THEREFORE,</span> the following Terms and Conditions govern the Purchase Order and are incorporated therein by reference.
                            </p>
                            <div className="">
                                <ol type="1">
                                    <li>
                                        <div className="fw-bold text-decoration-underline">Services</div>

                                        <div className="ps-3 my-2">
                                            1.1 <span className="fw-bold text-decoration-underline px-1"> Nature of Services.</span> Axon will provide the Services for the term of this Agreement and as may be further
                                            described on the Purchase Order. Client acknowledges and agrees that the Services are advisory in nature only and it is in the Client’s sole decision as to whether to accept or
                                            reject the recommendations, if any, provided by Axon and Service Provider. Axon and Service Provider are not, and shall not be deemed to be, the treating physician of any
                                            patient or any patient’s healthcare provider and Client agrees that all decisions regarding actual rendering of a diagnosis of a patient, prescribing medicine, or rendering
                                            other healthcare services for a patient shall be made exclusively by Client. Neither Service Provider nor Axon shall be responsible in any manner whatsoever, nor shall either
                                            of them have any liability to Client or any third party, including any patient, for any treatment plan or decision made by Client based on the Services.
                                        </div>
                                        <div className="ps-3">
                                            1.2 <span className="fw-bold text-decoration-underline px-1"> Reports.</span> Axon and Service Provider shall issue a written report at the conclusion of its review of Patient
                                            Data in a format consistent with Axon’s routine practices <span className="fw-bold">(“Report”)</span>.
                                        </div>
                                    </li>
                                    <li className="my-3">
                                        <div className="fw-bold text-decoration-underline">Fees and Expenses</div>
                                        <div className="ps-3 my-2">
                                            2.1 <span className="fw-bold text-decoration-underline px-1"> Fee.</span> For all Services performed pursuant to this Agreement, Axon shall be entitled to receive from Client
                                            the fees set forth on the Purchase Order, which shall specify all payment terms.
                                        </div>
                                        <div className="ps-3">
                                            2.2 <span className="fw-bold text-decoration-underline px-1"> Expenses.</span>Axon shall be responsible for all expenditures related to the performance of the Services under
                                            this Agreement.
                                        </div>
                                        <div className="ps-3 my-2">
                                            2.3 <span className="fw-bold text-decoration-underline px-1"> No Withholding.</span> Axon will be responsible for paying all of its federal, state, municipal, or other taxes as
                                            are required by any law, regulation, or ruling.
                                        </div>
                                    </li>
                                    <li>
                                        <span className="fw-bold text-decoration-underline">Relationship</span>Axon shall for all purposes be considered an independent contractor, and nothing in this Agreement shall be
                                        deemed to place the parties in the relationship of employer-employee, principal-agent, partners, or joint ventures.
                                    </li>
                                    <li className="my-3">
                                        <span className="fw-bold text-decoration-underline">Nonexclusive Services</span>Axon and Service Provider may at any time render services similar to or the same as the Services on
                                        its/his own account or for any other person or entity, in their sole discretion, and as they see fit.
                                    </li>
                                    <li>
                                        <span className="fw-bold text-decoration-underline">Terms and Termination</span>This Agreement shall commence on the Effective Date and shall remain in full force and effect until
                                        terminated as set forth in this Section.
                                        <div className="ps-3 my-2">
                                            5.1 <span className="fw-bold text-decoration-underline px-1"> Termination without Cause.</span> Either party may terminate this Agreement without cause upon thirty (30) days
                                            prior written notice unless dictated otherwise in the Purchase Order.
                                        </div>
                                        <div className="ps-3">
                                            5.2 <span className="fw-bold text-decoration-underline px-1"> Termination for Cause.</span>This Agreement may be terminated by either party for cause (as hereinafter defined)
                                            effective upon delivery of written notice pursuant to this Agreement to the other party (the <span className="fw-bold">&quot;Terminated Party&quot;</span>). Cause is defined to mean
                                            either (a) the commission of fraud, gross negligence or intentional misconduct by the Terminated Party, including without limitations, the misappropriation or withholding of
                                            funds due and owing to either party hereunder, or (b) a material breach under this Agreement which is not cured for a period of fifteen (15) calendar days afrer written notice
                                            thereof from the other party (or such longer time if cure requires a longer period of time an cure is promptly began by the breaching party).
                                        </div>
                                        <div className="ps-3 my-2">
                                            5.3 <span className="fw-bold text-decoration-underline px-1"> Effect of Termination.</span> If Client terminates the Agreement under this Section 5, Client shall pay to all
                                            amounts due to Axon, including fees and costs incurred up to and including the actual date of termination. Any such payment shall be paid to Axon within fifteen (15) days of
                                            the effective date of the termination.
                                        </div>
                                    </li>
                                    <li className="my-3">
                                        <span className="fw-bold text-decoration-underline"> Confidential Information.</span>The parties agree that at all times they will comply with all applicable state and federal
                                        laws, rules, and regulations regarding the confidentiality of medical records and information and any protected health information, including, but not limited to, the Health
                                        Insurance Portability and Accountability Act of 1996, as amended (“HIPAA”). The parties agree that all documents, data, and other information that they may provide to the other
                                        party in connection with the Services, including Patient Data, shall be held in confidence by the parties and shall not be disclosed to any third party absent the express prior
                                        written consent of the other party, or as required by law.
                                    </li>
                                    <li>
                                        <span className="fw-bold text-decoration-underline"> Intellectual Property Ownership.</span> Axon grants to Client a limited, perpetual, non-transferrable, non-sublicensable
                                        license to use the Reports within the United States solely for its internal business purposes and Client agrees that all Reports created by Axon and Service Provider, including all
                                        intellectual property rights and derivative rights created thereunder shall remain the sole and exclusive property of Axon. Likewise, Axon shall have the right to retain
                                        indefinitely and to use any Patient Data provided to Axon by Client under this Agreement, subject to HIPAA, in such manner as Axon chooses, so long as it is in compliance with
                                        applicable law. Notwithstanding the foregoing, Axon agrees that it will not sell any Patient Data to any third-party; provided that the foregoing will not apply to data that has
                                        been de-identified. In furtherance of the foregoing, Axon agrees that if requested by Client or required by HIPAA, it will de-identify the Patient Data to the extent necessary to
                                        ensure HIPAA compliance. To the extent all intellectual property rights do not automatically vest in Axon regarding the Reports, Client hereby irrevocably assigns to Axon all
                                        right, title and interest in and to the Reports and all related intellectual property rights.
                                    </li>
                                    <li className="my-3">
                                        <span className="fw-bold text-decoration-underline"> Representations and Warranties of Client.</span>
                                        <div className="ps-3 my-2">
                                            8.1
                                            <span className="px-1">
                                                Client represents, warrants, and covenants that all rights to the Patient Data assigned and granted under this Agreement do not and will not require any third-party
                                                consents or clearances or any payment of fees, residuals, or other amounts of any kind to any third party (including any patient).{' '}
                                            </span>
                                        </div>
                                        <div className="ps-3">
                                            8.2
                                            <span className=" px-1">
                                                Client represents, warrants, and covenants that it has secured all permissions, consents or waivers required from its patients or patient guardians to share the Patient
                                                Data with Axon and Service Provider, and to have Axon and Service Provider conduct the Services and generate the Reports using the Patient Data as contemplated by this
                                                Agreement. Client shall provide evidence of such consents or waivers upon Axon’s request.{' '}
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="fw-bold text-decoration-underline"> Disclaimer of Warranties.</span>Axon disclaims all warranties of any kind with respect to the Reports and the information
                                        provided therein. Client, and not Axon or Service Provider, is the sole treating physician for the patients that are the subject of Patient Data and the Reports, and neither
                                        Service Provider not Axon shall be deemed to be rendering any services of any kind directly to patients. Any information or recommendation provided in a Report or as a result of
                                        the Services is strictly advisory in nature and Axon and Service Provider make no warranties, express or implied, whatsoever of any kind that the Reports are accurate or fit for
                                        any particular purpose.
                                    </li>
                                    <li>
                                        <span className="fw-bold text-decoration-underline"> Hold Harmless.</span>
                                        <div className="ps-3 my-2">
                                            10.1 <span className="fw-bold text-decoration-underline px-1"> Hold Harmless.</span> Client shall indemnify, defend, and hold harmless Axon, and Axon’s employees, directors,
                                            officers, managers, agents or representatives from and against any and all third party claims, demands, causes of action, liabilities, lawsuits, and damages, including
                                            reasonable attorneys’ fees, arising directly out of, or directly related to (i) the negligence or intentional misconduct of Client’s employees, directors, officers, managers,
                                            agents or representatives under its reasonable control in connection with this Agreement, (ii) any breach of Client’s representations and warranties set forth in Sections 8 and
                                            9, and (iii) any and all medical advice, treatment plans or other advice given by Client to its patients as a result of the Services.
                                        </div>
                                        <div className="ps-3 mb-2">
                                            10.2 <span className="fw-bold text-decoration-underline px-1"> Limitation of Liability.</span>{' '}
                                            <span className="text-uppercase">
                                                IN NO EVENT SHALL AXON OR SERVICE PROVIDER BE LIABLE FOR ANY FINES, PENALTIES, LOSS OF USE, INTERRUPTION OF BUSINESS, LOST PROFITS, OR ANY INDIRECT, SPECIAL, INCIDENTAL,
                                                CONSEQUENTIAL, PUNITIVE OR EXEMPLARY DAMAGES OF ANY KIND REGARDLESS OF THE FORM OF ACTION WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT PRODUCT LIABILITY, OR
                                                OTHERWISE IN CONNECTION WITH THE SERVICES AND THIS AGREEMENT, EVEN IF IT/HE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL AXON OR SERVICE
                                                PROVIDER’S AGGREGATE LIABILITY UNDER THIS AGREEMENT EXCEED THE FEES PAID TO AXON BY CLIENT DURING THE PREVIOUS TWELVE MONTHS.
                                            </span>
                                        </div>
                                        <div className="ps-3 mb-2">
                                            10.3 <span className="fw-bold text-decoration-underline px-1"> Allocation of Risk.</span> Client acknowledges and agrees that (i) the provisions of this Section 10 allocate
                                            risks under this Agreement between the parties and (ii) Axon’s pricing reflects this allocation of risks and limitation of liability.
                                        </div>
                                    </li>
                                    <li>
                                        <span className="fw-bold text-decoration-underline"> General Provisions.</span>
                                        <div className="ps-3 my-2">
                                            11.1 <span className="fw-bold text-decoration-underline px-1"> Notices.</span> Any notice to be given to the parties under the terms of this Agreement shall be addressed to the
                                            addresses set forth below or to such other address as either party may hereafter designate in writing to the other.
                                        </div>
                                        <div className="ps-3 mb-2">
                                            11.2 <span className="fw-bold text-decoration-underline px-1"> Entire Agreement/Modification.</span> This Agreement supersedes any and all other agreements or understandings,
                                            whether oral, implied or in writing, between the parties hereto with respect to the subject matter hereof and contains all of the covenants and agreements between the parties
                                            with respect to such matters in their entirety. Each party to this Agreement acknowledges that no representations, inducements, promises or agreements, orally or otherwise,
                                            have been made by any party, or anyone acting on behalf of any party, which are not embodied herein, and that no other agreement, statement or promise not contained in this
                                            Agreement shall be valid or binding. Any modification of this Agreement will be effective only if it is in writing and signed by the parties hereof.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.3 <span className="fw-bold text-decoration-underline px-1"> Governing Law.</span> This Agreement shall be governed and interpreted under the laws of the State of Colorado
                                            without respect to conflicts of laws principles.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.4 <span className="fw-bold text-decoration-underline px-1"> Venue.</span> Any action or proceeding brought to enforce the terms of this Agreement or to adjudicate any
                                            dispute arising hereunder must be heard in the courts of Larimer County, Colorado. Each of the parties submits itself to the exclusive jurisdiction and venue of these courts
                                            for purposes of any action arising out of this Agreement.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.5 <span className="fw-bold text-decoration-underline px-1"> Severability.</span>If any provision in this Agreement is held by a court of competent jurisdiction or by an
                                            arbitrator to be invalid, void, or unenforceable, the remaining provisions shall nevertheless continue in full force and effect without being impaired or invalidated in any
                                            way.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.6 <span className="fw-bold text-decoration-underline px-1"> Collaboration.</span>This Agreement is the product of collaboration among the parties, each of whom has been
                                            represented by counsel throughout the negotiations, drafting, and revision of this Agreement. No provision of this Agreement shall be construed against any party by virtue of
                                            the involvement of that party or his attorneys in drafting this Agreement.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.7 <span className="fw-bold text-decoration-underline px-1"> Non-Waiver.</span>No delay or failure by either party to exercise any right under this Agreement, and no partial
                                            or single exercise of that right, shall constitute a waiver of that or any other right. The obligations of either party with respect to such right shall continue in full force
                                            and effect.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.8 <span className="fw-bold text-decoration-underline px-1"> Counterparts.</span>This Agreement may be executed in two or more counterparts, each of which shall be deemed an
                                            original but all of which together shall constitute one and the same instrument.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.9 <span className="fw-bold text-decoration-underline px-1"> Digital Signatures.</span>Signatures to this Agreement transmitted by facsimile (fax) or in the form of a digital
                                            image (including without limitation PDF, JPEG and/or GIF files or other e-signatures), shall be valid and effective to bind the party so signing; each party agrees to promptly
                                            deliver an execution original to this Agreement with its actual signature to each other party, but a failure to do so shall not affect the enforceability of this Agreement, it
                                            being expressly agreed that each party to this Agreement shall be bound by its own facsimile or scanned signature and shall accept the telecopied or scanned signature of each
                                            other party to this Agreement.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.10 <span className="fw-bold text-decoration-underline px-1"> Attorneys’ Fees.</span>In the event of any suit, action, or arbitration is instituted to enforce or interpret
                                            the terms of this Agreement, the prevailing party in such suit, action, or arbitration, including any appeal therefrom, shall be entitled to recover from the other party its
                                            reasonable attorneys’ fees, including fees incurred in preparation for any such proceeding.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.11 <span className="fw-bold text-decoration-underline px-1"> No Third-Party Beneficiary.</span>Nothing in this Agreement is intended, or shall be construed or implied, to
                                            confer upon or give any person other than the parties hereto and their respective successors or permitted assigns hereunder, any rights or remedies under or by reason of this
                                            Agreement.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.12 <span className="fw-bold text-decoration-underline px-1"> Assignment.</span>Neither this Agreement nor any duties or obligations hereunder shall be assignable by any
                                            party hereto without the prior written consent of the other party.
                                        </div>
                                        <div className="ps-3 my-2">
                                            11.13 <span className="fw-bold text-decoration-underline px-1"> Successors/Assigns.</span>This Agreement is binding upon and shall inure to the benefit of the respective
                                            successors and/or assigns of the parties hereto.
                                        </div>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div className='bg-light temp-width w-100 signature-container'>
                        <div className="signature-header">
                            <span>Signature</span>
                            <button onClick={clearSignature} className="clear-btn">
                                Clear
                            </button>
                        </div>
                        <div className="signature-pad">
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor={penColor}
                                onEnd={handleEnd}
                                canvasProps={{
                                    width: 800,
                                    height: 200,
                                    className: "sigCanvas",
                                }}
                            />
                        </div>
                        <div className="color-options">
                            <button className={`color-btn black ${penColor === "black" ? "active" : ""}`} onClick={() => setPenColor("black")} />
                            <button className={`color-btn blue ${penColor === "blue" ? "active" : ""}`} onClick={() => setPenColor("blue")} />
                            <button className={`color-btn red ${penColor === "red" ? "active" : ""}`} onClick={() => setPenColor("red")} />
                        </div>
                    </div>
                </div>
                
                <div className="text-end mt-2">
                    <Tooltip title={!isSigned ? "Please provide your signature to proceed" : ""}>
                        <Button type="primary" className="ms-auto" loading={loading || loading15} disabled={!isSigned}
                        onClick={handleUpload}>
                            Agree
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}


export default CustomerAgreement;
