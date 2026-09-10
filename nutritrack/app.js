/* =====================================================================
   LIFESTYLE — App logic
   Sections: Theme toggle | Mobile nav | Nav scrollspy | Dashboard
   (calories + macros + quick add) | Water tracker | Recipe search/filter
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollSpy();
  initDashboard();
  initWaterTracker();
  initRecipes();
  document.getElementById('footerYear').textContent = new Date().getFullYear();
});

/* =====================================================================
   1. THEME TOGGLE (dark by default, persisted in localStorage)
   ===================================================================== */

function initTheme() {
  const body = document.body;
  const toggle = document.getElementById('themeToggle');
  const STORAGE_KEY = 'lifestyle-theme';

  const saved = localStorage.getItem(STORAGE_KEY);
  const initialTheme = saved === 'light' ? 'light' : 'dark'; // dark is the default
  applyTheme(initialTheme);

  toggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-checked', String(theme === 'dark'));
  }
}

/* =====================================================================
   2. MOBILE NAVIGATION
   ===================================================================== */

function initMobileNav() {
  const burger = document.getElementById('navBurger');
  const nav = document.getElementById('mainNav');

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after a nav link is tapped
  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* =====================================================================
   3. SCROLLSPY — highlight the nav link matching the section in view
   ===================================================================== */

function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        links.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =====================================================================
   4. DASHBOARD — calorie ring, macro bars, quick-add meal widget
   ===================================================================== */

const dashboardState = {
  calorieGoal: 2000,
  // Baseline totals representing everything already tracked today
  baseCalories: 1360,
  baseMacros: { protein: 98, carbs: 154, fats: 39 }, // grams
  activeMeal: 'breakfast',
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  },
};

function initDashboard() {
  initMealTabs();
  initQuickAddForm();
  renderMealLog();
  updateDashboardTotals();
}

function initMealTabs() {
  const tabs = document.querySelectorAll('.meal-tab');
  const activeLabel = document.getElementById('activeMealLabel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      dashboardState.activeMeal = tab.dataset.meal;
      activeLabel.textContent = capitalize(dashboardState.activeMeal);
      renderMealLog();
    });
  });
}

function initQuickAddForm() {
  const form = document.getElementById('quickAddForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('mealName').value.trim();
    const calories = Number(document.getElementById('mealCalories').value) || 0;
    const protein = Number(document.getElementById('mealProtein').value) || 0;
    const carbs = Number(document.getElementById('mealCarbs').value) || 0;
    const fats = Number(document.getElementById('mealFats').value) || 0;

    if (!name || calories <= 0) {
      document.getElementById('mealName').focus();
      return;
    }

    dashboardState.meals[dashboardState.activeMeal].push({
      id: Date.now(),
      name,
      calories,
      protein,
      carbs,
      fats,
    });

    form.reset();
    renderMealLog();
    updateDashboardTotals();
  });
}

function renderMealLog() {
  const log = document.getElementById('mealLog');
  const items = dashboardState.meals[dashboardState.activeMeal];
  const mealLabel = capitalize(dashboardState.activeMeal);

  log.innerHTML = '';

  if (items.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'meal-log-empty';
    empty.id = 'mealLogEmpty';
    empty.textContent = `No meals logged for ${mealLabel} yet — add your first one above.`;
    log.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'meal-log-item';
    li.innerHTML = `
      <span>
        <span class="meal-log-item-name">${escapeHTML(item.name)}</span>
        <span class="meal-log-item-macros"> · ${item.calories} kcal · P ${item.protein}g · C ${item.carbs}g · F ${item.fats}g</span>
      </span>
      <button type="button" class="meal-log-item-remove" aria-label="Remove ${escapeHTML(item.name)}">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    li.querySelector('.meal-log-item-remove').addEventListener('click', () => {
      dashboardState.meals[dashboardState.activeMeal] = dashboardState.meals[dashboardState.activeMeal].filter(
        (m) => m.id !== item.id
      );
      renderMealLog();
      updateDashboardTotals();
    });
    log.appendChild(li);
  });
}

/** Sums calories/macros across every logged meal in every category. */
function getLoggedTotals() {
  const totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  Object.values(dashboardState.meals).forEach((mealArray) => {
    mealArray.forEach((item) => {
      totals.calories += item.calories;
      totals.protein += item.protein;
      totals.carbs += item.carbs;
      totals.fats += item.fats;
    });
  });
  return totals;
}

function updateDashboardTotals() {
  const logged = getLoggedTotals();

  const consumed = dashboardState.baseCalories + logged.calories;
  const remaining = Math.max(dashboardState.calorieGoal - consumed, 0);
  const ringValue = Math.min(consumed / dashboardState.calorieGoal, 1);

  document.getElementById('caloriesConsumed').textContent = formatNumber(consumed);
  document.getElementById('caloriesRemaining').textContent = formatNumber(remaining);
  document.getElementById('legendConsumed').textContent = formatNumber(consumed);
  document.getElementById('legendRemaining').textContent = formatNumber(remaining);
  document.getElementById('calorieRingProgress').style.setProperty('--ring-value', ringValue.toFixed(3));

  // Macro grams
  const protein = dashboardState.baseMacros.protein + logged.protein;
  const carbs = dashboardState.baseMacros.carbs + logged.carbs;
  const fats = dashboardState.baseMacros.fats + logged.fats;

  // Convert grams to calories (protein/carbs = 4 kcal/g, fats = 9 kcal/g) to get an accurate split
  const proteinKcal = protein * 4;
  const carbsKcal = carbs * 4;
  const fatsKcal = fats * 9;
  const macroKcalTotal = proteinKcal + carbsKcal + fatsKcal || 1; // avoid divide-by-zero

  const proteinPct = Math.round((proteinKcal / macroKcalTotal) * 100);
  const carbsPct = Math.round((carbsKcal / macroKcalTotal) * 100);
  const fatsPct = Math.max(100 - proteinPct - carbsPct, 0); // remainder keeps the total at 100%

  document.getElementById('proteinGrams').textContent = protein;
  document.getElementById('carbsGrams').textContent = carbs;
  document.getElementById('fatsGrams').textContent = fats;

  document.getElementById('proteinPct').textContent = `${proteinPct}%`;
  document.getElementById('carbsPct').textContent = `${carbsPct}%`;
  document.getElementById('fatsPct').textContent = `${fatsPct}%`;

  document.getElementById('proteinBar').style.width = `${proteinPct}%`;
  document.getElementById('carbsBar').style.width = `${carbsPct}%`;
  document.getElementById('fatsBar').style.width = `${fatsPct}%`;
}

/* =====================================================================
   5. WATER INTAKE TRACKER
   ===================================================================== */

const waterState = {
  goalGlasses: 8,
  goalLitres: 2.5,
  count: 0,
};

function initWaterTracker() {
  const wrap = document.getElementById('waterGlasses');
  wrap.innerHTML = '';

  for (let i = 0; i < waterState.goalGlasses; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'water-glass';
    btn.setAttribute('aria-label', `Glass ${i + 1} of ${waterState.goalGlasses}`);
    btn.innerHTML = '<i class="fa-solid fa-glass-water"></i>';
    btn.addEventListener('click', () => handleGlassClick(i));
    wrap.appendChild(btn);
  }

  document.getElementById('waterResetBtn').addEventListener('click', () => {
    waterState.count = 0;
    renderWaterTracker();
  });

  renderWaterTracker();
}

function handleGlassClick(index) {
  const target = index + 1;
  // Tapping the last filled glass empties it; tapping any other glass fills up to it
  waterState.count = waterState.count === target ? target - 1 : target;
  renderWaterTracker();
}

function renderWaterTracker() {
  const glasses = document.querySelectorAll('.water-glass');
  glasses.forEach((glass, i) => {
    glass.classList.toggle('is-filled', i < waterState.count);
  });

  const fillPct = Math.min((waterState.count / waterState.goalGlasses) * 100, 100);
  document.getElementById('waterFill').style.height = `${fillPct}%`;

  const litres = (waterState.count / waterState.goalGlasses) * waterState.goalLitres;
  document.getElementById('waterAmountLitres').textContent = `${litres.toFixed(1)}L`;
  document.getElementById('waterAmountGlasses').textContent = `${waterState.count} of ${waterState.goalGlasses} glasses`;
}

/* =====================================================================
   6. RECIPE SEARCH & SMART FILTER
   ===================================================================== */

const RECIPES = [
  { name: 'Grilled Lemon Chicken Bowl', icon: 'fa-drumstick-bite', time: 20, calories: 420, tags: ['high-protein', 'low-carb', 'quick-prep'] },
  { name: 'Avocado Chickpea Salad', icon: 'fa-seedling', time: 10, calories: 360, tags: ['vegan', 'quick-prep'] },
  { name: 'Baked Salmon & Greens', icon: 'fa-fish', time: 25, calories: 480, tags: ['high-protein', 'keto', 'low-carb'] },
  { name: 'Tofu Veggie Stir-Fry', icon: 'fa-pepper-hot', time: 18, calories: 390, tags: ['vegan', 'high-protein', 'quick-prep'] },
  { name: 'Zucchini Noodle Alfredo', icon: 'fa-bowl-food', time: 22, calories: 340, tags: ['low-carb', 'keto'] },
  { name: 'Quinoa Power Bowl', icon: 'fa-wheat-awn', time: 15, calories: 410, tags: ['vegan', 'high-protein'] },
  { name: 'Egg White Veggie Scramble', icon: 'fa-egg', time: 8, calories: 260, tags: ['high-protein', 'low-carb', 'quick-prep'] },
  { name: 'Keto Cauliflower Fried Rice', icon: 'fa-carrot', time: 20, calories: 310, tags: ['keto', 'low-carb', 'vegan'] },
  { name: 'Greek Yogurt Berry Parfait', icon: 'fa-ice-cream', time: 5, calories: 240, tags: ['high-protein', 'quick-prep'] },
  { name: 'Lentil & Spinach Curry', icon: 'fa-mortar-pestle', time: 30, calories: 380, tags: ['vegan', 'high-protein'] },
  { name: 'Steak & Asparagus Plate', icon: 'fa-utensils', time: 24, calories: 510, tags: ['high-protein', 'keto', 'low-carb'] },
  { name: 'Almond Butter Protein Smoothie', icon: 'fa-blender', time: 5, calories: 330, tags: ['high-protein', 'quick-prep'] },
];

const TAG_LABELS = {
  'high-protein': 'High Protein',
  'low-carb': 'Low Carb',
  vegan: 'Vegan',
  keto: 'Keto',
  'quick-prep': 'Quick Prep',
};

const recipeUIState = { filter: 'all', search: '' };

function initRecipes() {
  const filterButtons = document.querySelectorAll('.filter-tag');
  const searchInput = document.getElementById('recipeSearch');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      recipeUIState.filter = btn.dataset.filter;
      renderRecipes();
    });
  });

  searchInput.addEventListener('input', (e) => {
    recipeUIState.search = e.target.value.trim().toLowerCase();
    renderRecipes();
  });

  renderRecipes();
}

function renderRecipes() {
  const grid = document.getElementById('recipeGrid');
  const emptyState = document.getElementById('recipeEmpty');

  const filtered = RECIPES.filter((recipe) => {
    const matchesFilter = recipeUIState.filter === 'all' || recipe.tags.includes(recipeUIState.filter);
    const matchesSearch =
      recipeUIState.search === '' ||
      recipe.name.toLowerCase().includes(recipeUIState.search) ||
      recipe.tags.some((tag) => TAG_LABELS[tag].toLowerCase().includes(recipeUIState.search));
    return matchesFilter && matchesSearch;
  });

  grid.innerHTML = '';
  emptyState.hidden = filtered.length !== 0;

  filtered.forEach((recipe, i) => {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.style.setProperty('--card-hue', String((i * 47) % 360));
    card.innerHTML = `
      <div class="recipe-card-image" style="background: linear-gradient(135deg, hsl(${(i * 47) % 360}, 60%, 30%), hsl(${(i * 47 + 40) % 360}, 55%, 20%));">
        <i class="fa-solid ${recipe.icon}"></i>
        <span class="recipe-card-time"><i class="fa-regular fa-clock"></i> ${recipe.time} min</span>
      </div>
      <div class="recipe-card-body">
        <h3>${escapeHTML(recipe.name)}</h3>
        <p class="recipe-card-calories"><b>${recipe.calories}</b> kcal per serving</p>
        <div class="recipe-card-tags">
          ${recipe.tags.map((tag) => `<span class="recipe-card-tag">${TAG_LABELS[tag]}</span>`).join('')}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* =====================================================================
   7. UTILITIES
   ===================================================================== */

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatNumber(num) {
  return num.toLocaleString('en-US');
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}