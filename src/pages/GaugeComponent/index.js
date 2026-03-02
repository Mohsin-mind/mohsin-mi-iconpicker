import React from 'react';
import GaugeComponent from 'react-gauge-component';

const GaugeComponentPage = () => {
  const claimTypical = 33621;
  const bestPractice = 25023;
  const claimMax = 46600;

  // Normalize the value for the gauge (between 0 and the range of claimMax - bestPractice)
  const range = claimMax - bestPractice;
  const gaugeValue = ((claimTypical - bestPractice) / range) * 100; // Scale to 0-100 for the gauge

  return (
    <div className="flex w-full justify-center items-center h-[400px] relative text-center"
    >
      <GaugeComponent
        id="gauge-component4"
        type="radial"
        arc={{
          gradient: true,
          width: 0.15,
          padding: 0,
          cornerRadius: 10,
          subArcs: [
            { limit: 30, color: '#43b153', showTick: true }, // Green, 0% to 30%
            { limit: 50, color: '#797b3d', showTick: true }, // Dark Green, 30% to 50%
            { limit: 70, color: '#ac793e', showTick: true }, // Dark Orange, 50% to 70%
            { limit: 100, color: '#e45e36', showTick: false }, // Orange, 70% to 100%
          ],
        }}
        value={gaugeValue}
        minValue={0}
        maxValue={100} // Range scaled to 0-100
        pointer={{ type: "arrow", elastic: true }}
        labels={{
          valueLabel: {
            hide: true, // Hide the default value label since we're using a custom div
          },
        }}
      />

      {/* Custom Labels */}
      {/* Center Label with 3 Lines */}
      <div
        style={{
          position: "absolute",
          top: "215px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          lineHeight: "1.2",
        }}
      >
        <div style={{ fontSize: "14px" }}>
          Claim Typical
        </div>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          ${claimTypical.toLocaleString()}
        </div>
        <div style={{ fontSize: "12px", fontWeight: "bold" }}>
          TOTAL COST
        </div>
      </div>

    </div>
  );
};

export default GaugeComponentPage;