import React, { useState, useEffect } from 'react';
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

   useEffect(() => {
       const suggestedPrice = inputs.annualRevenue >= 3000000 ? 1500 : 500;
       setInputs(prev => ({
           ...prev,
           threatCaptainCost: suggestedPrice
       }));
   }, [inputs.annualRevenue]);

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
       const annualRevenueWithout = totalCustomersWithout * (inputs.annualRevenue / inputs.currentCustomers);

       const improvedCloseRate = inputs.closeRate + (enabledImpacts.sales ? inputs.closeRateImprovement : 0);
       const improvedDealSize = (inputs.annualRevenue / inputs.currentCustomers) * (1 + (enabledImpacts.service ? inputs.dealSizeImprovement : 0) / 100);
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
               dealSize: inputs.annualRevenue / inputs.currentCustomers,
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
                                       const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                       handleChange({target: {name: 'annualRevenue', value: rawValue}});
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
                               type="text"
                               name="averageDealSize"
                               value={inputs.currentCustomers ? 
                                   `$${(inputs.annualRevenue / inputs.currentCustomers).toLocaleString(undefined, {
                                       minimumFractionDigits: 2,
                                       maximumFractionDigits: 2
                                   })}` 
                                   : '$0.00'}
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
               <div className="pricing-options">
                   <h2>ThreatCaptain Investment</h2>
                   <div className="radio-group">
                       <div className="radio-option">
                           <input
                               type="radio"
                               id="enterprise"
                               name="pricingTier"
                               checked={inputs.threatCaptainCost === 1500}
                               onChange={() => handleChange({target: {name: 'threatCaptainCost', value: 1500}})}
                           />
                           <label htmlFor="enterprise">Annual Revenue over $3 Million - Founders Pricing $1,500.00/month</label>
                       </div>
                       <div className="radio-option">
                           <input
                               type="radio"
                               id="growth"
                               name="pricingTier"
                               checked={inputs.threatCaptainCost === 500}
                               onChange={() => handleChange({target: {name: 'threatCaptainCost', value: 500}})}
                           />
                           <label htmlFor="growth">Annual Revenue under $3 Million - Growth Pricing $500.00/month</label>
                       </div>
                   </div>
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
                       <label htmlFor="sales-integration">1. Integrate with Sales</label>
                   </div>
                   <div className="section-content">
                       <div className="section-text">
                           <p>ThreatCaptain's FIA transforms your sales process by turning technical risks into compelling financial insights that drive decision-making.</p>
                           <ul>
                               <li>Highlight the financial consequences of cyber risks to build trust and urgency with prospects.</li>
                               <li>Quantify pain points to create customized, ROI-driven proposals that resonate with executives.</li>
                               <li>Shorten sales cycles by presenting clear, business-relevant outcomes tied to cybersecurity investments.</li>
                           </ul>
                           <em>With ThreatCaptain's FIA, you'll close more deals by speaking the language of business leaders.</em>
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
                       <label htmlFor="service-enrichment">2. Enrich Service Offering</label>
                   </div>
                   <div className="section-content">
                       <div className="section-text">
                           <p>ThreatCaptain's FIA is the cornerstone of a premium service portfolio, delivering both compliance assurance and financially prioritized roadmaps.</p>
                           <ul>
                               <li>Provide clients with financial insights that meet compliance mandates like GDPR, HIPAA, and PCI DSS.</li>
                               <li>Build strategic roadmaps that focus resources on addressing the highest-impact risks.</li>
                               <li>Elevate your MSP's role from service provider to trusted advisor with measurable business outcomes.</li>
                           </ul>
                           <em>With ThreatCaptain's FIA, you can offer unmatched value by tying cybersecurity to business strategy.</em>
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
                       <label htmlFor="qbr-integration">3. Integrate with QBR</label>
                   </div>
                   <div className="section-content">
                       <div className="section-text">
                           <p>ThreatCaptain's FIA elevates your QBRs by proving the value of your clients' cybersecurity investments.</p>
                           <ul>
                               <li>Justify spend with clear metrics showing reduced financial risks and improved ROI.</li>
                               <li>Showcase how proactive measures align with business goals and mitigate high-cost threats.</li>
                               <li>Uncover upsell opportunities by presenting updated financial scenarios and risk insights.</li>
                           </ul>
                           <em>ThreatCaptain's FIA keeps clients engaged, confident, and committed to your MSP's services.</em>
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