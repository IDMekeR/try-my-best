import { Image } from 'antd';
import axios from 'axios';
import { url2 } from 'components/shared/CompVariables';
import React, { useEffect, useState } from 'react';

interface ChildProps {
    topoInfo: any;
}

const TopographImages: React.FC<ChildProps> = ({ topoInfo }) => {
    const [images, setImages] = useState<{ [key: string]: { page1: string; page2: string } }>({});
    const items = [
        { id: 1, labelName: 'PDR Topography', data: topoInfo?.pdr },
        { id: 2, labelName: 'FFT Absolute Power (Eyes Opened)', data: topoInfo?.eofftabs },
        { id: 3, labelName: 'FFT Absolute Power (Eyes Closed)', data: topoInfo?.ecfftabs },
        { id: 4, labelName: 'Z-Score FFT Absolute Power (Eyes Opened)', data: topoInfo?.eozabs },
        { id: 5, labelName: 'Z-Score FFT Absolute Power (Eyes Closed)', data: topoInfo?.eczabs },
        { id: 6, labelName: 'Absolute Power (Eyes Opened)', data: topoInfo?.eoabs },
        { id: 7, labelName: 'Absolute Power (Eyes Closed)', data: topoInfo?.ecabs },
        { id: 8, labelName: 'Relative Power (Eyes Opened)', data: topoInfo?.eorel },
        { id: 9, labelName: 'Relative Power (Eyes Closed)', data: topoInfo?.ecrel },
        { id: 10, labelName: 'FFT Relative Power (Eyes Opened)', data: topoInfo?.eofftrel },
        { id: 11, labelName: 'FFT Relative Power (Eyes Closed)', data: topoInfo?.ecfftrel },
        { id: 12, labelName: 'Result EDF Graph (Eyes Opened)', data: topoInfo?.eograph },
        { id: 13, labelName: 'Result EDF Graph (Eyes Closed)', data: topoInfo?.ecgraph },
    ];
    const getFileExtension = (url: string) => {
        return url.split('.').pop()?.toLowerCase() || '';
    };
    const decodeBase64ToImage = (base64: string) => {
        return `data:image/png;base64,${base64}`;
    };

    const fetchTxtContent = async (url: string) => {
        try {
            const response = await axios.get(url?.startsWith('https:') ? url :'');
            const page1 = decodeBase64ToImage(response?.data.page1_data);
            const page2 = decodeBase64ToImage(response?.data.page2_data);
            setImages((prev: any) => ({ ...prev, [url]: { page1, page2 } }));
        } catch (error) {
            console.error('Error fetching .txt file:', error);
        }
    };

    function getFileFormat(urzl) {
        // Create a URL object
        const urlObj = new URL(urzl);
        // Get the pathname from the URL
        const pathname = urlObj.pathname;
        // Extract the file extension
        const fileFormat = pathname.split('.').pop();
        return fileFormat;
    }
    // const lkj = "https://eegstoragetest.blob.core.windows.net/apideveegdatahubmedia/eegdocs/edf_jobfiles/JM5397_27edfplot_2024122710034675.png";
   
    // useEffect(() => {
    //     const convertToBase64 = async () => {
    //         const base64 = await convertImageToBase64(lkj);
    //         setUrl(base64);
    //         // setUrl(j);
    //     };
    //     convertToBase64();
           
    // }, []);
    // const convertImageToBase64 = async (imageUrl) => {
    //     try {
    //       const response = await fetch(imageUrl);
    //       const blob = await response.blob();
    //       const reader = new FileReader();
      
    //       return new Promise((resolve, reject) => {
    //         reader.onloadend = () => resolve(reader.result);
    //         reader.onerror = reject;
    //         reader.readAsDataURL(blob);
    //       });
    //     } catch (error) {
    //       console.error("Error fetching or converting image to Base64", error);
    //     }
    //   };
    const renderFile = (url: string) => {
        const ext = getFileFormat(url);
        const fileFormat = getFileExtension(url);

        switch (ext) {
            case 'png':
            case 'jpg':
            case 'jpeg':
                return <Image src={url} alt="File content" style={{ maxWidth: '100%', height: 'auto' }} />;
            case 'pdf':
                return <iframe src={url?.startsWith('https:') ? url : ''} title="PDF" style={{ width: '100%', height: '500px' }}></iframe>;
            case 'txt':
                if (images[url]) {
                    const { page1, page2 } = images[url];
                    return (
                        <div>
                            <div>
                                <Image src={page1} alt="File content 1" style={{ maxWidth: '100%', height: 'auto' }} />
                            </div>
                            <div>
                                <Image src={page2} alt="File content 2" style={{ maxWidth: '100%', height: 'auto' }} />
                            </div>
                        </div>
                    );
                } else {
                    fetchTxtContent(url);
                    return <div>Loading...</div>;
                }
            default:
                if (fileFormat == 'png') {
                    return <Image src={url} alt="File content" style={{ maxWidth: '100%', height: 'auto' }} />;
                } else {
                    return (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            Download
                        </a>
                    );
                }
        }
    };

    return (
        <div className="mt-3 body-content overflow-scroll">
            <div className="bg-light p-3 mb-3 d-flex">
                <div className="col">
                    <h6 className="text-dark fs-17">Account Name</h6>
                    <div className="fs-16">{topoInfo?.accname}</div>
                </div>
                <div className="col">
                    <h6 className="text-dark fs-17">Patient Name</h6>
                    <div className="fs-16">{topoInfo?.pntname}</div>
                </div>
                <div className="col">
                    <h6 className="text-dark fs-17">DOB</h6>
                    <div className="fs-16">{topoInfo?.dob}</div>
                </div>
                <div className="col">
                    <h6 className="text-dark fs-17">Gender</h6>
                    <div className="fs-16">{topoInfo?.gender}</div>
                </div>
            </div>
            <table className="table-bordered edf-step-header w-100">
                <thead>
                    <tr className="bg-mediumblue">
                        {topoInfo?.reqNo?.map((item: any, i: number) => {
                            return (
                                <th key={i} className="col p-2 text-center border-end">
                                    {item}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {topoInfo?.rdate?.map((item: any, i: number) => {
                            const originalDate = new Date(item) || null;
                            return (
                                <td key={i} className="col p-2 text-center border-end bg-light">
                                    {originalDate?.toLocaleDateString() || null}
                                </td>
                            );
                        })}
                    </tr>
                    {items?.map((itm: any) => {
                        return (
                            <React.Fragment key={itm.id}>
                                <tr className="bg-aliceblue">
                                    <td className="p-2 fw-bold" colSpan={topoInfo?.dlen}>
                                        {itm.labelName}
                                    </td>
                                </tr>
                                <tr>
                                    {itm.data?.map((itms: any, i: number) => {
                                        return (
                                            <td className="p-2" key={i}>
                                                {renderFile(itms)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TopographImages;
