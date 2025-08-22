import React from 'react';

const SummaryFindings: React.FC = () => {
    return (
        <div className="p-3 border h-100">
            <h6 className="text-dark fs-17">Summary of findings</h6>
            <div>
                <ul>
                    <li>Impression-EC: Mildly elevated frontal high beta. EO: Mildly elevated frontal high beta.</li>
                    <li>Posterior Dominant Rhythm - 13.0.</li>
                    <li>Theta/beta ratio - Eyes Closed - &quot. Eyes Opened - &quot.</li>
                    <li>Alpha/beta ratio - Eyes Closed - &quot. Eyes Opened - &quot.</li>
                    <li>Relative power - EC: Mildly elevated frontal high beta. EO: Mildly elevated frontal high beta</li>
                    <li>Asymmetry present - Eyes Closed - NO . Eyes Opened - NO.</li>
                </ul>
            </div>
        </div>
    );
};

export default SummaryFindings;
