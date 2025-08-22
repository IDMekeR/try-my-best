import React, { useState, useEffect } from 'react';
import EDF from './EDF';
import { Modal, Divider, Tooltip, Tabs, Spin, Dropdown } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import { Checkbox } from 'components/shared/FormComponent';
import { RightOutlined, DownOutlined } from 'components/shared/AntIcons';
import { useLocation } from 'react-router-dom';
import 'assets/styles/customtheme.scss';
import 'assets/styles/edfViewer.scss';
import EEGImage from 'assets/img/newBrandname.svg';

const { TabPane } = Tabs;

function EdfViewer() {
    const location = useLocation();
    const [edf, setEdf] = useState(null);
    const [edf1, setEdf1] = useState(null);
    const [samplingRate, setSamplingRate] = useState(120);
    const [visualSeconds, setVisualSeconds] = useState(5);
    const [scaleY, setScaleY] = useState('0.4');
    const [offsetSeconds, setOffsetSeconds] = useState(0);
    const [maxSeconds, setMaxSeconds] = useState(0);
    const queryParams = new URLSearchParams(location.search);
    const eyeOpen = queryParams.get('Eo');
    const eyeClose = queryParams.get('Ec');
    const artifactEo = queryParams.get('EoArtifact');
    const artifactEc = queryParams.get('EcArtifact');
    const url1 = queryParams.get('url');
    const reqId = queryParams.get('reqId');
    const pntInfo = queryParams.get('pntInfo');
    const accName = queryParams.get('accInfo');
    const eyeOpenFile = queryParams.get('EoDownload');
    const eyeCloseFile = queryParams.get('EcDownload');
    const displayName = `${pntInfo} (${reqId})`;
    const [selectEdf, setSelectedEdf] = useState(queryParams.get('selectedEdf'));
    const edfPath = queryParams.get('selectedEdf') == 'EO' ? eyeOpen : eyeClose;
    const path = edfPath;
    const artifactPath = queryParams.get('selectedEdf') == 'EO' ? artifactEo : artifactEc;
    const fileDownload = queryParams.get('selectedEdf') == 'EO' ? eyeOpenFile : eyeCloseFile;
    const [selectedMontages, setSelectedMontages] = useState([]);
    const [montageModal, setMontageModal] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(300);
    const [totalSecond, setTotalSecond] = useState(0);
    const [isArtifact, setIsArtifact] = useState(false);
    const labelNames = ['BIN Photic', 'EDF Annotations'];
    const [downloadLoad, setDownloadLoad] = useState(false);
    var signalPoints = [];
    var signalPoints1 = [];
    var channelsCount = 0;
    var fontFamily = 'Roboto Mono';
    var fontSize = 13;

    const scaleMenu = [
        { key: '0.1', label: '1 μV/px' },
        { key: '0.2', label: '3 μV/px' },
        { key: '0.3', label: '5 μV/px' },
        { key: '0.4', label: '7 μV/px' },
        { key: '0.7', label: '10 μV/px' },
        { key: '0.8', label: '12 μV/px' },
        { key: '0.9', label: '15 μV/px' },
        { key: '1.0', label: '17 μV/px' },
        { key: '1.1', label: '20 μV/px' },
        { key: '1.3', label: '50 μV/px' },
        { key: '1.5', label: '100 μV/px' },
    ];

    const secondMenu = [
        { key: '1', label: '1 s/screen' },
        { key: '5', label: '5 s/screen' },
        { key: '10', label: '10 s/screen' },
        { key: '15', label: '15 s/screen' },
        { key: '30', label: '30 s/screen' },
        { key: '60', label: '60 s/screen' },
        { key: '100', label: '100 s/screen' },
    ];

    const handleArtifactCheckbox = () => {
        setIsArtifact(!isArtifact);
    };

    const generateMontageMenu = (edf) => {
        const montageMenu = [];
        if (edf && edf?.channels) {
            const length = edf?.channels.filter((channel) => {
                if (labelNames.includes(channel?.label)) {
                    return false;
                }
                return true;
            }).length;
            for (let i = 0; i < length; i++) {
                const label = edf?.channels[i]?.label;

                if (label) {
                    montageMenu.push({ key: label, label: label });
                }
            }
        }
        return montageMenu;
    };

    const montageMenu = generateMontageMenu(edf);

    //moving animattion
    const handleForward = () => {
        setOffsetSecond(offsetSeconds + 1);
        setIsPlaying(false);
    };
    const handleBackward = () => {
        setOffsetSecond(offsetSeconds - 1);
        setIsPlaying(false);
    };

    const handlePlay = () => {
        setIsPlaying((prevState) => !prevState);
    };

    const handleStop = () => {
        setIsPlaying(false);
    };

    const increaseSpeed = () => {
        setSpeed(speed > 100 ? speed - 100 : 100);
    };

    const decreaseSpeed = () => {
        setSpeed(speed + 100);
    };

    useEffect(() => {
        if (offsetSeconds >= totalSecond - visualSeconds) {
            handleStop();
        }
    }, [offsetSeconds]);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setOffsetSecond((prevOffset) => prevOffset + 1);
            }, speed);
            return () => clearInterval(interval);
        }
    }, [isPlaying, speed]);

    const handleOpen = () => {
        setMontageModal(true);
    };

    const handleCancel = () => {
        setMontageModal(false);
        setIsSave(false);
    };

    const handleSave = () => {
        setIsSave(true);
        setMontageModal(false);
    };

    const handleCheckboxChange = (checkedValues) => {
        setSelectedMontages(checkedValues);
    };

    useEffect(() => {
        setSelectedEdf(queryParams.get('selectedEdf'));
    }, [queryParams.get('selectedEdf')]);

    const handleSelectAll = () => {
        const allMontages = montageMenu.map((item) => item?.label);
        setSelectedMontages(allMontages);
    };

    const handleUnselectAll = () => {
        setSelectedMontages([]);
    };

    const pad = (n, width, z) => {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };

    const timeToText = (seconds) => {
        var s = seconds % 60;
        var m = Math.floor(seconds / 60) % 60;
        var h = Math.floor(seconds / 3600);
        return (h > 0 ? pad(h, 2) + ':' : '') + pad(m, 2) + ':' + pad(s, 2);
    };

    const updateScrollBar = () => {
        var secs = visualSeconds;
        var max = maxSeconds;
        var maxScroll = Math.ceil(max - secs);
        document.getElementById('scroll').setAttribute('max', maxScroll);
        document.getElementById('scroll').value = offsetSeconds;
    };

    const resizeCanvasEEG = () => {
        const parent = document.getElementById('canvasSignalholder');
        const canvas = document.getElementById('canvasSignal');
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        canvas.style.width = parent.offsetWidth;
        canvas.style.height = parent.offsetHeight;
        const canvasLine = document.getElementById('canvasSignalLine');
        canvasLine.width = parent.offsetWidth;
        canvasLine.height = parent.offsetHeight;
        canvasLine.style.width = parent.offsetWidth;
        canvasLine.style.height = parent.offsetHeight;
        const canvasNow = document.getElementById('canvasSignalNow');
        canvasNow.width = parent.offsetWidth;
        canvasNow.height = parent.offsetHeight;
        canvasNow.style.width = parent.offsetWidth;
        canvasNow.style.height = parent.offsetHeight;
        drawEEGGrid();
    };

    const drawEEGGrid = () => {
        var canvas = document.getElementById('canvasSignal');
        var w = canvas.width;
        var h = canvas.height;

        var context = canvas.getContext('2d');
        context.width = w;
        context.height = h;
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, w, h);
        context.translate(0.5, 0.5);
        var offset = 10;
        var vh = h - offset * 2;
        var vw = w - offset * 2;
        var pixelsPerSecond = vw / visualSeconds;

        context.strokeWidth = 1;

        for (var i = 1; i <= visualSeconds; i++) {
            context.lineWidth = 1;
            context.strokeStyle = '#DDD';
            context.beginPath();
            context.moveTo(offset + pixelsPerSecond * (i - 0.5), offset);
            context.lineTo(offset + pixelsPerSecond * (i - 0.5), offset + vh);
            context.stroke();

            context.lineWidth = 1;
            context.strokeStyle = '#999';
            context.beginPath();
            context.moveTo(offset + pixelsPerSecond * i, offset);
            context.lineTo(offset + pixelsPerSecond * i, offset + vh);
            context.stroke();
        }

        context.strokeStyle = '#999';
        context.lineWidth = 1;
        context.strokeRect(offset, offset, vw, vh);
    };

    const redrawSignals = () => {
        var canvas = document.getElementById('canvasSignalLine');
        var context = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        context.width = w;
        context.height = h;
        context.clearRect(0, 0, w, h);
        var offset = 50;

        var vh = h - offset * 1.7;
        var vw = w - offset * 2;
        var pixelsPerSecond = vw / visualSeconds;
        var pixelsPerSample = (1.0 * pixelsPerSecond) / samplingRate;

        context.font = fontSize + 'px "' + fontFamily + '"';
        context.fillStyle = '#333';
        context.textAlign = 'left';

        for (var i = 0; i < visualSeconds; i++) {
            context.fillText(timeToText(offsetSeconds + i), offset + 1 + i * pixelsPerSecond, offset + vh - 2);
        }

        var channelCount = signalPoints.length;
        var channelOffset = vh / channelCount + 1;
        var newOffset = vh / selectedMontages.length;
        if (selectedMontages.length > 0) {
            for (let i = 0; i < channelsCount; i++) {
                for (j = 0; j < selectedMontages.length; j++)
                    if (selectedMontages[j] === edf?.channels[i]?.label) {
                        var d = signalPoints[i];
                        var x = offset;
                        var y = offset + (j + 0.1) * newOffset;

                        // context.lineWidth = 1;
                        // context.strokeStyle = '#999';
                        // context.beginPath();
                        // context.moveTo(x, y);
                        // context.lineTo(x + vw, y);
                        // context.stroke();

                        context.fillStyle = '#ff3131';
                        context.textAlign = 'right';
                        context.fillText('  ' + edf?.channels[i]?.label.replace('EEG ', '').substring(0, 3) + '  ', offset, y + fontSize / 2);

                        context.lineWidth = 1.1;
                        context.strokeStyle = '#159';
                        context.beginPath();
                        context.moveTo(x, y);

                        for (var j = 0; j < d.length; j++) {
                            context.lineTo(x, y - d[j] * scaleY);
                            x += pixelsPerSample;
                        }
                        context.stroke();
                    }
            }
        } else {
            for (let i = 0; i < channelsCount; i++) {
                let d = signalPoints[i];
                var a = signalPoints1[i];
                let x = offset;
                let y = offset + (i + 0.1) * channelOffset - 1;

                // context.lineWidth = 1;
                // context.strokeStyle = '#999';
                // context.beginPath();
                // context.moveTo(x, y);
                // context.lineTo(x + vw, y);
                // context.stroke();

                context.fillStyle = '#ff3131';
                context.textAlign = 'right';
                context.fillText('  ' + edf?.channels[i]?.label.replace('EEG ', '').substring(0, 3) + '  ', offset, y + fontSize / 2);

                context.lineWidth = 1.1;
                // context.strokeStyle = '#159';
                context.strokeStyle = '#159'; // Different colorfor the normal file

                context.beginPath();
                context.moveTo(x, y);

                for (let j = 0; j < d?.length; j++) {
                    context.lineTo(x, y - d[j] * scaleY);
                    x += pixelsPerSample;
                }
                context.stroke();

                x = offset;
                // Draw the second line (a)
                context.lineWidth = 1;
                // context.strokeStyle = '#FF3131'; // Different color for the artifact  line
                context.strokeStyle = '#ff2727';

                context.beginPath();
                context.moveTo(x, y);
                for (let j = 0; j < a?.length; j++) {
                    context.lineTo(x, y - a[j] * scaleY);
                    x += pixelsPerSample;
                }
                if (isArtifact) {
                    context.stroke();
                }
            }
        }
    };

    useEffect(() => {
        if (isSave) {
            updateData();
            setIsSave(false);
        }
    }, [isSave]);

    const setScaleYa = (scale) => {
        setScaleY(scale);
    };

    useEffect(() => {
        updateData();
    }, [scaleY]);

    const updateData = () => {
        if (edf) {
            signalPoints = edf.read(offsetSeconds, visualSeconds);
            channelsCount = edf?.channels?.filter((channel) => {
                if (labelNames.includes(channel.label)) {
                    return false;
                }
                return true;
            }).length;
        }
        if (edf1) {
            signalPoints1 = edf1.read(offsetSeconds, visualSeconds);
            channelsCount = edf1?.channels?.filter((channel) => {
                if (labelNames.includes(channel.label)) {
                    return false;
                }
                return true;
            }).length;
        }
        redrawSignals();
    };

    useEffect(() => {
        updateData();
    }, [isArtifact]);

    const setVisualSecond = (seconds) => {
        setVisualSeconds(seconds);
    };

    useEffect(() => {
        drawEEGGrid();
        updateData();
    }, [visualSeconds]);

    const setOffsetSecond = (offset) => {
        setOffsetSeconds(offset);
    };

    useEffect(() => {
        updateData();
    }, [offsetSeconds]);

    const base64ToBufferAsync = (base64, isArtifact) => {
        var dataUrl = 'data:application/octet-binary;base64,' + base64;

        fetch(dataUrl)
            .then((res) => res.arrayBuffer())
            .then((buffer) => {
                var buf = new Uint8Array(buffer);
                var edfValue = new EDF(buf);
                if (isArtifact) {
                    setEdf1(edfValue);
                } else {
                    setEdf(edfValue);
                }
                setOffsetSeconds(0);
                setMaxSeconds(edfValue?.duration);
                setSamplingRate(edfValue?.sampling_rate);
            });
    };

    useEffect(() => {
        updateData();
        updateScrollBar();
        setTotalSecond(edf?.data_records);
    }, [edf]);

    const openFile = (path, isArtifact) => {
        const fileUrl = url1?.startsWith('https:') ? path : "";

        fetch(fileUrl)
            .then((response) => response.blob())
            .then((fileData) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target.result;
                    const base64Data = base64.replace('data:application/octet-stream;base64,', '');
                    base64ToBufferAsync(base64Data, isArtifact);
                };
                reader.readAsDataURL(fileData);
            })
            .catch((error) => {
                console.error('Error fetching EDF file:', error);
            });
    };

    const downloadFile = (base64String, fileName) => {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${base64String}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openDownloadFile = (path, type) => {
        const fileUrl = url1?.startsWith('https:') ? path : "";
        fetch(fileUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then((blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64String = reader.result.split(',')[1];
                    const fileName = `${reqId}_${type}_edf_graph.pdf`;
                    downloadFile(base64String, fileName);
                };
            })
            .catch((error) => {
                console.error('Error fetching PDF file:', error);
            })
            .finally(() => {
                setDownloadLoad(false);
            });
    };

    const handleSecondClick = (e) => {
        setVisualSecond(parseFloat(e.key));
    };
    const handleScaleClick = (e) => {
        setScaleYa(parseFloat(e.key));
    };

    useEffect(() => {
        if (url1 && path) {
            openFile(path, false);
            openFile(artifactPath, true);
        }
    }, []);

    useEffect(() => {
        if (url1 && path) {
            openFile(path, false);
            openFile(artifactPath, true);
        }
    }, [url1, path, selectEdf, artifactPath]);

    useEffect(() => {
        const parent = document.getElementById('canvasSignalholder');
        resizeCanvasEEG();
    }, []);

    return (
        <div className="edfViewer ">
            <div>
                <div className="  w-100 position-relative">
                    <div className="d-flex flex-column">
                        <div className="header-cont  d-flex align-items-center justify-content-between position-relative" style={{ height: '70px' }}>
                            <img className="ms-2 logo" src={EEGImage} alt="EEG Logo" />
                            <span className="title-crd fw-bold  position-absolute d-flex justify-content-center align-items-center  main-title">
                                EEG EDF VIEWER - <span className="title-crd fw-bold px-2  main-title">{queryParams.get('selectedEdf') == 'EO' ? 'Eye Open' : 'Eye Close'}</span>
                            </span>
                            <div className="pe-3   patient-detail d-flex flex-column">
                                <span className="title-crd fw-bold">
                                    Patient Name: <span className="fw-normal title-crd text-capitalize">{displayName}</span>
                                </span>
                                <span className="title-crd fw-bold">
                                    Account Name: <span className="fw-normal title-crd text-capitalize">{accName}</span>
                                </span>
                            </div>
                        </div>

                        <div className="edf-tabs">
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="View" key="1">
                                    <div className=" m-1 d-flex">
                                        <div className=" p-2 show-container  d-flex flex-column justify-content-between">
                                            <div className="preview-container d-flex">
                                                <div className="">
                                                    <span style={{ marginRight: '8px' }}>Scale:</span>
                                                    <Dropdown
                                                        className="scale-dropdown"
                                                        menu={{
                                                            onClick: handleScaleClick,
                                                            items: scaleMenu,
                                                        }}
                                                        trigger={['click']}
                                                    >
                                                        <a
                                                            className="ant-dropdown-link position-relative "
                                                            onClick={(e) => e.preventDefault()}
                                                            style={{ background: 'white', padding: '2px 5px 2px 5px' }}
                                                        >
                                                            {scaleY == '0.1'
                                                                ? 1
                                                                : scaleY == '0.2'
                                                                  ? 3
                                                                  : scaleY == '0.3'
                                                                    ? 5
                                                                    : scaleY == '0.4'
                                                                      ? 7
                                                                      : scaleY == '0.7'
                                                                        ? 10
                                                                        : scaleY == '0.8'
                                                                          ? 12
                                                                          : scaleY == '0.9'
                                                                            ? 15
                                                                            : scaleY == '1.0'
                                                                              ? 17
                                                                              : scaleY == '1.1'
                                                                                ? 20
                                                                                : scaleY == '1.3'
                                                                                  ? 50
                                                                                  : scaleY == '1.5'
                                                                                    ? 100
                                                                                    : scaleY}{' '}
                                                            μV/px
                                                            <span className="d-inline-grid navigation">
                                                                <DownOutlined className="" rotate={180} /> <DownOutlined />
                                                            </span>
                                                        </a>
                                                    </Dropdown>
                                                </div>
                                                <div className="ps-4 ms-2">
                                                    <span style={{ marginRight: '8px' }}>Amplitude:</span>
                                                    <Dropdown
                                                        className="amplitude-dropdown"
                                                        menu={{
                                                            onClick: handleSecondClick,
                                                            items: secondMenu,
                                                        }}
                                                        trigger={['click']}
                                                    >
                                                        <a
                                                            className="ant-dropdown-link position-relative"
                                                            onClick={(e) => e.preventDefault()}
                                                            style={{ background: 'white', padding: '2px 5px 2px 5px' }}
                                                        >
                                                            {visualSeconds} s/screen
                                                            <span className="d-inline-grid navigation">
                                                                <DownOutlined className="" rotate={180} /> <DownOutlined />
                                                            </span>
                                                        </a>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" p-2 show-artifact fs-15 my-auto">
                                            <Checkbox checked={isArtifact} onChange={handleArtifactCheckbox} className="rounded fs-5">
                                                <span className="my-auto fs-15">Apply Artifact Rejection</span>
                                            </Checkbox>
                                        </div>
                                        <div className=" p-2 download-edfgrpah">
                                            {fileDownload !== 'undefined' && (
                                                <div>
                                                    <Button
                                                        type="primary"
                                                        className="text-success text-white p-3 montage-btn"
                                                        loading={downloadLoad}
                                                        onClick={() => {
                                                            setDownloadLoad(true);
                                                            openDownloadFile(fileDownload, queryParams.get('selectedEdf') == 'EO' ? 'Eyeopen' : 'Eyeclose');
                                                        }}
                                                    >
                                                        Download Edf Graph
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            {edf == null && edf1 == null ? (
                <div className="edfLoading p-5">
                    <Spin size="large" />
                </div>
            ) : (
                ' '
            )}
            <div className="edf-canvas" id="canvasSignalholder">
                <canvas id="canvasSignal" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></canvas>
                <canvas id="canvasSignalLine" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></canvas>
                <canvas id="canvasSignalNow" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></canvas>
            </div>
            <div className="position-absolute bottom-0 w-100 ">
                <div className="px-2 edf-scroller">
                    <input id="scroll" type="range" min="0" max="0" className="w-100" value={offsetSeconds} onChange={(e) => setOffsetSecond(parseFloat(e.target.value))} />
                </div>
                <div className="ps-0 d-flex navigationCont pt-1 pb-5">
                    <Tooltip title="Backward" className="mt-0">
                        <Button onClick={handleBackward}>{'<'}</Button>
                    </Tooltip>
                    {isPlaying ? (
                        <Tooltip title="Pause" className="mt-0">
                            <Button className="play-btn" onClick={handlePlay}>
                                ❚❚
                            </Button>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Play" className="mt-0">
                            <Button className="play-btn" onClick={handlePlay}>
                                &#x25B7;
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip title="Stop" className="mt-0">
                        <Button className="stop-btn" onClick={handleStop}>
                            &#x25A0;
                        </Button>
                    </Tooltip>
                    <Tooltip title="Forward" className="mt-0">
                        <Button onClick={handleForward}>{'>'}</Button>
                    </Tooltip>
                    <Tooltip title="Decrease Speed" className="mt-0">
                        <Button onClick={decreaseSpeed}>-</Button>
                    </Tooltip>
                    <Tooltip title="Increase Speed" className="mt-0">
                        <Button onClick={increaseSpeed}>+</Button>
                    </Tooltip>
                </div>
            </div>

            <Modal
                title={<h2 style={{ fontSize: '26px' }}>Montage</h2>}
                className="montageModal"
                width={800}
                centered
                open={montageModal}
                onCancel={handleCancel}
                footer={[
                    <Button key="Close" onClick={handleCancel} style={{ fontSize: '20px', marginRight: '10px' }}>
                        Close
                    </Button>,
                    <Button key="selectAll" type="primary" disabled={!edf} onClick={handleSelectAll} style={{ fontSize: '20px', marginRight: '10px', borderRadius: '8px' }}>
                        Select All
                    </Button>,
                    <Button key="unselectAll" type="primary" disabled={!edf} onClick={handleUnselectAll} style={{ fontSize: '20px', marginRight: '10px', borderRadius: '8px' }}>
                        Unselect All
                    </Button>,
                    <Button key="proceed" type="primary" disabled={!edf} onClick={handleSave} style={{ fontSize: '20px', borderRadius: '8px' }}>
                        Save
                    </Button>,
                ]}
            >
                <Divider />
                {!edf ? (
                    <div className="edfLoading p-5 d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                        <Spin spinning={true} size="large" />
                    </div>
                ) : (
                    <div className="ps-2 pe-2 mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', height: '400px' }}>
                        <div style={{ flex: 1, marginRight: '20px', padding: '20px', backgroundColor: '#f3f3ff', borderRadius: '8px' }}>
                            <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>All Channels</h4>
                            <div style={{ height: 'calc(100% - 90px)', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
                                <Checkbox.Group
                                    style={{ width: '100%', display: 'flex', flexDirection: 'column', maxHeight: '280px', overflowY: 'auto' }}
                                    value={selectedMontages}
                                    onChange={handleCheckboxChange}
                                >
                                    {montageMenu.map((item, index) => (
                                        <Checkbox key={index} value={item.label}>
                                            {item.label}
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button type="primary" className="d-flex justify-content-center" shape="circle" icon={<RightOutlined />} disabled size="large" style={{ margin: '0 10px' }} />
                        </div>
                        <div style={{ flex: 1, marginLeft: '20px', padding: '20px', backgroundColor: '#f3f3ff', borderRadius: '8px' }}>
                            <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Selected Channels</h4>
                            <div style={{ height: 'calc(100% - 90px)', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
                                {Array.isArray(selectedMontages) &&
                                    selectedMontages.map((item, index) => (
                                        <div key={index} style={{ marginBottom: '10px', cursor: 'pointer' }}>
                                            <input type="checkbox" id={`selected-channel-${index}`} value={item} checked disabled />
                                            <label htmlFor={`selected-channel-${index}`} style={{ marginLeft: '10px' }}>
                                                {item}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default EdfViewer;
