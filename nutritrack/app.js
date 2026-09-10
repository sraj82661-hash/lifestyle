/* =====================================================================
   LIFESTYLE — COMPLETE JAVASCRIPT
===================================================================== */


/* =====================================================================
   APP START
===================================================================== */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        initTheme();

        initMobileNav();

        initScrollSpy();

        initDashboard();

        initWaterTracker();

        initRecipes();

        initLifestyleProfile();

        initManualFoodEntry();

        document.getElementById(
            'footerYear'
        ).textContent =
            new Date().getFullYear();

    }
);


/* =====================================================================
   THEME
===================================================================== */

function initTheme() {

    const body =
        document.body;

    const toggle =
        document.getElementById(
            'themeToggle'
        );

    const STORAGE_KEY =
        'lifestyle-theme';


    if (!toggle) {
        return;
    }


    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    const theme =
        saved === 'light'
            ? 'light'
            : 'dark';


    applyTheme(theme);


    toggle.addEventListener(
        'click',
        () => {

            const current =
                body.getAttribute(
                    'data-theme'
                );


            const next =
                current === 'dark'
                    ? 'light'
                    : 'dark';


            applyTheme(next);


            localStorage.setItem(
                STORAGE_KEY,
                next
            );

        }
    );


    function applyTheme(theme) {

        body.setAttribute(
            'data-theme',
            theme
        );


        toggle.setAttribute(
            'aria-checked',
            String(
                theme === 'dark'
            )
        );

    }

}


/* =====================================================================
   MOBILE NAVIGATION
===================================================================== */

function initMobileNav() {

    const burger =
        document.getElementById(
            'navBurger'
        );


    const nav =
        document.getElementById(
            'mainNav'
        );


    if (!burger || !nav) {
        return;
    }


    burger.addEventListener(
        'click',
        () => {

            const open =
                nav.classList.toggle(
                    'is-open'
                );


            burger.setAttribute(
                'aria-expanded',
                String(open)
            );

        }
    );


    nav
        .querySelectorAll(
            '.nav-link'
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    'click',
                    () => {

                        nav.classList.remove(
                            'is-open'
                        );


                        burger.setAttribute(
                            'aria-expanded',
                            'false'
                        );

                    }
                );

            }
        );

}


/* =====================================================================
   SCROLLSPY
===================================================================== */

function initScrollSpy() {

    const sections =
        document.querySelectorAll(
            'main section[id]'
        );


    const links =
        document.querySelectorAll(
            '.nav-link'
        );


    if (!sections.length) {
        return;
    }


    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const id =
                            entry.target.id;


                        links.forEach(
                            (link) => {

                                link.classList.toggle(
                                    'is-active',
                                    link.getAttribute(
                                        'href'
                                    ) ===
                                    `#${id}`
                                );

                            }
                        );

                    }
                );

            },

            {
                rootMargin:
                    '-40% 0px -50% 0px',

                threshold: 0

            }

        );


    sections.forEach(
        (section) => {

            observer.observe(
                section
            );

        }
    );

}


/* =====================================================================
   PROFILE
===================================================================== */

const PROFILE_STORAGE_KEY =
    'lifestyle-profile-v4';


let lifestyleProfile =
    loadProfile();


/* ---------------------------------------------------------------------
   INIT
--------------------------------------------------------------------- */

function initLifestyleProfile() {

    const modal =
        document.getElementById(
            'lifestyleProfileModal'
        );


    const form =
        document.getElementById(
            'lifestyleProfileForm'
        );


    if (!modal || !form) {
        return;
    }


    if (lifestyleProfile) {

        applyProfileToDashboard();

    } else {

        openProfileModal();

    }


    [
        'profileName',
        'profileAge',
        'profileGender',
        'profileHeight',
        'profileWeight',
        'profileGoal'
    ]
        .forEach(
            (id) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (!element) {
                    return;
                }


                element.addEventListener(
                    'input',
                    updateProfilePreview
                );


                element.addEventListener(
                    'change',
                    updateProfilePreview
                );

            }
        );


    form.addEventListener(
        'submit',
        saveProfile
    );

}


/* ---------------------------------------------------------------------
   OPEN
--------------------------------------------------------------------- */

function openProfileModal() {

    const modal =
        document.getElementById(
            'lifestyleProfileModal'
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        false;


    modal.setAttribute(
        'aria-hidden',
        'false'
    );


    document.body.style.overflow =
        'hidden';


    setTimeout(
        () => {

            const name =
                document.getElementById(
                    'profileName'
                );


            if (name) {
                name.focus();
            }

        },
        50
    );

}


/* ---------------------------------------------------------------------
   CLOSE
--------------------------------------------------------------------- */

function closeProfileModal() {

    const modal =
        document.getElementById(
            'lifestyleProfileModal'
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    modal.setAttribute(
        'aria-hidden',
        'true'
    );


    document.body.style.overflow =
        '';

}


/* ---------------------------------------------------------------------
   SAVE
--------------------------------------------------------------------- */

function saveProfile(event) {

    event.preventDefault();


    hideProfileError();


    const name =
        document.getElementById(
            'profileName'
        ).value.trim();


    const age =
        Number(
            document.getElementById(
                'profileAge'
            ).value
        );


    const gender =
        document.getElementById(
            'profileGender'
        ).value;


    const height =
        Number(
            document.getElementById(
                'profileHeight'
            ).value
        );


    const weight =
        Number(
            document.getElementById(
                'profileWeight'
            ).value
        );


    const goal =
        document.getElementById(
            'profileGoal'
        ).value;


    if (
        !name ||
        !age ||
        !gender ||
        !height ||
        !weight ||
        !goal
    ) {

        showProfileError(
            'Please complete every field.'
        );

        return;
    }


    if (
        age < 13 ||
        age > 120
    ) {

        showProfileError(
            'Please enter an age between 13 and 120.'
        );

        return;
    }


    if (
        height < 100 ||
        height > 250
    ) {

        showProfileError(
            'Please enter a height between 100 and 250 cm.'
        );

        return;
    }


    if (
        weight < 30 ||
        weight > 300
    ) {

        showProfileError(
            'Please enter a weight between 30 and 300 kg.'
        );

        return;
    }


    const profile = {

        name,

        age,

        gender,

        height,

        weight,

        goal

    };


    const nutrition =
        calculateNutrition(
            profile
        );


    lifestyleProfile = {

        profile,

        nutrition,

        updatedAt:
            new Date().toISOString()

    };


    localStorage.setItem(

        PROFILE_STORAGE_KEY,

        JSON.stringify(
            lifestyleProfile
        )

    );


    applyProfileToDashboard();


    closeProfileModal();

}


/* ---------------------------------------------------------------------
   BMR
--------------------------------------------------------------------- */

function calculateBMR(profile) {

    if (
        profile.gender ===
        'male'
    ) {

        return (
            10 * profile.weight +
            6.25 * profile.height -
            5 * profile.age +
            5
        );

    }


    return (
        10 * profile.weight +
        6.25 * profile.height -
        5 * profile.age -
        161
    );

}


/* ---------------------------------------------------------------------
   CALORIES + MACROS
--------------------------------------------------------------------- */

function calculateNutrition(profile) {

    const bmr =
        calculateBMR(
            profile
        );


    /*
     * Moderate activity factor.
     *
     * Your onboarding doesn't currently
     * ask for activity level.
     */

    const activityFactor =
        1.55;


    const tdee =
        bmr *
        activityFactor;


    let calories =
        tdee;


    if (
        profile.goal ===
        'weight-loss'
    ) {

        calories =
            tdee - 500;

    }


    if (
        profile.goal ===
        'muscle-gain'
    ) {

        calories =
            tdee + 300;

    }


    calories =
        Math.max(
            1200,
            Math.round(
                calories
            )
        );


    /*
     * Protein target.
     */

    const protein =
        Math.round(
            profile.weight *
            1.8
        );


    /*
     * Fats = 25% calories.
     */

    const fatCalories =
        calories *
        0.25;


    const fats =
        Math.round(
            fatCalories / 9
        );


    /*
     * Carbs = remaining calories.
     */

    const proteinCalories =
        protein *
        4;


    const carbCalories =
        Math.max(
            calories -
            proteinCalories -
            fatCalories,
            0
        );


    const carbs =
        Math.round(
            carbCalories / 4
        );


    /*
     * Macro percentages.
     */

    const proteinKcal =
        protein * 4;


    const carbsKcal =
        carbs * 4;


    const fatsKcal =
        fats * 9;


    const total =
        proteinKcal +
        carbsKcal +
        fatsKcal;


    const proteinPercent =
        total
            ? Math.round(
                (
                    proteinKcal /
                    total
                ) * 100
            )
            : 0;


    const carbsPercent =
        total
            ? Math.round(
                (
                    carbsKcal /
                    total
                ) * 100
            )
            : 0;


    const fatsPercent =
        Math.max(
            100 -
            proteinPercent -
            carbsPercent,
            0
        );


    return {

        bmr:
            Math.round(bmr),

        tdee:
            Math.round(tdee),

        calories,

        protein,

        carbs,

        fats,

        proteinPercent,

        carbsPercent,

        fatsPercent

    };

}


/* ---------------------------------------------------------------------
   PREVIEW
--------------------------------------------------------------------- */

function updateProfilePreview() {

    const age =
        Number(
            document.getElementById(
                'profileAge'
            ).value
        );


    const gender =
        document.getElementById(
            'profileGender'
        ).value;


    const height =
        Number(
            document.getElementById(
                'profileHeight'
            ).value
        );


    const weight =
        Number(
            document.getElementById(
                'profileWeight'
            ).value
        );


    const goal =
        document.getElementById(
            'profileGoal'
        ).value;


    const preview =
        document.getElementById(
            'profilePreview'
        );


    if (
        !age ||
        !gender ||
        !height ||
        !weight ||
        !goal
    ) {

        preview.hidden =
            true;

        return;

    }


    const nutrition =
        calculateNutrition({

            age,

            gender,

            height,

            weight,

            goal

        });


    preview.hidden =
        false;


    setText(
        'previewCalories',
        formatNumber(
            nutrition.calories
        )
    );


    setText(
        'previewProtein',
        `${nutrition.protein}g`
    );


    setText(
        'previewCarbs',
        `${nutrition.carbs}g`
    );


    setText(
        'previewFats',
        `${nutrition.fats}g`
    );

}


/* ---------------------------------------------------------------------
   APPLY PROFILE
--------------------------------------------------------------------- */

function applyProfileToDashboard() {

    if (!lifestyleProfile) {
        return;
    }


    const nutrition =
        lifestyleProfile.nutrition;


    dashboardState.calorieGoal =
        nutrition.calories;


    updateDashboardTotals();


    setText(
        'calorieGoalLabel',
        `Goal: ${formatNumber(
            nutrition.calories
        )} kcal`
    );


    setText(
        'heroCalorieGoal',
        formatNumber(
            nutrition.calories
        )
    );


    setText(
        'heroProteinPct',
        `${nutrition.proteinPercent}%`
    );


    setText(
        'heroCarbsPct',
        `${nutrition.carbsPercent}%`
    );


    setText(
        'heroFatsPct',
        `${nutrition.fatsPercent}%`
    );


    setText(
        'lifestyleMacroTargetDisplay',
        `Target: P ${nutrition.protein}g · C ${nutrition.carbs}g · F ${nutrition.fats}g`
    );

}


/* ---------------------------------------------------------------------
   PROFILE STORAGE
--------------------------------------------------------------------- */

function loadProfile() {

    try {

        const stored =
            localStorage.getItem(
                PROFILE_STORAGE_KEY
            );


        if (!stored) {
            return null;
        }


        return JSON.parse(
            stored
        );

    } catch (error) {

        console.error(
            'Unable to load profile:',
            error
        );


        return null;

    }

}


/* ---------------------------------------------------------------------
   RESET
--------------------------------------------------------------------- */

function resetLifestyleProfile() {

    localStorage.removeItem(
        PROFILE_STORAGE_KEY
    );


    lifestyleProfile =
        null;


    dashboardState.calorieGoal =
        2000;


    const form =
        document.getElementById(
            'lifestyleProfileForm'
        );


    if (form) {
        form.reset();
    }


    const preview =
        document.getElementById(
            'profilePreview'
        );


    if (preview) {
        preview.hidden =
            true;
    }


    openProfileModal();

}


window.resetLifestyleProfile =
    resetLifestyleProfile;


/* ---------------------------------------------------------------------
   PROFILE ERROR
--------------------------------------------------------------------- */

function showProfileError(message) {

    const element =
        document.getElementById(
            'profileFormError'
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.hidden =
        false;

}


function hideProfileError() {

    const element =
        document.getElementById(
            'profileFormError'
        );


    if (!element) {
        return;
    }


    element.textContent =
        '';


    element.hidden =
        true;

}


/* =====================================================================
   DASHBOARD
===================================================================== */

const dashboardState = {

    calorieGoal:
        2000,

    baseCalories:
        0,

    baseMacros: {

        protein:
            0,

        carbs:
            0,

        fats:
            0

    },

    activeMeal:
        'breakfast',

    meals: {

        breakfast: [],

        lunch: [],

        dinner: [],

        snacks: []

    }

};


/* ---------------------------------------------------------------------
   INIT DASHBOARD
--------------------------------------------------------------------- */

function initDashboard() {

    initMealTabs();

    initQuickAddForm();

    renderMealLog();

    updateDashboardTotals();

}


/* ---------------------------------------------------------------------
   MEAL TABS
--------------------------------------------------------------------- */

function initMealTabs() {

    const tabs =
        document.querySelectorAll(
            '.meal-tab'
        );


    const label =
        document.getElementById(
            'activeMealLabel'
        );


    tabs.forEach(
        (tab) => {

            tab.addEventListener(
                'click',
                () => {

                    tabs.forEach(
                        (item) => {

                            item.classList.remove(
                                'is-active'
                            );

                            item.setAttribute(
                                'aria-selected',
                                'false'
                            );

                        }
                    );


                    tab.classList.add(
                        'is-active'
                    );


                    tab.setAttribute(
                        'aria-selected',
                        'true'
                    );


                    dashboardState.activeMeal =
                        tab.dataset.meal;


                    if (label) {

                        label.textContent =
                            capitalize(
                                dashboardState.activeMeal
                            );

                    }


                    renderMealLog();

                }
            );

        }
    );

}


/* ---------------------------------------------------------------------
   QUICK ADD
--------------------------------------------------------------------- */

function initQuickAddForm() {

    const form =
        document.getElementById(
            'quickAddForm'
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        'submit',
        (event) => {

            event.preventDefault();


            const name =
                document.getElementById(
                    'mealName'
                ).value.trim();


            const calories =
                Number(
                    document.getElementById(
                        'mealCalories'
                    ).value
                ) || 0;


            const protein =
                Number(
                    document.getElementById(
                        'mealProtein'
                    ).value
                ) || 0;


            const carbs =
                Number(
                    document.getElementById(
                        'mealCarbs'
                    ).value
                ) || 0;


            const fats =
                Number(
                    document.getElementById(
                        'mealFats'
                    ).value
                ) || 0;


            if (
                !name ||
                calories <= 0
            ) {

                return;

            }


            dashboardState
                .meals[
                    dashboardState.activeMeal
                ]
                .push({

                    id:
                        Date.now(),

                    name,

                    calories,

                    protein,

                    carbs,

                    fats

                });


            form.reset();


            renderMealLog();


            updateDashboardTotals();

        }
    );

}


/* ---------------------------------------------------------------------
   MEAL LOG
--------------------------------------------------------------------- */

function renderMealLog() {

    const log =
        document.getElementById(
            'mealLog'
        );


    if (!log) {
        return;
    }


    const items =
        dashboardState.meals[
            dashboardState.activeMeal
        ];


    const label =
        capitalize(
            dashboardState.activeMeal
        );


    log.innerHTML =
        '';


    if (!items.length) {

        const empty =
            document.createElement(
                'li'
            );


        empty.className =
            'meal-log-empty';


        empty.textContent =
            `No meals logged for ${label} yet — add your first one above.`;


        log.appendChild(
            empty
        );


        return;

    }


    items.forEach(
        (item) => {

            const li =
                document.createElement(
                    'li'
                );


            li.className =
                'meal-log-item';


            li.innerHTML = `

                <span>

                    <span class="meal-log-item-name">
                        ${escapeHTML(item.name)}
                    </span>

                    <span class="meal-log-item-macros">

                        · ${item.calories} kcal

                        · P ${item.protein}g

                        · C ${item.carbs}g

                        · F ${item.fats}g

                    </span>

                </span>


                <button
                    type="button"
                    class="meal-log-item-remove"
                    aria-label="Remove food"
                >

                    <i class="fa-solid fa-xmark"></i>

                </button>

            `;


            li
                .querySelector(
                    '.meal-log-item-remove'
                )
                .addEventListener(
                    'click',
                    () => {

                        dashboardState.meals[
                            dashboardState.activeMeal
                        ] =
                            dashboardState.meals[
                                dashboardState.activeMeal
                            ].filter(
                                (meal) =>
                                    meal.id !==
                                    item.id
                            );


                        renderMealLog();

                        updateDashboardTotals();

                    }
                );


            log.appendChild(
                li
            );

        }
    );

}


/* ---------------------------------------------------------------------
   DASHBOARD TOTALS
--------------------------------------------------------------------- */

function getLoggedTotals() {

    const totals = {

        calories:
            0,

        protein:
            0,

        carbs:
            0,

        fats:
            0

    };


    Object.values(
        dashboardState.meals
    )
        .forEach(
            (mealArray) => {

                mealArray.forEach(
                    (item) => {

                        totals.calories +=
                            item.calories;


                        totals.protein +=
                            item.protein;


                        totals.carbs +=
                            item.carbs;


                        totals.fats +=
                            item.fats;

                    }
                );

            }
        );


    return totals;

}


function updateDashboardTotals() {

    const logged =
        getLoggedTotals();


    const consumed =
        dashboardState.baseCalories +
        logged.calories;


    const remaining =
        Math.max(
            dashboardState.calorieGoal -
            consumed,
            0
        );


    const ring =
        dashboardState.calorieGoal > 0
            ? Math.min(
                consumed /
                dashboardState.calorieGoal,
                1
            )
            : 0;


    setText(
        'caloriesConsumed',
        formatNumber(consumed)
    );


    setText(
        'caloriesRemaining',
        formatNumber(remaining)
    );


    setText(
        'legendConsumed',
        formatNumber(consumed)
    );


    setText(
        'legendRemaining',
        formatNumber(remaining)
    );


    setStyle(
        'calorieRingProgress',
        '--ring-value',
        ring.toFixed(3)
    );


    setText(
        'heroCaloriesConsumed',
        formatNumber(consumed)
    );


    setStyle(
        'heroCalorieRingProgress',
        '--ring-value',
        ring.toFixed(3)
    );


    const protein =
        dashboardState.baseMacros.protein +
        logged.protein;


    const carbs =
        dashboardState.baseMacros.carbs +
        logged.carbs;


    const fats =
        dashboardState.baseMacros.fats +
        logged.fats;


    const targets =
        lifestyleProfile
            ? lifestyleProfile.nutrition
            : null;


    const proteinTarget =
        targets
            ? targets.protein
            : 1;


    const carbsTarget =
        targets
            ? targets.carbs
            : 1;


    const fatsTarget =
        targets
            ? targets.fats
            : 1;


    const proteinPercent =
        Math.min(
            Math.round(
                (
                    protein /
                    proteinTarget
                ) * 100
            ),
            100
        );


    const carbsPercent =
        Math.min(
            Math.round(
                (
                    carbs /
                    carbsTarget
                ) * 100
            ),
            100
        );


    const fatsPercent =
        Math.min(
            Math.round(
                (
                    fats /
                    fatsTarget
                ) * 100
            ),
            100
        );


    setText(
        'proteinGrams',
        protein
    );


    setText(
        'carbsGrams',
        carbs
    );


    setText(
        'fatsGrams',
        fats
    );


    setText(
        'proteinPct',
        `${proteinPercent}%`
    );


    setText(
        'carbsPct',
        `${carbsPercent}%`
    );


    setText(
        'fatsPct',
        `${fatsPercent}%`
    );


    setStyleWidth(
        'proteinBar',
        proteinPercent
    );


    setStyleWidth(
        'carbsBar',
        carbsPercent
    );


    setStyleWidth(
        'fatsBar',
        fatsPercent
    );

}


/* =====================================================================
   WATER
===================================================================== */

const waterState = {

    goalGlasses:
        8,

    goalLitres:
        2.5,

    count:
        0

};


function initWaterTracker() {

    const wrapper =
        document.getElementById(
            'waterGlasses'
        );


    if (!wrapper) {
        return;
    }


    wrapper.innerHTML =
        '';


    for (
        let i = 0;
        i < waterState.goalGlasses;
        i++
    ) {

        const button =
            document.createElement(
                'button'
            );


        button.type =
            'button';


        button.className =
            'water-glass';


        button.innerHTML =
            `<i class="fa-solid fa-glass-water"></i>`;


        button.addEventListener(
            'click',
            () => {

                const target =
                    i + 1;


                waterState.count =
                    waterState.count === target
                        ? target - 1
                        : target;


                renderWaterTracker();

            }
        );


        wrapper.appendChild(
            button
        );

    }


    const reset =
        document.getElementById(
            'waterResetBtn'
        );


    if (reset) {

        reset.addEventListener(
            'click',
            () => {

                waterState.count =
                    0;

                renderWaterTracker();

            }
        );

    }


    renderWaterTracker();

}


function renderWaterTracker() {

    const glasses =
        document.querySelectorAll(
            '.water-glass'
        );


    glasses.forEach(
        (glass, index) => {

            glass.classList.toggle(
                'is-filled',
                index <
                waterState.count
            );

        }
    );


    const percent =
        (
            waterState.count /
            waterState.goalGlasses
        ) * 100;


    const fill =
        document.getElementById(
            'waterFill'
        );


    if (fill) {

        fill.style.height =
            `${percent}%`;

    }


    const litres =
        (
            waterState.count /
            waterState.goalGlasses
        ) *
        waterState.goalLitres;


    setText(
        'waterAmountLitres',
        `${litres.toFixed(1)}L`
    );


    setText(
        'waterAmountGlasses',
        `${waterState.count} of ${waterState.goalGlasses} glasses`
    );

}


/* =====================================================================
   VEGETARIAN RECIPES
===================================================================== */

const RECIPES = [

    {
        name:
            'Paneer Tikka Power Bowl',

        icon:
            'fa-bowl-food',

        time:
            25,

        calories:
            430,

        tags:
            [
                'vegetarian',
                'high-protein',
                'low-carb'
            ],

        ingredients:
            [
                'paneer',
                'bell pepper',
                'onion',
                'yogurt',
                'spices'
            ]

    },


    {
        name:
            'Avocado Chickpea Salad',

        icon:
            'fa-seedling',

        time:
            10,

        calories:
            360,

        tags:
            [
                'vegetarian',
                'vegan',
                'quick-prep'
            ],

        ingredients:
            [
                'avocado',
                'chickpeas',
                'tomato',
                'cucumber',
                'lemon'
            ]

    },


    {
        name:
            'Tofu Veggie Stir-Fry',

        icon:
            'fa-pepper-hot',

        time:
            18,

        calories:
            390,

        tags:
            [
                'vegetarian',
                'vegan',
                'high-protein',
                'quick-prep'
            ],

        ingredients:
            [
                'tofu',
                'broccoli',
                'capsicum',
                'soy',
                'carrot'
            ]

    },


    {
        name:
            'Zucchini Noodle Alfredo',

        icon:
            'fa-bowl-food',

        time:
            22,

        calories:
            340,

        tags:
            [
                'vegetarian',
                'low-carb',
                'keto'
            ],

        ingredients:
            [
                'zucchini',
                'cheese',
                'cream',
                'garlic'
            ]

    },


    {
        name:
            'Quinoa Power Bowl',

        icon:
            'fa-wheat-awn',

        time:
            15,

        calories:
            410,

        tags:
            [
                'vegetarian',
                'vegan',
                'high-protein'
            ],

        ingredients:
            [
                'quinoa',
                'beans',
                'spinach',
                'corn',
                'avocado'
            ]

    },


    {
        name:
            'Palak Paneer Bowl',

        icon:
            'fa-leaf',

        time:
            25,

        calories:
            380,

        tags:
            [
                'vegetarian',
                'high-protein'
            ],

        ingredients:
            [
                'paneer',
                'spinach',
                'tomato',
                'onion',
                'garlic'
            ]

    },


    {
        name:
            'Vegetable Poha',

        icon:
            'fa-seedling',

        time:
            12,

        calories:
            280,

        tags:
            [
                'vegetarian',
                'vegan',
                'quick-prep'
            ],

        ingredients:
            [
                'poha',
                'peanuts',
                'onion',
                'peas',
                'lemon'
            ]

    },


    {
        name:
            'Masala Oats',

        icon:
            'fa-bowl-food',

        time:
            10,

        calories:
            290,

        tags:
            [
                'vegetarian',
                'vegan',
                'quick-prep'
            ],

        ingredients:
            [
                'oats',
                'carrot',
                'peas',
                'spices',
                'onion'
            ]

    },


    {
        name:
            'Idli & Sambar',

        icon:
            'fa-bowl-rice',

        time:
            15,

        calories:
            320,

        tags:
            [
                'vegetarian',
                'vegan'
            ],

        ingredients:
            [
                'idli',
                'rice',
                'urad dal',
                'lentils',
                'vegetables'
            ]

    },


    {
        name:
            'Moong Dal Chilla',

        icon:
            'fa-circle-dot',

        time:
            20,

        calories:
            300,

        tags:
            [
                'vegetarian',
                'vegan',
                'high-protein'
            ],

        ingredients:
            [
                'moong dal',
                'onion',
                'tomato',
                'green chilli',
                'coriander'
            ]

    },


    {
        name:
            'Rajma Rice Bowl',

        icon:
            'fa-bowl-food',

        time:
            30,

        calories:
            450,

        tags:
            [
                'vegetarian',
                'vegan',
                'high-protein'
            ],

        ingredients:
            [
                'rajma',
                'rice',
                'tomato',
                'onion',
                'spices'
            ]

    },


    {
        name:
            'Greek Yogurt Berry Parfait',

        icon:
            'fa-ice-cream',

        time:
            5,

        calories:
            240,

        tags:
            [
                'vegetarian',
                'high-protein',
                'quick-prep'
            ],

        ingredients:
            [
                'greek yogurt',
                'berries',
                'honey',
                'almonds'
            ]

    },


    {
        name:
            'Almond Butter Protein Smoothie',

        icon:
            'fa-blender',

        time:
            5,

        calories:
            330,

        tags:
            [
                'vegetarian',
                'quick-prep',
                'high-protein'
            ],

        ingredients:
            [
                'almond butter',
                'banana',
                'milk',
                'oats'
            ]

    }

];


const TAG_LABELS = {

    vegetarian:
        'Vegetarian',

    'high-protein':
        'High Protein',

    'low-carb':
        'Low Carb',

    vegan:
        'Vegan',

    keto:
        'Keto',

    'quick-prep':
        'Quick Prep'

};


const recipeUIState = {

    filter:
        'all',

    search:
        ''

};


/* ---------------------------------------------------------------------
   RECIPE INIT
--------------------------------------------------------------------- */

function initRecipes() {

    const search =
        document.getElementById(
            'recipeSearch'
        );


    const filters =
        document.getElementById(
            'recipeFilters'
        );


    if (!search || !filters) {
        return;
    }


    search.addEventListener(
        'input',
        (event) => {

            recipeUIState.search =
                event.target.value
                    .trim()
                    .toLowerCase();


            renderRecipes();

        }
    );


    filters
        .querySelectorAll(
            '.filter-tag'
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    'click',
                    () => {

                        filters
                            .querySelectorAll(
                                '.filter-tag'
                            )
                            .forEach(
                                (item) => {

                                    item.classList.remove(
                                        'is-active'
                                    );

                                }
                            );


                        button.classList.add(
                            'is-active'
                        );


                        recipeUIState.filter =
                            button.dataset.filter;


                        renderRecipes();

                    }
                );

            }
        );


    renderRecipes();

}


/* ---------------------------------------------------------------------
   RENDER RECIPES
--------------------------------------------------------------------- */

function renderRecipes() {

    const grid =
        document.getElementById(
            'recipeGrid'
        );


    const empty =
        document.getElementById(
            'recipeEmpty'
        );


    if (!grid) {
        return;
    }


    const filtered =
        RECIPES.filter(
            (recipe) => {

                const matchesFilter =
                    recipeUIState.filter ===
                        'all'
                    ||
                    recipe.tags.includes(
                        recipeUIState.filter
                    );


                const searchableText =
                    [

                        recipe.name,

                        ...recipe.ingredients,

                        ...recipe.tags,

                        ...recipe.tags.map(
                            (tag) =>
                                TAG_LABELS[tag] ||
                                tag
                        ),

                        String(
                            recipe.calories
                        ),

                        `${recipe.time} min`

                    ]
                        .join(' ')
                        .toLowerCase();


                const matchesSearch =
                    !recipeUIState.search
                    ||
                    searchableText.includes(
                        recipeUIState.search
                    );


                return (
                    matchesFilter &&
                    matchesSearch
                );

            }
        );


    grid.innerHTML =
        '';


    if (empty) {

        empty.hidden =
            filtered.length !== 0;

    }


    filtered.forEach(
        (recipe, index) => {

            const card =
                document.createElement(
                    'article'
                );


            card.className =
                'recipe-card';


            const hue =
                (
                    index * 47
                ) % 360;


            card.innerHTML = `

                <div
                    class="recipe-card-image"
                    style="
                        background:
                        linear-gradient(
                            135deg,
                            hsl(
                                ${hue},
                                60%,
                                30%
                            ),
                            hsl(
                                ${(hue + 40) % 360},
                                55%,
                                20%
                            )
                        );
                    "
                >

                    <i
                        class="fa-solid ${escapeHTML(
                            recipe.icon
                        )}"
                    ></i>


                    <span class="recipe-card-time">

                        <i class="fa-regular fa-clock"></i>

                        ${recipe.time} min

                    </span>

                </div>


                <div class="recipe-card-body">

                    <h3>
                        ${escapeHTML(
                            recipe.name
                        )}
                    </h3>


                    <p class="recipe-card-calories">

                        <b>
                            ${recipe.calories}
                        </b>

                        kcal per serving

                    </p>


                    <div class="recipe-card-tags">

                        ${recipe.tags
                            .map(
                                (tag) => `

                                    <span
                                        class="recipe-card-tag"
                                    >

                                        ${escapeHTML(
                                            TAG_LABELS[tag] ||
                                            tag
                                        )}

                                    </span>

                                `
                            )
                            .join('')}

                    </div>

                </div>

            `;


            grid.appendChild(
                card
            );

        }
    );


    renderRecipeRecommendation();

}


/* ---------------------------------------------------------------------
   RECIPE RECOMMENDATION
--------------------------------------------------------------------- */

function renderRecipeRecommendation() {

    const box =
        document.getElementById(
            'recipeRecommendation'
        );


    if (!box) {
        return;
    }


    if (
        recipeUIState.filter ===
            'all'
        ||
        recipeUIState.search
    ) {

        box.hidden =
            true;

        box.innerHTML =
            '';

        return;

    }


    const selected =
        RECIPES.filter(
            (recipe) =>
                recipe.tags.includes(
                    recipeUIState.filter
                )
        );


    if (!selected.length) {

        box.hidden =
            true;

        return;

    }


    const names =
        selected
            .slice(0, 3)
            .map(
                (recipe) =>
                    recipe.name
            );


    const label =
        TAG_LABELS[
            recipeUIState.filter
        ] ||
        'Healthy';


    box.innerHTML = `

        <strong>

            <i
                class="fa-solid fa-wand-magic-sparkles"
            ></i>

            ${label} picks for you

        </strong>


        <span>

            You can try
            ${names.join(', ')}.

        </span>

    `;


    box.hidden =
        false;

}


/* =====================================================================
   MANUAL FOOD DATABASE
===================================================================== */

/*
 * IMPORTANT:
 *
 * This is a starter vegetarian food database.
 *
 * Food nutrition varies by brand, preparation method,
 * oil, recipe and portion size, so these values should
 * be treated as estimates.
 */


const FOOD_DATABASE = [

    {
        id:
            'rice',

        name:
            'Cooked White Rice',

        category:
            'Indian Staples',

        servings: {

            serving: '1 katori',

            katori: '1 katori',

            bowl: '1 bowl',

            cup: '1 cup'

        },

        nutrition: {

            calories: 195,

            protein: 4.1,

            carbs: 42.3,

            fats: 0.4,

            fiber: 0.6,

            sodium: 2,

            potassium: 63,

            calcium: 16,

            iron: 0.3,

            vitaminC: 0

        }

    },


    {
        id:
            'dal',

        name:
            'Dal / Lentil Curry',

        category:
            'Indian Foods',

        servings: {

            serving: '1 katori',

            katori: '1 katori',

            bowl: '1 bowl',

            cup: '1 cup'

        },

        nutrition: {

            calories: 175,

            protein: 9,

            carbs: 27,

            fats: 4,

            fiber: 8,

            sodium: 260,

            potassium: 390,

            calcium: 35,

            iron: 3,

            vitaminC: 3

        }

    },


    {
        id:
            'roti',

        name:
            'Roti / Chapati',

        category:
            'Indian Foods',

        servings: {

            serving:
                '1 roti',

            roti:
                '1 roti',

            chapati:
                '1 chapati',

            piece:
                '1 piece'

        },

        nutrition: {

            calories: 110,

            protein: 3.5,

            carbs: 18,

            fats: 2.5,

            fiber: 2.7,

            sodium: 120,

            potassium: 90,

            calcium: 15,

            iron: 1.2,

            vitaminC: 0

        }

    },


    {
        id:
            'paratha',

        name:
            'Plain Paratha',

        category:
            'Indian Foods',

        servings: {

            serving:
                '1 paratha',

            piece:
                '1 piece'

        },

        nutrition: {

            calories: 210,

            protein: 4.5,

            carbs: 28,

            fats: 9,

            fiber: 2,

            sodium: 220,

            potassium: 90,

            calcium: 20,

            iron: 1.3,

            vitaminC: 0

        }

    },


    {
        id:
            'paneer',

        name:
            'Paneer',

        category:
            'Dairy',

        servings: {

            serving:
                '100g',

            katori:
                '1 katori',

            bowl:
                '1 bowl',

            piece:
                '1 piece'

        },

        nutrition: {

            calories: 265,

            protein: 18.3,

            carbs: 6.1,

            fats: 20.8,

            fiber: 0,

            sodium: 22,

            potassium: 104,

            calcium: 208,

            iron: 2.1,

            vitaminC: 0

        }

    },


    {
        id:
            'curd',

        name:
            'Plain Curd / Yogurt',

        category:
            'Dairy',

        servings: {

            serving:
                '1 katori',

            katori:
                '1 katori',

            bowl:
                '1 bowl',

            cup:
                '1 cup'

        },

        nutrition: {

            calories: 92,

            protein: 5.3,

            carbs: 7,

            fats: 4.8,

            fiber: 0,

            sodium: 70,

            potassium: 234,

            calcium: 180,

            iron: 0.1,

            vitaminC: 1

        }

    },


    {
        id:
            'milk',

        name:
            'Milk',

        category:
            'Dairy',

        servings: {

            serving:
                '1 glass',

            glass:
                '1 glass',

            cup:
                '1 cup'

        },

        nutrition: {

            calories: 153,

            protein: 8,

            carbs: 12,

            fats: 8,

            fiber: 0,

            sodium: 105,

            potassium: 322,

            calcium: 300,

            iron: 0.1,

            vitaminC: 0

        }

    },


    {
        id:
            'banana',

        name:
            'Banana',

        category:
            'Fruit',

        servings: {

            serving:
                '1 banana',

            piece:
                '1 piece'

        },

        nutrition: {

            calories: 105,

            protein: 1.3,

            carbs: 27,

            fats: 0.4,

            fiber: 3.1,

            sodium: 1,

            potassium: 422,

            calcium: 6,

            iron: 0.3,

            vitaminC: 10.3

        }

    },


    {
        id:
            'apple',

        name:
            'Apple',

        category:
            'Fruit',

        servings: {

            serving:
                '1 apple',

            piece:
                '1 piece'

        },

        nutrition: {

            calories: 95,

            protein: 0.5,

            carbs: 25,

            fats: 0.3,

            fiber: 4.4,

            sodium: 2,

            potassium: 195,

            calcium: 11,

            iron: 0.2,

            vitaminC: 8.4

        }

    },


    {
        id:
            'chickpeas',

        name:
            'Chickpeas / Chana',

        category:
            'Legumes',

        servings: {

            serving:
                '1 katori',

            katori:
                '1 katori',

            bowl:
                '1 bowl'

        },

        nutrition: {

            calories: 246,

            protein: 13.5,

            carbs: 40.5,

            fats: 4,

            fiber: 10.5,

            sodium: 11,

            potassium: 477,

            calcium: 80,

            iron: 4.7,

            vitaminC: 1.3

        }

    },


    {
        id:
            'rajma',

        name:
            'Rajma',

        category:
            'Indian Foods',

        servings: {

            serving:
                '1 katori',

            katori:
                '1 katori',

            bowl:
                '1 bowl'

        },

        nutrition: {

            calories: 190,

            protein: 12,

            carbs: 34,

            fats: 1,

            fiber: 9,

            sodium: 10,

            potassium: 400,

            calcium: 70,

            iron: 2.8,

            vitaminC: 2

        }

    },


    {
        id:
            'sabzi',

        name:
            'Mixed Vegetable Sabzi',

        category:
            'Indian Foods',

        servings: {

            serving:
                '1 katori',

            katori:
                '1 katori',

            bowl:
                '1 bowl'

        },

        nutrition: {

            calories: 120,

            protein: 4,

            carbs: 16,

            fats: 5,

            fiber: 5,

            sodium: 180,

            potassium: 350,

            calcium: 50,

            iron: 1.5,

            vitaminC: 35

        }

    },


    {
        id:
            'poha',

        name:
            'Vegetable Poha',

        category:
            'Indian Breakfast',

        servings: {

            serving:
                '1 katori',

            katori:
                '1 katori',

            bowl:
                '1 bowl'

        },

        nutrition: {

            calories: 180,

            protein: 4,

            carbs: 32,

            fats: 4,

            fiber: 2.5,

            sodium: 220,

            potassium: 120,

            calcium: 20,

            iron: 2,

            vitaminC: 15

        }

    },


    {
        id:
            'upma',

        name:
            'Vegetable Upma',

        category:
            'Indian Breakfast',

        servings: {

            serving:
                '1 katori',

            katori:
                '1 katori',

            bowl:
                '1 bowl'

        },

        nutrition: {

            calories: 190,

            protein: 5,

            carbs: 32,

            fats: 5,

            fiber: 3,

            sodium: 240,

            potassium: 150,

            calcium: 25,

            iron: 1.8,

            vitaminC: 12

        }

    },


    {
        id:
            'idli',

        name:
            'Idli',

        category:
            'Indian Breakfast',

        servings: {

            serving:
                '1 idli',

            piece:
                '1 piece'

        },

        nutrition: {

            calories: 58,

            protein: 2,

            carbs: 12,

            fats: 0.4,

            fiber: 0.8,

            sodium: 120,

            potassium: 35,

            calcium: 10,

            iron: 0.5,

            vitaminC: 0

        }

    },


    {
        id:
            'dosa',

        name:
            'Plain Dosa',

        category:
            'Indian Breakfast',

        servings: {

            serving:
                '1 dosa',

            piece:
                '1 piece'

        },

        nutrition: {

            calories: 168,

            protein: 3.5,

            carbs: 29,

            fats: 4,

            fiber: 1,

            sodium: 180,

            potassium: 80,

            calcium: 12,

            iron: 1.3,

            vitaminC: 0

        }

    },


    {
        id:
            'oats',

        name:
            'Cooked Oatmeal',

        category:
            'Breakfast',

        servings: {

            serving:
                '1 bowl',

            bowl:
                '1 bowl',

            cup:
                '1 cup',

            katori:
                '1 katori'

        },

        nutrition: {

            calories: 107,

            protein: 3.8,

            carbs: 18.6,

            fats: 1.9,

            fiber: 2.7,

            sodium: 49,

            potassium: 90,

            calcium: 52,

            iron: 1.3,

            vitaminC: 0

        }

    },


    {
        id:
            'tofu',

        name:
            'Tofu',

        category:
            'Plant Protein',

        servings: {

            serving:
                '100g',

            katori:
                '1 katori',

            bowl:
                '1 bowl'

        },

        nutrition: {

            calories: 144,

            protein: 17,

            carbs: 3,

            fats: 8,

            fiber: 2,

            sodium: 14,

            potassium: 237,

            calcium: 350,

            iron: 2.7,

            vitaminC: 0

        }

    },


    {
        id:
            'almonds',

        name:
            'Almonds',

        category:
            'Nuts',

        servings: {

            serving:
                '1 handful',

            piece:
                '1 handful'

        },

        nutrition: {

            calories: 164,

            protein: 6,

            carbs: 6.1,

            fats: 14.2,

            fiber: 3.5,

            sodium: 0,

            potassium: 208,

            calcium: 76,

            iron: 1,

            vitaminC: 0

        }

    },


    {
        id:
            'peanut-butter',

        name:
            'Peanut Butter',

        category:
            'Spreads',

        servings: {

            serving:
                '1 tablespoon',

            tablespoon:
                '1 tablespoon',

            teaspoon:
                '1 teaspoon'

        },

        nutrition: {

            calories: 94,

            protein: 4,

            carbs: 3,

            fats: 8,

            fiber: 1,

            sodium: 73,

            potassium: 100,

            calcium: 17,

            iron: 0.4,

            vitaminC: 0

        }

    }

];


/* =====================================================================
   MANUAL FOOD STATE
===================================================================== */

const manualFoodState = {

    selectedFood:
        '',

    unit:
        'serving'

};


/* =====================================================================
   MANUAL FOOD INIT
===================================================================== */

function initManualFoodEntry() {

    const openButton =
        document.getElementById(
            'openManualFoodBtn'
        );


    const modal =
        document.getElementById(
            'manualFoodModal'
        );


    const form =
        document.getElementById(
            'manualFoodForm'
        );


    if (
        !openButton ||
        !modal ||
        !form
    ) {
        return;
    }


    openButton.addEventListener(
        'click',
        openManualFoodModal
    );


    document
        .getElementById(
            'closeManualFoodBtn'
        )
        .addEventListener(
            'click',
            closeManualFoodModal
        );


    document
        .getElementById(
            'manualFoodBackdrop'
        )
        .addEventListener(
            'click',
            closeManualFoodModal
        );


    document
        .getElementById(
            'manualFoodSearch'
        )
        .addEventListener(
            'input',
            renderFoodOptions
        );


    document
        .getElementById(
            'manualFoodSelect'
        )
        .addEventListener(
            'change',
            handleFoodSelect
        );


    document
        .getElementById(
            'manualFoodAmount'
        )
        .addEventListener(
            'input',
            updateManualFoodNutrition
        );


    document
        .getElementById(
            'manualFoodUnit'
        )
        .addEventListener(
            'change',
            updateManualFoodNutrition
        );


    form.addEventListener(
        'submit',
        addManualFood
    );


    document.addEventListener(
        'keydown',
        (event) => {

            if (
                event.key === 'Escape' &&
                !modal.hidden
            ) {

                closeManualFoodModal();

            }

        }
    );

}


/* ---------------------------------------------------------------------
   OPEN MANUAL FOOD
--------------------------------------------------------------------- */

function openManualFoodModal() {

    const modal =
        document.getElementById(
            'manualFoodModal'
        );


    modal.hidden =
        false;


    modal.setAttribute(
        'aria-hidden',
        'false'
    );


    document.body.style.overflow =
        'hidden';


    renderFoodOptions();


    document
        .getElementById(
            'manualFoodSearch'
        )
        .focus();

}


/* ---------------------------------------------------------------------
   CLOSE MANUAL FOOD
--------------------------------------------------------------------- */

function closeManualFoodModal() {

    const modal =
        document.getElementById(
            'manualFoodModal'
        );


    modal.hidden =
        true;


    modal.setAttribute(
        'aria-hidden',
        'true'
    );


    document.body.style.overflow =
        '';

}


/* ---------------------------------------------------------------------
   SEARCH FOOD OPTIONS
--------------------------------------------------------------------- */

function renderFoodOptions() {

    const search =
        document
            .getElementById(
                'manualFoodSearch'
            )
            .value
            .trim()
            .toLowerCase();


    const select =
        document.getElementById(
            'manualFoodSelect'
        );


    const foods =
        FOOD_DATABASE.filter(
            (food) => {

                const text =
                    [
                        food.name,
                        food.category
                    ]
                        .join(' ')
                        .toLowerCase();


                return text.includes(
                    search
                );

            }
        );


    select.innerHTML = `

        <option value="">
            Select a food
        </option>

    `;


    foods.forEach(
        (food) => {

            const option =
                document.createElement(
                    'option'
                );


            option.value =
                food.id;


            option.textContent =
                `${food.name} — ${food.category}`;


            select.appendChild(
                option
            );

        }
    );

}


/* ---------------------------------------------------------------------
   FOOD SELECTED
--------------------------------------------------------------------- */

function handleFoodSelect(event) {

    manualFoodState.selectedFood =
        event.target.value;


    updateFoodUnits();


    updateManualFoodNutrition();

}


/* ---------------------------------------------------------------------
   UPDATE UNITS
--------------------------------------------------------------------- */

function updateFoodUnits() {

    const food =
        FOOD_DATABASE.find(
            (item) =>
                item.id ===
                manualFoodState.selectedFood
        );


    const select =
        document.getElementById(
            'manualFoodUnit'
        );


    if (!food) {

        select.innerHTML = `

            <option value="serving">
                1 Serving
            </option>

        `;


        return;

    }


    select.innerHTML =
        '';


    Object.entries(
        food.servings
    )
        .forEach(
            ([unit, label]) => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    unit;


                option.textContent =
                    label;


                select.appendChild(
                    option
                );

            }
        );


    /*
     * Prefer katori when available.
     */

    if (
        food.servings.katori
    ) {

        select.value =
            'katori';

    } else {

        select.value =
            Object.keys(
                food.servings
            )[0];

    }


    manualFoodState.unit =
        select.value;

}


/* ---------------------------------------------------------------------
   CALCULATE MANUAL FOOD
--------------------------------------------------------------------- */

function calculateManualFood() {

    const food =
        FOOD_DATABASE.find(
            (item) =>
                item.id ===
                manualFoodState.selectedFood
        );


    if (!food) {
        return null;
    }


    const quantity =
        Number(
            document.getElementById(
                'manualFoodAmount'
            ).value
        );


    const unit =
        document.getElementById(
            'manualFoodUnit'
        ).value;


    if (
        !quantity ||
        quantity <= 0
    ) {
        return null;
    }


    const nutrition =
        food.nutrition;


    /*
     * Quantity is a multiplier:
     *
     * 1 katori = 1x
     * 2 katori = 2x
     * 0.5 katori = 0.5x
     */

    const multiplier =
        quantity;


    return {

        calories:
            nutrition.calories *
            multiplier,

        protein:
            nutrition.protein *
            multiplier,

        carbs:
            nutrition.carbs *
            multiplier,

        fats:
            nutrition.fats *
            multiplier,

        fiber:
            nutrition.fiber *
            multiplier,

        sodium:
            nutrition.sodium *
            multiplier,

        potassium:
            nutrition.potassium *
            multiplier,

        calcium:
            nutrition.calcium *
            multiplier,

        iron:
            nutrition.iron *
            multiplier,

        vitaminC:
            nutrition.vitaminC *
            multiplier,

        foodName:
            food.name,

        unit,

        quantity

    };

}


/* ---------------------------------------------------------------------
   UPDATE PREVIEW
--------------------------------------------------------------------- */

function updateManualFoodNutrition() {

    const nutrition =
        calculateManualFood();


    if (!nutrition) {

        setManualNutritionValues({

            calories:
                0,

            protein:
                0,

            carbs:
                0,

            fats:
                0,

            fiber:
                0,

            sodium:
                0,

            potassium:
                0,

            calcium:
                0,

            iron:
                0,

            vitaminC:
                0

        });


        return;

    }


    setManualNutritionValues(
        nutrition
    );

}


/* ---------------------------------------------------------------------
   SET NUTRITION VALUES
--------------------------------------------------------------------- */

function setManualNutritionValues(
    nutrition
) {

    setText(
        'manualCalories',
        Math.round(
            nutrition.calories
        )
    );


    setText(
        'manualProtein',
        `${nutrition.protein.toFixed(1)}g`
    );


    setText(
        'manualCarbs',
        `${nutrition.carbs.toFixed(1)}g`
    );


    setText(
        'manualFats',
        `${nutrition.fats.toFixed(1)}g`
    );


    setText(
        'manualFiber',
        `${nutrition.fiber.toFixed(1)}g`
    );


    setText(
        'manualSodium',
        `${Math.round(
            nutrition.sodium
        )}mg`
    );


    setText(
        'manualPotassium',
        `${Math.round(
            nutrition.potassium
        )}mg`
    );


    setText(
        'manualCalcium',
        `${Math.round(
            nutrition.calcium
        )}mg`
    );


    setText(
        'manualIron',
        `${nutrition.iron.toFixed(1)}mg`
    );


    setText(
        'manualVitaminC',
        `${nutrition.vitaminC.toFixed(1)}mg`
    );

}


/* ---------------------------------------------------------------------
   ADD MANUAL FOOD
--------------------------------------------------------------------- */

function addManualFood(event) {

    event.preventDefault();


    const nutrition =
        calculateManualFood();


    if (!nutrition) {

        return;

    }


    const foodName =
        nutrition.foodName;


    const unitLabel =
        getFoodUnitLabel(
            nutrition.unit
        );


    dashboardState
        .meals[
            dashboardState.activeMeal
        ]
        .push({

            id:
                Date.now(),

            name:
                `${foodName} (${nutrition.quantity} ${unitLabel})`,

            calories:
                Math.round(
                    nutrition.calories
                ),

            protein:
                Number(
                    nutrition.protein
                        .toFixed(1)
                ),

            carbs:
                Number(
                    nutrition.carbs
                        .toFixed(1)
                ),

            fats:
                Number(
                    nutrition.fats
                        .toFixed(1)
                )

        });


    renderMealLog();


    updateDashboardTotals();


    closeManualFoodModal();


    resetManualFoodForm();

}


/* ---------------------------------------------------------------------
   FRIENDLY UNIT
--------------------------------------------------------------------- */

function getFoodUnitLabel(unit) {

    const labels = {

        serving:
            'serving',

        katori:
            'katori',

        bowl:
            'bowl',

        cup:
            'cup',

        glass:
            'glass',

        roti:
            'roti',

        chapati:
            'chapati',

        piece:
            'piece',

        tablespoon:
            'tablespoon',

        teaspoon:
            'teaspoon'

    };


    return (
        labels[unit] ||
        unit
    );

}


/* ---------------------------------------------------------------------
   RESET MANUAL FOOD
--------------------------------------------------------------------- */

function resetManualFoodForm() {

    const form =
        document.getElementById(
            'manualFoodForm'
        );


    if (form) {
        form.reset();
    }


    manualFoodState.selectedFood =
        '';


    document.getElementById(
        'manualFoodSelect'
    ).innerHTML = `

        <option value="">
            Select a food
        </option>

    `;


    setManualNutritionValues({

        calories:
            0,

        protein:
            0,

        carbs:
            0,

        fats:
            0,

        fiber:
            0,

        sodium:
            0,

        potassium:
            0,

        calcium:
            0,

        iron:
            0,

        vitaminC:
            0

    });

}


/* =====================================================================
   UTILITIES
===================================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


function setStyle(
    id,
    property,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.style.setProperty(
            property,
            value
        );

    }

}


function setStyleWidth(
    id,
    percentage
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.style.width =
            `${percentage}%`;

    }

}


function formatNumber(
    number
) {

    return Number(
        number
    ).toLocaleString(
        'en-US'
    );

}


function capitalize(
    value
) {

    if (!value) {
        return '';
    }


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


function escapeHTML(
    value
) {

    const div =
        document.createElement(
            'div'
        );


    div.textContent =
        String(value);


    return div.innerHTML;

}