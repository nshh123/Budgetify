import React, { useState } from 'react';

const formatCurrency = (amount, symbol) => {
  return parseFloat(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }) + ' ' + symbol;
};

const DonutChart = ({ expenses = [], categories = {}, currencySymbol = 'Rwf' }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fallback default category colors if not present in the dynamic categories state
  const defaultColors = {
    Housing: '#3b82f6',
    Food: '#f43f5e',
    Utilities: '#eab308',
    Transport: '#a855f7',
    Entertainment: '#f97316'
  };

  const getCategoryColor = (catName) => {
    if (categories[catName] && categories[catName].color) {
      return categories[catName].color;
    }
    return defaultColors[catName] || '#94a3b8';
  };

  // Aggregate totals
  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + parseFloat(curr.amount || 0);
    return acc;
  }, {});

  const activeCategories = Object.keys(categoryTotals).filter(cat => categoryTotals[cat] > 0);
  const total = activeCategories.reduce((acc, cat) => acc + categoryTotals[cat], 0);

  const radius = 15.91549430918954;
  const circumference = 100;

  let currentOffset = 0;
  
  const chartSegments = activeCategories.map((category) => {
    const value = categoryTotals[category];
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const dasharray = `${percentage} ${circumference - percentage}`;
    const strokeDashoffset = -currentOffset;
    
    currentOffset += percentage;
    const color = getCategoryColor(category);

    return (
      <circle
        key={category}
        cx="21"
        cy="21"
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={dasharray}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, stroke-width 0.3s ease',
          cursor: 'pointer',
          opacity: selectedCategory ? (selectedCategory === category ? 1 : 0.3) : 0.9,
          strokeWidth: selectedCategory === category ? '6.5' : '5'
        }}
        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
      />
    );
  });

  return (
    <div className="chart-box">
      <div className="chart-svg-container animate-fade-in">
        <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
          {/* Base Ring / Placeholder if empty */}
          <circle
            cx="21"
            cy="21"
            r={radius}
            fill="transparent"
            stroke="var(--border-color)"
            strokeWidth="5"
            style={{ opacity: total > 0 ? 0.3 : 1 }}
          />

          {total > 0 && chartSegments}

          {/* Center text details */}
          {selectedCategory && categoryTotals[selectedCategory] > 0 ? (
            <text x="21" y="21" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="var(--text-primary)" style={{ pointerEvents: 'none' }}>
              <tspan x="21" dy="-3" fontWeight="700" fill="var(--text-secondary)" fontSize="2">{selectedCategory.toUpperCase()}</tspan>
              <tspan x="21" dy="3.5" fontSize="3" fontWeight="800" fill={getCategoryColor(selectedCategory)}>
                {formatCurrency(categoryTotals[selectedCategory], currencySymbol)}
              </tspan>
              <tspan x="21" dy="3.5" fontSize="2" fontWeight="600" fill="var(--text-muted)">
                {((categoryTotals[selectedCategory] / total) * 100).toFixed(1)}%
              </tspan>
            </text>
          ) : (
            <text x="21" y="21" textAnchor="middle" dominantBaseline="middle" fontSize="3" fill="var(--text-secondary)" style={{ pointerEvents: 'none' }}>
              <tspan x="21" dy="-2" fontSize="2" fontWeight="700" fill="var(--text-muted)">TOTAL SPENT</tspan>
              <tspan x="21" dy="4.5" fontSize="3.2" fontWeight="800" fill="var(--text-primary)">
                {formatCurrency(total, currencySymbol)}
              </tspan>
            </text>
          )}
        </svg>
      </div>

      <div className="chart-legend" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
        {activeCategories.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            No expenses recorded for this month
          </div>
        ) : (
          activeCategories.map((category) => (
            <div
              key={category}
              className="legend-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                opacity: selectedCategory ? (selectedCategory === category ? 1 : 0.4) : 1,
                transition: 'opacity 0.2s, transform 0.2s',
                transform: selectedCategory === category ? 'scale(1.05)' : 'none'
              }}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: getCategoryColor(category)
                }}
              />
              <span style={{ color: 'var(--text-primary)' }}>{category}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '4px' }}>
                {((categoryTotals[category] / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonutChart;
