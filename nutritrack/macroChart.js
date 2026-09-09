/**
 * macroChart.js - Renders Protein, Carbs, and Fats Breakdown
 */
let macroChartInstance = null;

function renderMacroChart(targetCalories = 2000) {
    const canvas = document.getElementById('macroChart');
    if (!canvas) return;

    // Calculate Macro Grams based on 30P / 40C / 30F split
    const proteinGrams = Math.round((targetCalories * 0.30) / 4);
    const carbGrams = Math.round((targetCalories * 0.40) / 4);
    const fatGrams = Math.round((targetCalories * 0.30) / 9);

    const ctx = canvas.getContext('2d');
    if (macroChartInstance) macroChartInstance.destroy();

    macroChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Protein (g)', 'Carbs (g)', 'Fats (g)'],
            datasets: [{
                data: [proteinGrams, carbGrams, fatGrams],
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8fafc' : '#0f172a' }
                }
            },
            cutout: '65%'
        }
    });
}