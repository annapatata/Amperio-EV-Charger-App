import React, { useState, useEffect } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import "../../styles/profile/ProfileStats.css";

const EnergyTab = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('demand');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const heatmapData = data?.energyHeatmap || [];
  const scatterData = data?.powerEfficiency || [];
  
  // High precision helper for tooltips
  const formatEnergy = (val) => (typeof val === 'number' ? val.toFixed(3) : val);

  const powerColors = {
    ac: '#4CAF50',
    dcFast: '#FFC107',
    dcUltra: '#F44336'
  };

  const getPowerColor = (power) => {
    if (power <= 22) return powerColors.ac;
    if (power < 120) return powerColors.dcFast;
    return powerColors.dcUltra;
  };

  if (!isMounted) return <div className="stats-loading">Loading charts...</div>;

  return (
    <div className="full-page-content animate-fadeIn">
      {/* Sub-Navigation */}
      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setActiveSubTab('demand')}
          className={`btn-tab ${activeSubTab === 'demand' ? 'active' : ''}`}
        >
          Demand Heatmap
        </button>
        <button 
          onClick={() => setActiveSubTab('efficiency')}
          className={`btn-tab ${activeSubTab === 'efficiency' ? 'active' : ''}`}
        >
          Hardware Efficiency
        </button>
      </div>

      <div className="stats-grid full-height">
        {/* TAB 1: DEMAND HEATMAP */}
        {activeSubTab === 'demand' && (
          <div className="chart-card full-size">
            <h3>Hourly Energy Demand (Grid Pressure)</h3>
            <div style={{ width: '100%', flex: 1 }}>
              {heatmapData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dcdcdc" />
                    <XAxis 
                      type="number" dataKey="hour" name="Hour" domain={[0, 23]} 
                      tickFormatter={(tick) => `${tick}:00`} 
                      tick={{fill: '#555', fontSize: 12}} axisLine={false} tickLine={false}
                    />
                    <YAxis 
                      type="category" dataKey="day" name="Day" allowDuplicatedCategory={false}
                      tick={{fill: '#2c3e50', fontSize: 11, fontWeight: '600'}}
                      axisLine={false} tickLine={false} width={80}
                    />
                    <ZAxis type="number" dataKey="average_energy" range={[100, 1000]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                      formatter={(value, name, props) => {
                        const { dataKey } = props;
                        if (dataKey === 'hour') return [`${value}:00`, 'Hour'];
                        if (dataKey === 'average_energy') return [formatEnergy(value), 'Total Energy(kWh)'];
                        if (dataKey === 'day') return [value, 'Day'];
                        return [value, name];
                      }}
                    />
                    {/* LEGEND REMOVED FROM HERE */}
                    <Scatter name="Demand" data={heatmapData}>
                      {heatmapData.map((entry, index) => {
                        let cellColor = '#27e57d'; 
                        if (entry.average_energy > 150) cellColor = '#ed3838'; 
                        else if (entry.average_energy > 100) cellColor = '#FB8C00'; 
                        else if (entry.average_energy > 50) cellColor = '#FFD600'; 
                        return <Cell key={`cell-${index}`} fill={cellColor} />;
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              ) : <div className="no-data">No demand heatmap data available</div>}
            </div>
          </div>
        )}

        {/* TAB 2: HARDWARE EFFICIENCY */}
       {activeSubTab === 'efficiency' && (
  <div className="chart-card full-size">
    <h3>Power Rating vs. Avg Energy Delivery</h3>
    <div style={{ width: '100%', flex: 1 }}>
      {scatterData.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcdcdc" />
            <XAxis 
              type="number" 
              dataKey="charger_power" 
              name="Charger Power" 
              unit="kW"
              ticks={[11, 22, 50, 120, 180]}
              domain={[0, 200]}
              tick={{fill: '#555', fontSize: 12}} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              type="number" 
              dataKey="avg_energy" 
              name="Avg Energy" 
              unit="kWh"
              tick={{fill: '#555', fontSize: 12}} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={formatEnergy}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
              formatter={(value, name, props) => {
                const key = props.dataKey;
                if (key === 'avg_energy') return [value, 'Avg Energy (kWh)'];
                if (key === 'charger_power') return [value, 'Power (kW)'];
                return [formatEnergy(value), name];
              }}
            />
            <Scatter 
              name="Chargers" 
              data={scatterData} 
              fill="#c0bea0" 
              line={{ stroke: '#9a987d', strokeWidth: 2 }} 
            />
          </ScatterChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 italic">
          No hardware efficiency data available
        </div>
      )}
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default EnergyTab;