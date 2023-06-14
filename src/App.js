import React, { useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLegend } from 'victory';
import './RiskMatrix.css'; // Import the CSS file

const RiskMatrix = () => {
  const [selectedRisk, setSelectedRisk] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [risks, setRisks] = useState([
    { id: 1, description: 'Risk 1', level: 'High' },
    { id: 2, description: 'Risk 2', level: 'Medium' },
    { id: 3, description: 'Risk 3', level: 'Low' },
  ]);

  const handleFilterChange = (event) => {
    setSelectedRisk(event.target.value);
  };

  const handleRiskChange = (riskId, event) => {
    const updatedRisks = risks.map((risk) =>
      risk.id === riskId ? { ...risk, level: event.target.value } : risk
    );
    setRisks(updatedRisks);
  };

  const handleRiskDescriptionChange = (riskId, event) => {
    const updatedRisks = risks.map((risk) =>
      risk.id === riskId ? { ...risk, description: event.target.value } : risk
    );
    setRisks(updatedRisks);
  };

  const addRisk = () => {
    const newRiskId = risks.length > 0 ? risks[risks.length - 1].id + 1 : 1;
    const newRisk = { id: newRiskId, description: '', level: 'Low' };
    setRisks([...risks, newRisk]);
  };

  const removeRisk = (riskId) => {
    const updatedRisks = risks.filter((risk) => risk.id !== riskId);
    setRisks(updatedRisks);
  };

  const riskLevels = [
    { level: 'High', color: 'red' },
    { level: 'Medium', color: 'yellow' },
    { level: 'Low', color: 'green' },
  ];

  const filteredRisks = selectedRisk ? risks.filter((risk) => risk.level === selectedRisk) : risks;

  const sortedRisks = [...filteredRisks].sort((a, b) => {
    const levelA = riskLevels.findIndex((level) => level.level === a.level);
    const levelB = riskLevels.findIndex((level) => level.level === b.level);
    return levelA - levelB;
  });

  const riskCounts = riskLevels.map((riskLevel) =>
    sortedRisks.filter((risk) => risk.level === riskLevel.level).length
  );

  const maxRiskLevelIndex = riskCounts.indexOf(Math.max(...riskCounts));
  const greatestRisk = riskLevels[maxRiskLevelIndex].level;

  const legendData = riskLevels.map((riskLevel) => ({ name: riskLevel.level, symbol: { fill: riskLevel.color } }));

  return (
    <div className="risk-matrix-container">
      <h1>Risk Matrix</h1>

      <div className="view-toggle">
        <button onClick={() => setShowGraph(!showGraph)}>{showGraph ? 'Switch to Matrix' : 'Switch to Graph'}</button>
      </div>

      {showGraph ? (
        <div className="graph">
          <label htmlFor="risk-filter">Filter by Risk Level:</label>
          <select id="risk-filter" value={selectedRisk} onChange={handleFilterChange}>
            <option value="">All</option>
            {riskLevels.map((riskLevel, index) => (
              <option key={index} value={riskLevel.level}>
                {riskLevel.level}
              </option>
            ))}
          </select>

          <div className="greatest-risk">Greatest Risk: {greatestRisk}</div>

          <VictoryChart domainPadding={20}>
            <VictoryLegend x={60} y={20} orientation="horizontal" gutter={10} data={legendData} />

            <VictoryAxis tickValues={['Risk']} />
            <VictoryAxis dependentAxis tickFormat={(x) => Math.round(x)} />

            <VictoryBar
              data={riskCounts.map((count, index) => ({ risk: 'Risk', level: riskLevels[index].level, count }))}
              x="level"
              y="count"
              style={{
                data: {
                  fill: ({ datum }) =>
                    datum.level === 'High' ? 'red' : datum.level === 'Medium' ? 'yellow' : 'green',
                },
              }}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onClick: (_, { datum }) => {
                      handleRiskChange(datum.level, { target: { value: datum.level } });
                    },
                  },
                },
              ]}
            />
          </VictoryChart>
        </div>
      ) : (
        <div className="risk-matrix">
          <table>
            <thead>
              <tr>
                <th>Risk</th>
                {riskLevels.map((riskLevel) => (
                  <th key={riskLevel.level} style={{ color: riskLevel.color }}>
                    {riskLevel.level}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRisks.map((risk) => (
                <tr key={risk.id}>
                  <td>
                    <input
                      type="text"
                      value={risk.description}
                      onChange={(event) => handleRiskDescriptionChange(risk.id, event)}
                    />
                  </td>
                  {riskLevels.map((riskLevel) => (
                    <td key={riskLevel.level} style={{ backgroundColor: riskLevel.color }}>
                      <input
                        type="radio"
                        name={`risk-${risk.id}`}
                        value={riskLevel.level}
                        checked={risk.level === riskLevel.level}
                        onChange={(event) => handleRiskChange(risk.id, event)}
                      />
                    </td>
                  ))}
                  <td>
                    <button onClick={() => removeRisk(risk.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addRisk}>Add Risk</button>
        </div>
      )}
    </div>
  );
};

export default RiskMatrix;
