import React, { useState } from 'react';
import './ROICalculator.css';

function ROICalculator() {
    const [inputs, setInputs] = useState({
        annualRevenue: 3000000,
        currentCustomers: 200,
        monthlyLeads: 15,
        averageDealSize: 15000,
        closeRate: 15,
        churnRate: 10,
        threatCaptainCost: 1500,
        closeRateImprovement: 10,
        dealSizeImprovement: 25,
        churnRateReduction: 3
    });

    const [results, setResults] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const calculateResults = () => {
        // Without ThreatCaptain
        const monthlyDeals = (inputs.monthlyLeads * (inputs.closeRate / 100));
        const annualNewCustomers = Math.round(monthlyDeals * 12);
        const annualChurn = Math.round(inputs.currentCustomers * (inputs.churnRate / 100));
        const totalCustomersWithout = inputs.currentCustomers + annualNewCustomers - annualChurn;
        const annualRevenueWithout = totalCustomersWithout * inputs.averageDealSize;

        // With ThreatCaptain
        const improvedCloseRate = inputs.closeRate + inputs.closeRateImprovement;
        const improvedDealSize = inputs.averageDealSize * (1 + inputs.dealSizeImprovement / 100);
        const improvedChurnRate = inputs.churnRate - inputs.churnRateReduction;
        
        const improvedMonthlyDeals = (inputs.monthlyLeads * (improvedCloseRate / 100));
        const improvedAnnualNewCustomers = Math.round(improvedMonthlyDeals * 12);
        const improvedAnnualChurn = Math.round(inputs.currentCustomers * (improvedChurnRate / 100));
        const totalCustomersWith = inputs.currentCustomers + improvedAnnualNewCustomers - improvedAnnualChurn;
        const annualRevenueWith = totalCustomersWith * improvedDealSize;

        const additionalMonthlyRevenue = (annualRevenueWith - annualRevenueWithout) / 12;
        const monthlyROI = ((additionalMonthlyRevenue - inputs.threatCaptainCost) / inputs.threatCaptainCost) * 100;

        setResults({
            without: {
                dealSize: inputs.averageDealSize,
                newCustomers: annualNewCustomers,
                churnedCustomers: annualChurn,
                totalCustomers: totalCustomersWithout,
                annualRevenue: annualRevenueWithout
            },
            with: {
                dealSize: improvedDealSize,
                newCustomers: improvedAnnualNewCustomers,
                churnedCustomers: improvedAnnualChurn,
                totalCustomers: totalCustomersWith,
                annualRevenue: annualRevenueWith
            },
            monthlyNewRevenue: additionalMonthlyRevenue,
            roi: monthlyROI
        });
    };

    return (
        <div className="calculator">
            <h1>ThreatCaptain ROI Calculator</h1>
            
            <div className="input-group">
                <div className="input-field">
                    <label>Annual Revenue ($)</label>
                    <input
                        type="number"
                        name="annualRevenue"
                        value={inputs.annualRevenue}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-field">
                    <label>Current Customers</label>
                    <input
                        type="number"
                        name="currentCustomers"
                        value={inputs.currentCustomers}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-field">
                    <label>New Qualified Leads per Month</label>
                    <input
                        type="number"
                        name="monthlyLeads"
                        value={inputs.monthlyLeads}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-field">
                    <label>Average Deal Size ($)</label>
                    <input
                        type="number"
                        name="averageDealSize"
                        value={inputs.averageDealSize}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-field">
                    <label>Current Close Rate (%)</label>
                    <input
                        type="number"
                        name="closeRate"
                        value={inputs.closeRate}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-field">
                    <label>Current Churn Rate (%)</label>
                    <input
                        type="number"
                        name="churnRate"
                        value={inputs.churnRate}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-field">
                    <label>ThreatCaptain Monthly Cost ($)</label>
                    <input
                        type="number"
                        name="threatCaptainCost"
                        value={inputs.threatCaptainCost}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="impact-section">
                <h2>ThreatCaptain Impact</h2>
                <div className="impact-inputs">
                    <div className="input-field improvement">
                        <label>Close Rate Improvement (%)</label>
                        <input
                            type="number"
                            name="closeRateImprovement"
                            value={inputs.closeRateImprovement}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-field improvement">
                        <label>Deal Size Improvement (%)</label>
                        <input
                            type="number"
                            name="dealSizeImprovement"
                            value={inputs.dealSizeImprovement}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-field improvement">
                        <label>Churn Rate Reduction (%)</label>
                        <input
                            type="number"
                            name="churnRateReduction"
                            value={inputs.churnRateReduction}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <button onClick={calculateResults}>Calculate ROI</button>

            {results && (
                <div className="results">
                    <div className="comparison">
                        <div className="without">
                            <h3>Without ThreatCaptain</h3>
                            <p>Average Deal Size: ${results.without.dealSize.toLocaleString()}</p>
                            <p>New Customers: {results.without.newCustomers}</p>
                            <p>Churned Customers: {results.without.churnedCustomers}</p>
                            <p>Total Customers: {results.without.totalCustomers}</p>
                            <p>Annual Revenue: ${results.without.annualRevenue.toLocaleString()}</p>
                        </div>

                        <div className="with">
                            <h3>With ThreatCaptain</h3>
                            <p>Average Deal Size: ${results.with.dealSize.toLocaleString()}</p>
                            <p>New Customers: {results.with.newCustomers}</p>
                            <p>Churned Customers: {results.with.churnedCustomers}</p>
                            <p>Total Customers: {results.with.totalCustomers}</p>
                            <p>Annual Revenue: ${results.with.annualRevenue.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="summary">
                        <p>Monthly New Revenue: ${results.monthlyNewRevenue.toLocaleString()}</p>
                        <p>Monthly ROI: {results.roi.toFixed(0)}%</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ROICalculator;