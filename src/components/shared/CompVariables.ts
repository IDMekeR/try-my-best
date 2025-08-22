import API_URL from 'config.js';
import { useSelector, useDispatch } from 'react-redux';
import DOMPurify from 'dompurify';

const userId = Number(sessionStorage.getItem('userid'));
const accountId = Number(sessionStorage.getItem('accountid'));

const backendURL = API_URL;
const url1 = backendURL.slice(0, backendURL.lastIndexOf('/'));
const url2 = url1.slice(0, url1.lastIndexOf('/'));

const createMarkup = (html: any) => {
    return {
        __html: DOMPurify.sanitize(html),
    };
};
const currentTime = new Date();
const currentYear = currentTime.getFullYear();

const footerText = `©Healthy Paths, Inc. ${currentYear}. All rights reserved`;
const interpretText = `1.Keizer AW. Standardization and Personalized Medicine Using Quantitative EEG in Clinical Settings. Clin EEG Neurosci. 2021 Mar;52(2):82-89. doi: 10.1177/1550059419874945. Epub 2019 Sep 11. PMID: 31507225.Kopańska M, Ochojska D, Dejnowicz-Velitchkov A, Banaś-Ząbczyk A.

2.Quantitative Electroencephalography (QEEG) as an Innovative Diagnostic Tool in Mental Disorders. Int J Environ Res Public Health. 2022 Feb 21;19(4):2465. doi: 10.3390/ijerph19042465. PMID: 35206651; PMCID: PMC8879113.Livint Popa L, Dragos H, Pantelemon C, Verisezan Rosu O, Strilciuc S.

3.The Role of Quantitative EEG in the Diagnosis of Neuropsychiatric Disorders. J Med Life. 2020 Jan-Mar;13(1):8-15. doi: 10.25122/jml-2019-0085. PMID: 32341694; PMCID: PMC7175442.Yener G, Öz D. Innovations in Neurophysiology and Their Use in Neuropsychiatry. Noro Psikiyatr Ars. 2022 Oct 21;59(Suppl 1):S67-S74. doi: 10.29399/npa.28234. PMID: 36578987; PMCID: PMC9767126.`;
const pdrText = `Arns, Martijn, et al. “A Decade of EEG Theta/Beta Ratio Research in ADHD: a Meta-Analysis.” Sage Journals, 2012, https://journals.sagepub.com/doi/10.1177/1087054712460087.
Clarkea, Adam R, et al. “Age and Sex Effects in the EEG: Development of the Normal Child.” Clinical Neurophysiology, Elsevier, 27 Apr. 2001, https://www.sciencedirect.com/science/article/abs/pii/S1388245701004886.
Gold, Christian, et al. “Validity and Reliability of Electroencephalographic Frontal Alpha Asymmetry and Frontal Midline Theta as Biomarkers for Depression.” Wiley Online Library, 2012,
https://onlinelibrary.wiley.com/doi/full/10.1111/sjop.12022.
Kementrian Riset, Teknologi Dan Pendidikan Tinggi. “Electroencephalogram (EEG) Stress Analysis on Alpha/Beta Ratio and Theta/Beta Ratio.” Garuda, Jan. 2020, https://garuda.kemdikbud.go.id/documents/detail/1669212.
Picken, Christie, et al. “The Theta/Beta Ratio as an Index of Cognitive Processing in Adults with the Combined Type of Attention Deficit Hyperactivity Disorder.” Sage Journals, 26 Dec. 2019,
https://journals.sagepub.com/doi/10.1177/1550059419895142.`;
const supplementText = `<p style={{ fontSize: '8px', fontFamily: 'RobotoRegular', marginTop: 'auto' }} className="text-start report-content mb-0">
                                                    1.authors, All, et al. “A Combination of Green Tea, Rhodiola, Magnesium and B Vitamins Modulates Brain Activity and Protects against the Effects of Induced Social
                                                    Stress in Healthy Volunteers.” Taylor & Francis, 2021, <a>https://www.tandfonline.com/doi/full/10.1080/1028415X.2021.1909204.</a>
                                                </p>
                                                <p style={{ fontSize: '8px', fontFamily: 'RobotoRegular', marginTop: 'auto' }} className="text-start report-content mb-0">
                                                    2.Rajabian, Arezoo, et al. “A Review of Potential Efficacy of Saffron (Crocus Sativus L.) in Cognitive Dysfunction and Seizures.” Preventive Nutrition and Food Science,
                                                    U.S. National Library of Medicine, Dec. 2019, <a>https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6941716/.</a>
                                                </p>
                                                <p style={{ fontSize: '8px', fontFamily: 'RobotoRegular', marginTop: 'auto' }} className="text-start report-content mb-0">
                                                    3.Saletu, B., et al. “Pharmacodynamic Studies on the Central Mode of Action of S-Adenosyl-L-Methionine (Same) Infusions in Elderly Subjects, Utilizing EEG Mapping and
                                                    Psychometry - Journal of Neural Transmission.” SpringerLink, Springer-Verlag, 2002, <a>https://link.springer.com/article/10.1007/s00702-002-0768-6.</a>
                                                </p>
                                                <p style={{ fontSize: '8px', fontFamily: 'RobotoRegular', marginTop: 'auto' }} className="text-start report-content mb-0">
                                                    4.Schellenberg, R., et al. “Pharmacodynamic Effects of Two Different Hypericum Extracts in Healthy Volunteers Measured by Quantitative EEG.” Pharmacopsychiatry, ©
                                                    Georg Thieme Verlag Stuttgart · New York, 20 Apr. 2007, <a>https://www.thieme-connect.com/products/ejournals/abstract/10.1055/s-2007-979345.</a>
                                                </p>
                                                <p style={{ fontSize: '8px', fontFamily: 'RobotoRegular', marginTop: 'auto' }} className="text-start report-content mb-0">
                                                    5.Kennedy, David O. “B Vitamins and the Brain: Mechanisms, Dose and Efficacy--a Review.” Nutrients, U.S. National Library of Medicine, 27 Jan. 2016,
                                                    <a>https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4772032/.</a>
                                                </p>`;
const lifestyleText = `1.Shapiro DH Jr, Giber D. Meditation and psychotherapeutic effects. Self-regulation strategy and altered state of consciousness. Arch Gen Psychiatry. 1978 Mar;35(3):294-302. doi: 10.1001/archpsyc.1978.01770270044003. PMID: 365121.

2.Ma X, Yue ZQ, Gong ZQ, Zhang H, Duan NY, Shi YT, Wei GX, Li YF. The Effect of Diaphragmatic Breathing on Attention, Negative Affect and Stress in Healthy Adults. Front Psychol. 2017 Jun 6;8:874. doi: 10.3389/fpsyg.2017.00874. PMID: 28626434; PMCID: PMC5455070.

3.McPherson F, McGraw L. Treating generalized anxiety disorder using complementary and alternative medicine. Altern Ther Health Med. 2013 Sep-Oct;19(5):45-50. PMID: 23981404.

4.Kühn S, Mascherek A, Filevich E, Lisofsky N, Becker M, Butler O, Lochstet M, Mårtensson J, Wenger E, Lindenberger U, Gallinat J. Spend time outdoors for your brain - an in-depth longitudinal MRI study. World J Biol Psychiatry. 2022 Mar;23(3):201-207. doi: 10.1080/15622975.2021.1938670. Epub 2021 Jul 7. PMID: 34231438.

5.Klevebrant L, Frick A. Effects of caffeine on anxiety and panic attacks in patients with panic disorder: A systematic review and meta-analysis. Gen Hosp Psychiatry. 2022 Jan-Feb;74:22-31. doi: 10.1016/j.genhosppsych.2021.11.005. Epub 2021 Dec 2. PMID: 34871964.

6. Platt LM, Whitburn AI, Platt-Koch AG, Koch RL. Nonpharmacological Alternatives to Benzodiazepine Drugs for the Treatment of Anxiety in Outpatient Populations: A Literature Review. J Psychosoc Nurs Ment Health Serv. 2016 Aug 1;54(8):35-42. doi: 10.3928/02793695-20160725-07. PMID: 27479478.

7.Steffen PR, Bartlett D, Channell RM, Jackman K, Cressman M, Bills J, Pescatello M. Integrating Breathing Techniques Into Psychotherapy to Improve HRV: Which Approach Is Best? Front Psychol. 2021 Feb 15;12:624254. doi: 10.3389/fpsyg.2021.624254. PMID: 33658964; PMCID: PMC7917055.`;

const nfbText = `1.Arns, M., de Ridder, S., Strehl, U., Breteler, M., & Coenen, A. (2009). Efficacy of neurofeedback treatment in ADHD: The effects on inattention, impulsivity, and hyperactivity: A meta-analysis. Clinical EEG and Neuroscience, 40(3), 180-189. doi: 10.1177/155005940904000311 https://www.ncbi.nlm.nih.gov/pubmed/19715181.

2.Micoulaud-Franchi, J-A., Geoffroy, P. A., Fond, G., Lopez, R., Bioulac, S., Philip, P. (2014). EEG neurofeedback treatments in children with ADHD: An update meta-analysis of randomized controlled trials. Frontiers in Human Neuroscience, 8(906), 1-7. doi: 10.3389/fnhum.2014.00906 https://www.ncbi.nlm.nih.gov/pubmed/25431555.

3.Wigton, N. L., & Krigbaum, G. (2015). Attention, executive function, behavior, and electrocortical function, significantly improved with 19-channel z-score neurofeedback in a clinical setting: A pilot study. Journal of Attention Disorders, [e-pub ahead of print]. doi: 10.1177/1087054715577135, https://www.ncbi.nlm.nih.gov/pubmed/25823743.

4.Escolano, Carlos, and Javier Minguez. “EEG-Based Upper Alpha Neurofeedback Training Improves Working Memory Performance .” IEEE Eplore, 2011, https://ieeexplore.ieee.org/abstract/document/6090651/.`;
const pbmText = `1.Chao LL, Barlow C, Karimpoor M, Lim L. Changes in Brain Function and Structure After Self-Administered Home Photobiomodulation Treatment in a Concussion Case. Front Neurol. 2020 Sep 8;11:952. doi: 10.3389/fneur.2020.00952. PMID: 33013635; PMCID: PMC7509409. https://pubmed.ncbi.nlm.nih.gov/33013635/

2. Cheng G, Kong RH, Zhang LM, Zhang JN. Mitochondria in traumatic brain injury and mitochondrial-targeted multipotential therapeutic strategies. Br J Pharmacol. 2012 Oct;167(4):699-719. doi: 10.1111/j.1476-5381.2012.02025.x. PMID: 23003569; PMCID: PMC3575772. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3575772/

3. Naeser MA, Zafonte R, Krengel MH, Martin PI, Frazier J, Hamblin MR, Knight JA, Meehan WP 3rd, Baker EH. Significant improvements in cognitive performance post-transcranial, red/near-infrared light-emitting diode treatments in chronic, mild traumatic brain injury: open-protocol study. J Neurotrauma. 2014 Jun 1;31(11):1008-17. doi: 10.1089/neu.2013.3244. Epub 2014 May 8. PMID: 24568233; PMCID: PMC4043367. https://pubmed.ncbi.nlm.nih.gov/24568233/

4. Oron A, Oron U, Streeter J, De Taboada L, Alexandrovich A, Trembovler V, Shohami E. Near infrared transcranial laser therapy applied at various modes to mice following traumatic brain injury significantly reduces long-term neurological deficits. J Neurotrauma. 2012 Jan 20;29(2):401-7. doi: 10.1089/neu.2011.2062. Epub 2012 Jan 4. PMID: 22040267. https://pubmed.ncbi.nlm.nih.gov/22040267/

5. Xuan W, Agrawal T, Huang L, Gupta GK, Hamblin MR. Low-level laser therapy for traumatic brain injury in mice increases brain derived neurotrophic factor (BDNF) and synaptogenesis. J Biophotonics. 2015 Jun;8(6):502-11. doi: 10.1002/jbio.201400069. Epub 2014 Sep 8. PMID: 25196192; PMCID: PMC5379854. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5379854/`;

export { url2, userId, accountId, useSelector, useDispatch, footerText, interpretText, pdrText, createMarkup, supplementText, lifestyleText, nfbText, pbmText };
