import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import "../../styles/profile/ProfileStats.css";

const FinancialTab = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('monthly'); // Toggle state

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const monthlyData = data?.monthlyFinance || [];
  const stationData = data?.stationRevenue || [];

  if (!isMounted) return <div className="stats-loading">Loading financial analytics...</div>;

  return (
    <div className="full-page-content animate-fadeIn">
      
      {/* Sub-Navigation Buttons */}
      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setActiveSubTab('monthly')}
          className={`btn-tab ${activeSubTab === 'monthly' ? 'active' : ''}`}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          Monthly Overview
        </button>
        <button 
          onClick={() => setActiveSubTab('station')}
          className={`btn-tab ${activeSubTab === 'station' ? 'active' : ''}`}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          Station Performance
        </button>
      </div>

      <div className="stats-grid full-height">
        {activeSubTab === 'monthly' && (
          <div className="chart-card full-size">
            <h3>Revenue vs. Wholesale Cost</h3>
            <div style={{ width: '100%', flex: 1 }}>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dcdcdc" />
                    <XAxis 
                      dataKey="month_label" 
                      tick={{fill: '#555', fontSize: 12}} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      tick={{fill: '#555', fontSize: 12}} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)'}} 
                    />
                    <Legend verticalAlign="top" align="right" iconType="circle" />
                    {/* Sage Green for Revenue, Gold for Cost */}
                    <Bar dataKey="revenue" fill="#333333" name="Revenue (€)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cost" fill="#FFD600" name="Wholesale Cost (€)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 italic">
                  No monthly financial data found
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'station' && (
          <div className="chart-card full-size">
            <h3>Revenue by Charging Station</h3>
            <div style={{ width: '100%', flex: 1 }}>
              {stationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart layout="vertical" data={stationData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#dcdcdc" />
                    <XAxis 
                      type="number" 
                      tick={{fill: '#555', fontSize: 12}} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(value) => `€${value}`} // Formats values as currency
                    />
                    <YAxis 
                      dataKey="station_name" 
                      type="category" 
                      width={120} 
                      tick={{fill: '#2c3e50', fontSize: 11, fontWeight: '600'}} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                    {/* Sage Green for Station Bars */}
                    <Bar dataKey="total_revenue" fill="#333333" name="Gross Revenue (€)" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 italic">
                  No station revenue data found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialTab;