import React, { useState } from 'react';
import './RiskMatrix.css'; // Import the CSS file

const RiskMatrix = () => {
  const [selectedRisk, setSelectedRisk] = useState('');

  const handleFilterChange = (event) => {
    setSelectedRisk(event.target.value);
  };

  const handleRiskChange = (riskId, event) => {
    // Handle the risk selection here
    console.log(`Risk ${riskId} selected: ${event.target.value}`);
  };

  const riskLevels = [
    { level: 'High', color: 'red' },
    { level: 'Medium', color: 'yellow' },
    { level: 'Low', color: 'green' },
  ];

  const risks = [
    { id: 1, description: 'Risk 1', level: 'High' },
    { id: 2, description: 'Risk 2', level: 'Medium' },
    { id: 3, description: 'Risk 3', level: 'Low' },
    { id: 4, description: 'Risk 4', level: 'High' },
    { id: 5, description: 'Risk 5', level: 'Medium' },
    { id: 6, description: 'Risk 6', level: 'Low' },
  ];

  const filteredRisks = selectedRisk ? risks.filter((risk) => risk.level === selectedRisk) : risks;

  const sortedRisks = [...filteredRisks].sort((a, b) => {
    const levelA = riskLevels.findIndex((level) => level.level === a.level);
    const levelB = riskLevels.findIndex((level) => level.level === b.level);
    return levelA - levelB;
  });

  return (
    <div className="risk-matrix-container">
      <h1>Risk Matrix</h1>

      <label htmlFor="risk-filter">Filter by Risk Level:</label>
      <select id="risk-filter" value={selectedRisk} onChange={handleFilterChange}>
        <option value="">All</option>
        {riskLevels.map((riskLevel, index) => (
          <option key={index} value={riskLevel.level}>
            {riskLevel.level}
          </option>
        ))}
      </select>

      <div className="risk-matrix">
        <div className="risk-matrix-header">
          <div className="risk-matrix-cell">Risk</div>
          {riskLevels.map((riskLevel, index) => (
            <div
              key={index}
              className="risk-matrix-cell risk-matrix-header-cell"
              style={{ backgroundColor: riskLevel.color }}
            >
              {riskLevel.level}
            </div>
          ))}
        </div>

        {sortedRisks.map((risk) => (
          <div key={risk.id} className={`risk-matrix-row`}>
            <div className="risk-matrix-cell">{risk.description}</div>
            {riskLevels.map((riskLevel, index) => (
              <div
                key={index}
                className={`risk-bar ${risk.level === riskLevel.level ? riskLevel.level.toLowerCase() : ''}`}
                style={{ backgroundColor: riskLevel.color }}
              >
                <input
                  type="radio"
                  name={`risk-${risk.id}`}
                  value={riskLevel.level}
                  checked={risk.level === riskLevel.level}
                  onChange={(e) => handleRiskChange(risk.id, e)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskMatrix;
