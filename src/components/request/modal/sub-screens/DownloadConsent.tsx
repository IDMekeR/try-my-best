import React, {forwardRef, useImperativeHandle} from 'react';
import { Modal } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import html2pdf from 'html2pdf.js';
import EEGImage from 'assets/img/brandname.png';

export type DownloadConsentRef = {
    downloadPDF: () => void;
  };

const DownloadConsent = forwardRef<DownloadConsentRef>((_, ref) => {

    const downloadPDF = async () => {
            const header:any = document.getElementById('part1')!.cloneNode(true);
            const content:any = document.getElementById('part2')!.cloneNode(true);
     
            const combinedElement: any = document.createElement('div');
            combinedElement.appendChild(header);
            combinedElement.appendChild(content);
     
            header.style.display = 'block';
     
            const opt = {
                margin: [0.2, 0.6, 0.6, 0.6],
                filename: 'terms_and_conditions.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2},
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                // pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            };
            await html2pdf().set(opt).from(combinedElement).save();
    };

    useImperativeHandle(ref, () => ({
        downloadPDF,
    }));

    return(
        <div>
            <div className="">
                <div id="part1" className="" >
                    <div className=" my-3">
                        <img className="term-logo" src={EEGImage} alt="EEG Logo" width="20%" />
                        <h5 className="text-center">Terms and Conditions</h5>
                    </div>
                </div>
                <div id="part2">
                <h6 className="text-dark">Service Agreement</h6>
                <p className="fs-15">
                    The information and recommendations provided by Healthy Paths Inc. dba Axon EEG Solutions (&quot;Axon&quot;, &ldquo;we,&rdquo; &quot;us,&quot; or &quot;our&quot;) in
                    this TIEReport (the &quot;Report&quot;) is for general informational and educational purposes and is intended to be used solely as a diagnostic aid.
                </p>
                <h6 className="text-dark">Privacy Policy</h6>
                <p className="fs-15">While reviewing the Report it is important that you understand the following:</p>
                <p className="fs-13">
                    1. <span className="text-decoration-underline">NOT MEDICAL ADVICE/CONSULT YOUR PHYSICIAN.</span> THE REPORT DOES NOT CONTAIN MENTAL HEALTH OR MEDICAL ADVICE AND
                    IS NOT A SUBSTITUTE FOR PROFESSIONAL THERAPY OR MEDICAL ADVICE. BEFORE TAKING ANY ACTIONS, INCLUDING ANY LIFESTYLE CHANGES OR STARTING A NEW MEDICATION (WHETHER
                    PRESCRIPTION, OVER THE COUNTER OR NATURAL SUPPLEMENTS) BASED UPON THE REPORT, WE STRONGLY RECOMMEND THAT YOU TO CONSULT WITH THE APPROPRIATE MENTAL HEALTH AND/OR
                    MEDICAL PROFESSIONALS, INCLUDING YOUR PRIMARY CARE PHYSICIAN. YOU SHOULD NEVER DELAY SEEKING MEDICAL TREATMENT OR DISREGARD PROFESSIONAL MEDICAL ADVICE DUE TO
                    INFORMATION OR RECOMMENDATIONS CONTAINED IN THIS REPORT. THE USE OR RELIANCE OF ANY INFORMATION OR RECOMMENDATIONS IS SOLELY AT YOUR OWN RISK.
                </p>
                <p className="fs-13">2. NO AXON AGENT OR EMPLOYEE SHALL PROVIDE ANY ADVICE OR SERVICES OUTSIDE THE SCOPE OF THEIR EXPERTISE OR LICENSURE.</p>
                <p className="fs-13"> 3.<span className="text-decoration-underline">NO REPRESENTATIONS OR WARRANTIES ARE MADE OR GIVEN.</span> ALL INFORMATION AND RECOMMENDATIONS IN THE REPORT ARE
                    PROVIDED IN GOOD FAITH BUT ARE PROVIDED “AS-IS”, WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF
                    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR SATISFACTORY QUALITY. WE MAKE NO REPRESENTATION OF ANY KIND, EXPRESS OR IMPLIED, REGARDING THE ACCURACY,
                    ADEQUACY, VALIDITY, RELIABILITY, AVAILABILITY, OR COMPLETENESS OF ANY INFORMATION OR RECOMMENDATION IN THE REPORT.
                </p>
                <p className="fs-13"> 4. QEEG DEVICES ARE CONSIDERED BY FDA A MEDICAL DEVICE. HOWEVER, FDA DOES NOT REGULATE THE USE OF THESE QEEG DEVICES IN THE CONTEXT OF AXON’S SERVICES.</p>
                <p className="fs-13">
                    5.<span className="text-decoration-underline">NO LIABILITY.</span> UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND
                    INCURRED AS A RESULT OF THE USE OF THE REPORT OR RELIANCE ON ANY INFORMATION OR RECOMMENDATIONS PROVIDED IN THE REPORT. YOUR USE OF THE REPORT AND YOUR RELIANCE
                    ON ANY INFORMATION OR RECOMMENDATIONS IS SOLELY AT YOUR OWN RISK. WE HEREBY DISCLAIM ANY AND ALL LIABILITY FOR ANY INJURY OR DAMAGE TO OR OTHER IMPACT ON YOUR
                    HEALTH OR MEDICAL CONDITION, WHETHER OR NOT CAUSED BY OR RELATED TO (EITHER DIRECTLY OR INDIRECTLY) YOUR USE OF THE INFORMATION OR RECOMMENDATIONS CONTAINED
                    WITHIN THE REPORT. IN NO CASE SHALL AXON’S LIABILITY, IF ANY, EXCEED THE AMOUNT YOU PAID FOR THE SERVICES PROVIDED.
                </p>
                <p className="fs-13">6. A COPY OF MY MINIMALLY RELEVANT MEDICAL HISTORY AND EEG DATA WILL BE SENT TO THE EEG ANALYST FOR REVIEW.</p>
                <p className="fs-13">
                    7. NON-IDENTIFYING DATA CONTAINED IN THE REPORT MAY BE USED IN EDUCATION AND RESEARCH. PRIVATE MEDICAL INFORMATION, INCLUDING YOUR TEST RESULTS, WILL NEVER BE
                    SHARED OVER VOICEMAIL, EMAIL OR TEXT.
                </p>
                </div>
            </div>
        </div>
    )
})

DownloadConsent.displayName = 'DownloadConsent';

export default DownloadConsent