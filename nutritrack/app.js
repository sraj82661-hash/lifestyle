// Tab Switching System
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// BMR / TDEE Calorie Calculator
document.getElementById('healthForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const age = parseFloat(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const goal = document.getElementById('goal').value;

    // BMR Formula (Mifflin-St Jeor)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'male') ? 5 : -161;

    let tdee = bmr * activity;

    if (goal === 'lose') tdee -= 500;
    if (goal === 'gain') tdee += 500;

    const targetCal = Math.round(tdee);
    document.getElementById('calorieTargetText').innerText = `Target: ${targetCal} kcal/day`;

    initCalorieChart(targetCal);
    switchTab('dashboard');
});

// Water Tracker Logic
const waterContainer = document.getElementById('waterTracker');
for (let i = 0; i < 8; i++) {
    const glass = document.createElement('i');
    glass.className = 'fa-solid fa-glass-water water-glass';
    glass.onclick = () => glass.classList.toggle('active');
    waterContainer.appendChild(glass);
}

// Chart.js - Calorie Ring
let calorieChartInstance = null;
function initCalorieChart(target = 2000) {
    const ctx = document.getElementById('calorieChart').getContext('2d');
    if (calorieChartInstance) calorieChartInstance.destroy();

    calorieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Consumed', 'Remaining'],
            datasets: [{
                data: [1200, Math.max(0, target - 1200)],
                backgroundColor: ['#10b981', '#334155']
            }]
        },
        options: { plugins: { legend: { display: false } } }
    });
}

// Chart.js - Weight Log
const weightCtx = document.getElementById('weightChart').getContext('2d');
new Chart(weightCtx, {
    type: 'line',
    data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Weight (kg)',
            data: [75, 74.2, 73.8, 73.0],
            borderColor: '#10b981',
            tension: 0.3
        }]
    }
});

// Mock Recipe Data Loader
const recipes = [
    { title: 'Oatmeal & Berries', kcal: '320 kcal', icon: 'fa-bowl-rice' },
    { title: 'Grilled Chicken Salad', kcal: '450 kcal', icon: 'fa-plate-wheat' },
    { title: 'Avocado Whole Wheat Toast', kcal: '290 kcal', icon: 'fa-bread-slice' },
    { title: 'Protein Smoothie Bowl', kcal: '380 kcal', icon: 'fa-blender' }
];

const recipeGrid = document.getElementById('recipeGrid');
recipes.forEach(r => {
    recipeGrid.innerHTML += `
        <div class="card">
            <i class="fa-solid ${r.icon}" style="font-size: 2rem; color: var(--primary-color);"></i>
            <h4 style="margin-top: 1rem;">${r.title}</h4>
            <p style="color: var(--text-muted);">${r.kcal}</p>
        </div>
    `;
});

// Admin Panel Mock Data
const users = [
    { id: 1, name: 'satyender hooda ', goal: 'Weight Loss', target: 1800, status: 'Active' },
    { id: 2, name: 'Aashish jabaaz', goal: 'Maintain Weight', target: 2100, status: 'Active' }
];

const adminList = document.getElementById('adminUserList');
users.forEach(u => {
    adminList.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.goal}</td>
            <td>${u.target}</td>
            <td><span style="color: var(--primary-color);">${u.status}</span></td>
        </tr>
    `;
});

// Initial Chart Run
initCalorieChart();