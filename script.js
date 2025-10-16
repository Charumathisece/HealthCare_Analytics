// Simple sample dataset: daily aggregated metrics for a small date range.
// In a real project you would fetch CSV/JSON from a server.
const sampleData = [
  // date, admissions, avgStay (days), readmitRate (%)
  { date: '2025-09-01', admissions: 32, avgStay: 3.2, readmitRate: 4.1 },
  { date: '2025-09-02', admissions: 28, avgStay: 2.8, readmitRate: 3.6 },
  { date: '2025-09-03', admissions: 40, avgStay: 3.5, readmitRate: 5.2 },
  { date: '2025-09-04', admissions: 35, avgStay: 3.0, readmitRate: 4.8 },
  { date: '2025-09-05', admissions: 30, avgStay: 2.9, readmitRate: 3.9 },
  { date: '2025-09-06', admissions: 22, avgStay: 2.5, readmitRate: 3.1 },
  { date: '2025-09-07', admissions: 25, avgStay: 2.7, readmitRate: 3.5 },
  { date: '2025-09-08', admissions: 45, avgStay: 3.9, readmitRate: 5.5 },
  { date: '2025-09-09', admissions: 50, avgStay: 4.1, readmitRate: 6.0 },
  { date: '2025-09-10', admissions: 38, avgStay: 3.4, readmitRate: 4.7 }
];

// DOM refs
const fromEl = document.getElementById('from');
const toEl = document.getElementById('to');
const metricEl = document.getElementById('metric');
const applyBtn = document.getElementById('apply');
const cardsEl = document.getElementById('cards');

let chart1 = null;
let chart2 = null;

// Utility: parse date strings
function toDate(s){ return new Date(s + 'T00:00:00'); }

// Initialize date inputs to data bounds
function initDates(){
  const dates = sampleData.map(d=>d.date).sort();
  fromEl.value = dates[0];
  toEl.value = dates[dates.length-1];
}
initDates();

// Filter data by date range
function filterData(from, to){
  const f = toDate(from), t = toDate(to);
  return sampleData.filter(d=>{
    const cur = toDate(d.date);
    return cur >= f && cur <= t;
  }).sort((a,b)=>toDate(a.date)-toDate(b.date));
}

// Compute aggregates for summary cards
function computeSummary(data){
  const totalAdmissions = data.reduce((s,d)=>s+d.admissions,0);
  const avgStay = data.length ? (data.reduce((s,d)=>s+d.avgStay,0)/data.length).toFixed(2) : 0;
  const avgReadmit = data.length ? (data.reduce((s,d)=>s+d.readmitRate,0)/data.length).toFixed(2) : 0;
  const days = data.length;
  return { totalAdmissions, avgStay, avgReadmit, days };
}

// Render summary cards
function renderCards(summary){
  cardsEl.innerHTML = `
    <div class="card">
      <div class="label">Total Admissions</div>
      <div class="value">${summary.totalAdmissions}</div>
    </div>
    <div class="card">
      <div class="label">Average Stay (days)</div>
      <div class="value">${summary.avgStay}</div>
    </div>
    <div class="card">
      <div class="label">Avg Readmission Rate (%)</div>
      <div class="value">${summary.avgReadmit}</div>
    </div>
    <div class="card">
      <div class="label">Days in Range</div>
      <div class="value">${summary.days}</div>
    </div>
  `;
}

// Create or update Chart.js charts
function renderCharts(data, metricKey){
  const labels = data.map(d=>d.date);
  const admissionsData = data.map(d=>d.admissions);
  const metricData = data.map(d=>d[metricKey]);

  // Chart 1: line (Admissions)
  const ctx1 = document.getElementById('chart1').getContext('2d');
  if(chart1) chart1.destroy();
  chart1 = new Chart(ctx1, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Admissions',
        data: admissionsData,
        fill:false,
        tension:0.2,
        pointRadius:4
      }]
    },
    options: {
      responsive:true,
      plugins:{legend:{display:false}},
      scales:{ x:{display:true}, y:{beginAtZero:true} }
    }
  });

  // Chart 2: bar (Selected metric)
  const ctx2 = document.getElementById('chart2').getContext('2d');
  if(chart2) chart2.destroy();
  const metricLabel = metricKey === 'avgStay' ? 'Average Stay (days)' :
                      metricKey === 'readmitRate' ? 'Readmission Rate (%)' : 'Admissions';
  document.getElementById('chart2-title').textContent = metricLabel + ' — Breakdown';

  chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: metricLabel,
        data: metricData,
        borderRadius:4
      }]
    },
    options: {
      responsive:true,
      plugins:{legend:{display:false}},
      scales:{ x:{display:true}, y:{beginAtZero:true} }
    }
  });
}

// Core update function
function updateDashboard(){
  const from = fromEl.value;
  const to = toEl.value;
  const metric = metricEl.value;
  if(!from || !to) { alert('Please pick both from and to dates'); return; }
  const filtered = filterData(from,to);
  const summary = computeSummary(filtered);
  renderCards(summary);
  renderCharts(filtered, metric === 'admissions' ? 'admissions' : metric);
}

// Initial render
updateDashboard();

// Wire apply button
applyBtn.addEventListener('click', updateDashboard);

// Allow pressing Enter on selects (optional)
[fromEl,toEl,metricEl].forEach(el => el.addEventListener('keypress', e=>{
  if(e.key === 'Enter') updateDashboard();
}));
