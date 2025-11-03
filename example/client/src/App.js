import React, { useState, useEffect } from 'react';
import './App.css';

function App(){
	const [chargers, setChargers] = useState([]);
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		fetchChargers();
	}, []);

	const fetchChargers = async () => {
		try {
			setLoading(true);
			const response = await fetch('http://localhost:3001/api/chargers');
			const data = await response.json();
			setChargers(data.chargers || []);
		} catch (error) {
			console.error('Error fetching chargers:', error);
		} finally {
			setLoading(false);
		}
	};
	if (loading) {
		return (
			<div className="App">
			<div className="loading">
			<h2>Loading chargers...</h2>
			<p>Please wait while we get the data</p>
			</div>
			</div>
		);
	}


	return (
		<div className="App">
		<header className="App-header">
		<h1>🔌 EV Charging Stations</h1>
		<p>Simple demo showing chargers from database</p>
		</header>

		<main className="App-main">
		<div className="controls">
		<button onClick={fetchChargers} className="refresh-btn">
		🔄 Refresh List
		</button>
		<p>Total chargers: {chargers.length}</p>
		</div>

		<div className="chargers-list">
		{chargers.length === 0 ? (
			<div className="no-chargers">
			<h3>No chargers found</h3>
			<p>Make sure you have data in your database</p>
			</div>
		) : (
			chargers.map(charger => (
				<div key={charger.charger_id} className="charger-card">
				<h3>Charger #{charger.charger_id}</h3>
				<div className="charger-details">
				<p><strong>📍 Location:</strong> {charger.address}</p>
				<p><strong>⚡ Power:</strong> {charger.power} kW</p>
				<p><strong>🔌 Connector:</strong> {charger.connector_type}</p>
				<p><strong>Status:</strong> 
				<span className={`status ${charger.charger_status}`}>
				{charger.charger_status}
				</span>
				</p>
				</div>
				</div>
			))
		)}
		</div>
		</main>
		</div>
	);
}

export default App;
