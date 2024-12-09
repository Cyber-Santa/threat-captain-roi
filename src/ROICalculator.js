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
       dealSizeImprovement: 5,
       churnRateReduction: 3
   });

   const [enabledImpacts, setEnabledImpacts] = useState({
       sales: false,
       service: false,
       qbr: false
   });

   const [results, setResults] = useState(null);

   const handleChange = (e) => {
       const { name, value } = e.target;
       setInputs(prev => ({
           ...prev,
           [name]: value === '' ? '' : parseFloat(value)
       }));
   };

   const calculateResults = () => {
       const monthlyDeals = (inputs.monthlyLeads * (inputs.closeRate / 100));
       const annualNewCustomers = Math.round(monthlyDeals * 12);
       const annualChurn = Math.round(inputs.currentCustomers * (inputs.churnRate / 100));
       const totalCustomersWithout = inputs.currentCustomers + annualNewCustomers - annualChurn;
       const annualRevenueWithout = totalCustomersWithout * inputs.averageDealSize;

       const improvedCloseRate = inputs.closeRate + (enabledImpacts.sales ? inputs.closeRateImprovement : 0);
       const improvedDealSize = inputs.averageDealSize * (1 + (enabledImpacts.service ? inputs.dealSizeImprovement : 0) / 100);
       const improvedChurnRate = inputs.churnRate - (enabledImpacts.qbr ? inputs.churnRateReduction : 0);
       
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
           
           <div className="section-group">
               <h2>Sales Numbers</h2>
               <div className="section-content">
                   <div className="section-text">
                       <p>Understanding your current sales performance is crucial for measuring the impact of ThreatCaptain. These metrics help establish your baseline revenue and customer value.</p>
                   </div>
                   <div className="inputs-container">
                       <div className="input-row">
                           <div className="input-field">
                               <label>Annual Revenue ($)</label>
                               <input
                                   type="text"
                                   name="annualRevenue"
                                   value={inputs.annualRevenue.toLocaleString()}
                                   onChange={e => {
                                       const value = e.target.value.replace(/,/g, '');
                                       handleChange({target: {name: 'annualRevenue', value}});
                                   }}
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
                       </div>
                       <div className="input-field">
                           <label>Average Deal Size ($)</label>
                           <input
                               type="number"
                               name="averageDealSize"
                               value={inputs.currentCustomers ? (inputs.annualRevenue / inputs.currentCustomers).toFixed(2) : 0}
                               readOnly
                               className="bg-gray-100"
                           />
                       </div>
                   </div>
               </div>
           </div>

           <div className="section-group">
               <h2>Customer Acquisition</h2>
               <div className="section-content">
                   <div className="section-text">
                       <p>Your lead generation and conversion rates determine how quickly you can grow your customer base. ThreatCaptain helps improve these metrics.</p>
                   </div>
                   <div className="inputs-container">
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
                           <label>Current Close Rate (%)</label>
                           <input
                               type="number"
                               name="closeRate"
                               value={inputs.closeRate}
                               onChange={handleChange}
                           />
                       </div>
                   </div>
               </div>
           </div>

           <div className="section-group">
               <h2>Customer Success</h2>
               <div className="section-content">
                   <div className="section-text">
                       <p>Customer retention is key to sustainable growth. Lower churn rates mean better customer satisfaction and more predictable revenue.</p>
                   </div>
                   <div className="inputs-container">
                       <div className="input-field">
                           <label>Current Churn Rate (%)</label>
                           <input
                               type="number"
                               name="churnRate"
                               value={inputs.churnRate}
                               onChange={handleChange}
                           />
                       </div>
                   </div>
               </div>
           </div>

           <div className="section-group">
               <div className="input-field">
                   <label>ThreatCaptain Monthly Investment ($)</label>
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
               <div className="section-text main-impact-text">
                   <p>ThreatCaptain can improve your business in several ways. Let's explore which areas you're most interested in.</p>
               </div>
               
               <div className="impact-group">
                   <div className="impact-checkbox">
                       <input
                           type="checkbox"
                           id="sales-integration"
                           checked={enabledImpacts.sales}
                           onChange={(e) => setEnabledImpacts({...enabledImpacts, sales: e.target.checked})}
                       />
                       <label htmlFor="sales-integration">Integrate with Sales</label>
                   </div>
                   <div className="section-content">
                       <div className="section-text">
                           <p>By integrating with your sales process, ThreatCaptain helps qualify leads faster and close deals more effectively.</p>
                       </div>
                       <div className="input-field improvement">
                           <label>Close Rate Improvement (%)</label>
                           <input
                               type="number"
                               name="closeRateImprovement"
                               value={inputs.closeRateImprovement}
                               onChange={handleChange}
                               disabled={!enabledImpacts.sales}
                           />
                       </div>
                   </div>
               </div>

               <div className="impact-group">
                   <div className="impact-checkbox">
                       <input
                           type="checkbox"
                           id="service-enrichment"
                           checked={enabledImpacts.service}
                           onChange={(e) => setEnabledImpacts({...enabledImpacts, service: e.target.checked})}
                       />
                       <label htmlFor="service-enrichment">Enrich Service Offering</label>
                   </div>
                   <div className="section-content">
                       <div className="section-text">
                           <p>Enhance your service value proposition with ThreatCaptain's capabilities, enabling premium pricing and larger deal sizes.</p>
                       </div>
                       <div className="input-field improvement">
                           <label>Deal Size Improvement (%)</label>
                           <input
                               type="number"
                               name="dealSizeImprovement"
                               value={inputs.dealSizeImprovement}
                               onChange={handleChange}
                               disabled={!enabledImpacts.service}
                           />
                       </div>
                   </div>
               </div>

               <div className="impact-group">
                   <div className="impact-checkbox">
                       <input
                           type="checkbox"
                           id="qbr-integration"
                           checked={enabledImpacts.qbr}
                           onChange={(e) => setEnabledImpacts({...enabledImpacts, qbr: e.target.checked})}
                       />
                       <label htmlFor="qbr-integration">Integrate with QBR</label>
                   </div>
                   <div className="section-content">
                       <div className="section-text">
                           <p>Strengthen customer relationships and reduce churn by incorporating ThreatCaptain insights into your quarterly business reviews.</p>
                       </div>
                       <div className="input-field improvement">
                           <label>Churn Rate Reduction (%)</label>
                           <input
                               type="number"
                               name="churnRateReduction"
                               value={inputs.churnRateReduction}
                               onChange={handleChange}
                               disabled={!enabledImpacts.qbr}
                           />
                       </div>
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