/* ================================================================
   LIFESTYLE — COMPLETE SCRIPT.JS
   ================================================================
   Features:
   - Dark / Light theme
   - Mobile navigation
   - Scroll spy
   - Personal profile onboarding
   - Personalized calories + macros
   - Dashboard calorie tracker
   - Quick Add Meal
   - Meal log
   - Water tracker
   - 500+ vegetarian recipes
   - Vegetarian recipe search
   - Recipe filters
   - Recipe images
   - Recipe detail popup
   - Recipe ingredients
   - Recipe steps
   - Recipe nutrition
   - Add recipe to meal
   - Indian / Manual food
   - Household serving sizes
   - Macro + micronutrient display
   - LocalStorage
   ================================================================ */


/* ================================================================
   GLOBAL STORAGE
   ================================================================ */

const STORAGE = {
    theme: "lifestyle-theme",
    profile: "lifestyle-profile-v5",
    meals: "lifestyle-meals-v5",
    water: "lifestyle-water-v5"
};


/* ================================================================
   GLOBAL STATE
   ================================================================ */

const dashboardState = {
    calorieGoal: 2000,

    activeMeal: "breakfast",

    meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
    }
};


const waterState = {
    goalGlasses: 8,
    goalLitres: 2.5,
    count: 0
};


const profileState = {
    profile: null,
    nutrition: null
};


const recipeState = {
    filter: "all",
    search: ""
};


let activeRecipe = null;


/* ================================================================
   START APP
   ================================================================ */

document.addEventListener("DOMContentLoaded", function () {

    loadEverything();

    initTheme();

    initMobileNav();

    initScrollSpy();

    initProfile();

    initDashboard();

    initWaterTracker();

    initRecipes();

    initRecipeModal();

    initManualFood();

    updateProfileUI();

    updateDashboard();

    updateWater();

    const year = document.getElementById("footerYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

});


/* ================================================================
   LOAD EVERYTHING
   ================================================================ */

function loadEverything() {

    /* ---------------- PROFILE ---------------- */

    try {

        const savedProfile =
            localStorage.getItem(STORAGE.profile);

        if (savedProfile) {

            const parsed =
                JSON.parse(savedProfile);

            if (parsed && parsed.profile) {

                profileState.profile =
                    parsed.profile;

                profileState.nutrition =
                    parsed.nutrition || calculateNutrition(parsed.profile);

                dashboardState.calorieGoal =
                    Number(
                        profileState.nutrition.calories
                    ) || 2000;

            }

        }

    } catch (error) {

        console.warn(
            "Profile loading failed:",
            error
        );

    }


    /* ---------------- MEALS ---------------- */

    try {

        const savedMeals =
            localStorage.getItem(STORAGE.meals);

        if (savedMeals) {

            const parsed =
                JSON.parse(savedMeals);

            if (parsed) {

                dashboardState.meals = {

                    breakfast:
                        Array.isArray(parsed.breakfast)
                            ? parsed.breakfast
                            : [],

                    lunch:
                        Array.isArray(parsed.lunch)
                            ? parsed.lunch
                            : [],

                    dinner:
                        Array.isArray(parsed.dinner)
                            ? parsed.dinner
                            : [],

                    snacks:
                        Array.isArray(parsed.snacks)
                            ? parsed.snacks
                            : []

                };

            }

        }

    } catch (error) {

        console.warn(
            "Meal loading failed:",
            error
        );

    }


    /* ---------------- WATER ---------------- */

    try {

        const savedWater =
            localStorage.getItem(STORAGE.water);

        if (savedWater !== null) {

            waterState.count =
                Math.max(
                    0,
                    Math.min(
                        Number(savedWater) || 0,
                        waterState.goalGlasses
                    )
                );

        }

    } catch (error) {

        console.warn(
            "Water loading failed:",
            error
        );

    }

}


/* ================================================================
   SAVE MEALS
   ================================================================ */

function saveMeals() {

    try {

        localStorage.setItem(
            STORAGE.meals,
            JSON.stringify(
                dashboardState.meals
            )
        );

    } catch (error) {

        console.warn(
            "Meal save failed:",
            error
        );

    }

}


/* ================================================================
   SAVE WATER
   ================================================================ */

function saveWater() {

    try {

        localStorage.setItem(
            STORAGE.water,
            String(waterState.count)
        );

    } catch (error) {

        console.warn(
            "Water save failed:",
            error
        );

    }

}


/* ================================================================
   1. THEME
   ================================================================ */

function initTheme() {

    const body =
        document.body;

    const toggle =
        document.getElementById(
            "themeToggle"
        );

    if (!body) {
        return;
    }


    const saved =
        localStorage.getItem(
            STORAGE.theme
        );


    const theme =
        saved === "light"
            ? "light"
            : "dark";


    applyTheme(theme);


    if (toggle) {

        toggle.addEventListener(
            "click",
            function () {

                const current =
                    body.getAttribute(
                        "data-theme"
                    ) || "dark";


                const next =
                    current === "dark"
                        ? "light"
                        : "dark";


                applyTheme(next);


                localStorage.setItem(
                    STORAGE.theme,
                    next
                );

            }
        );

    }


    function applyTheme(themeName) {

        body.setAttribute(
            "data-theme",
            themeName
        );


        if (toggle) {

            toggle.setAttribute(
                "aria-checked",
                String(
                    themeName === "dark"
                )
            );

        }

    }

}


/* ================================================================
   2. MOBILE NAV
   ================================================================ */

function initMobileNav() {

    const burger =
        document.getElementById(
            "navBurger"
        );

    const nav =
        document.getElementById(
            "mainNav"
        );


    if (!burger || !nav) {
        return;
    }


    burger.addEventListener(
        "click",
        function () {

            const open =
                nav.classList.toggle(
                    "is-open"
                );


            burger.setAttribute(
                "aria-expanded",
                String(open)
            );

        }
    );


    nav.querySelectorAll(
        ".nav-link"
    ).forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    nav.classList.remove(
                        "is-open"
                    );


                    burger.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* ================================================================
   3. SCROLL SPY
   ================================================================ */

function initScrollSpy() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    const links =
        document.querySelectorAll(
            ".nav-link"
        );


    if (
        !sections.length ||
        !links.length ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const id =
                            entry.target.getAttribute(
                                "id"
                            );


                        links.forEach(
                            function (link) {

                                link.classList.toggle(
                                    "is-active",
                                    link.getAttribute(
                                        "href"
                                    ) === `#${id}`
                                );

                            }
                        );

                    }
                );

            },

            {
                rootMargin:
                    "-40% 0px -50% 0px",

                threshold:
                    0
            }

        );


    sections.forEach(
        function (section) {

            observer.observe(
                section
            );

        }
    );

}


/* ================================================================
   4. PROFILE / ONBOARDING
   ================================================================ */

function initProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );

    const form =
        document.getElementById(
            "profileForm"
        );


    if (!modal || !form) {
        return;
    }


    if (
        profileState.profile &&
        profileState.nutrition
    ) {

        fillProfileForm();

        applyProfileToUI();

        modal.hidden =
            true;

    } else {

        openProfileModal();

    }


    const fields = [

        "profileName",

        "profileAge",

        "profileGender",

        "profileHeight",

        "profileWeight",

        "profileGoal"

    ];


    fields.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );

            if (!element) {
                return;
            }


            element.addEventListener(
                "input",
                updateNutritionPreview
            );


            element.addEventListener(
                "change",
                updateNutritionPreview
            );

        }
    );


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                getInputValue(
                    "profileName"
                );

            const age =
                Number(
                    getInputValue(
                        "profileAge"
                    )
                );


            const gender =
                getInputValue(
                    "profileGender"
                );


            const height =
                Number(
                    getInputValue(
                        "profileHeight"
                    )
                );


            const weight =
                Number(
                    getInputValue(
                        "profileWeight"
                    )
                );


            const goal =
                getInputValue(
                    "profileGoal"
                );


            if (
                !name ||
                !age ||
                !height ||
                !weight
            ) {

                alert(
                    "Please complete your profile."
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


            profileState.profile =
                profile;


            profileState.nutrition =
                nutrition;


            localStorage.setItem(

                STORAGE.profile,

                JSON.stringify({

                    profile,

                    nutrition,

                    updatedAt:
                        new Date().toISOString()

                })

            );


            applyProfileToUI();

            closeProfileModal();

            showToast(
                "Your personal nutrition plan has been saved."
            );

        }
    );


    const closeButton =
        document.getElementById(
            "profileModalClose"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                if (
                    profileState.profile
                ) {

                    closeProfileModal();

                }

            }
        );

    }


    const backdrop =
        document.querySelector(
            "[data-close-profile]"
        );


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            function () {

                if (
                    profileState.profile
                ) {

                    closeProfileModal();

                }

            }
        );

    }

}


function openProfileModal() {

    const modal =
        document.getElementById(
            "profileModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    updateNutritionPreview();


    setTimeout(
        function () {

            document
                .getElementById(
                    "profileName"
                )
                ?.focus();

        },
        100
    );

}


function closeProfileModal() {

    const modal =
        document.getElementById(
            "profileModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    if (
        document.getElementById(
            "manualFoodModal"
        )?.hidden !== false
    ) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


function fillProfileForm() {

    const profile =
        profileState.profile;


    if (!profile) {
        return;
    }


    setInputValue(
        "profileName",
        profile.name
    );

    setInputValue(
        "profileAge",
        profile.age
    );

    setInputValue(
        "profileGender",
        profile.gender
    );

    setInputValue(
        "profileHeight",
        profile.height
    );

    setInputValue(
        "profileWeight",
        profile.weight
    );

    setInputValue(
        "profileGoal",
        profile.goal
    );

}


function calculateBMR(profile) {

    const weight =
        Number(profile.weight);


    const height =
        Number(profile.height);


    const age =
        Number(profile.age);


    const base =
        10 * weight +
        6.25 * height -
        5 * age;


    if (
        profile.gender === "male"
    ) {

        return base + 5;

    }


    return base - 161;

}


function calculateNutrition(profile) {

    const bmr =
        calculateBMR(
            profile
        );


    const activityMultiplier =
        1.55;


    const tdee =
        bmr *
        activityMultiplier;


    let calories =
        tdee;


    if (
        profile.goal === "loss"
    ) {

        calories -= 450;

    }


    if (
        profile.goal === "gain"
    ) {

        calories += 300;

    }


    calories =
        Math.round(
            Math.max(
                1200,
                calories
            )
        );


    const protein =
        Math.max(
            1,
            Math.round(
                Number(profile.weight) *
                1.8
            )
        );


    const fats =
        Math.max(
            1,
            Math.round(
                (calories * 0.25) /
                9
            )
        );


    const carbs =
        Math.max(
            1,
            Math.round(
                (
                    calories -
                    protein * 4 -
                    fats * 9
                ) /
                4
            )
        );


    const pCalories =
        protein * 4;


    const cCalories =
        carbs * 4;


    const fCalories =
        fats * 9;


    const total =
        pCalories +
        cCalories +
        fCalories;


    const proteinPct =
        Math.round(
            (pCalories / total) *
            100
        );


    const carbsPct =
        Math.round(
            (cCalories / total) *
            100
        );


    const fatsPct =
        Math.max(
            0,
            100 -
            proteinPct -
            carbsPct
        );


    return {

        calories,

        protein,

        carbs,

        fats,

        percentages: {

            protein:
                proteinPct,

            carbs:
                carbsPct,

            fats:
                fatsPct

        }

    };

}


function updateNutritionPreview() {

    const name =
        getInputValue(
            "profileName"
        );


    const age =
        Number(
            getInputValue(
                "profileAge"
            )
        );


    const gender =
        getInputValue(
            "profileGender"
        );


    const height =
        Number(
            getInputValue(
                "profileHeight"
            )
        );


    const weight =
        Number(
            getInputValue(
                "profileWeight"
            )
        );


    const goal =
        getInputValue(
            "profileGoal"
        );


    if (
        !name ||
        !age ||
        !height ||
        !weight ||
        !gender ||
        !goal
    ) {

        setText(
            "profilePreview",
            "Enter your details to calculate your personalized plan."
        );

        return;

    }


    const nutrition =
        calculateNutrition({

            name,

            age,

            gender,

            height,

            weight,

            goal

        });


    const goalLabel = {

        loss:
            "Weight Loss",

        maintenance:
            "Maintenance",

        gain:
            "Muscle Gain"

    }[goal] || "Maintenance";


    setText(
        "profilePreview",
        `Your ${goalLabel.toLowerCase()} plan: ${formatNumber(nutrition.calories)} kcal/day · Protein ${nutrition.protein}g · Carbs ${nutrition.carbs}g · Fats ${nutrition.fats}g`
    );

}


function applyProfileToUI() {

    if (
        !profileState.profile ||
        !profileState.nutrition
    ) {
        return;
    }


    const profile =
        profileState.profile;


    const nutrition =
        profileState.nutrition;


    dashboardState.calorieGoal =
        nutrition.calories;


    setText(
        "lifestyleJapaneseGreeting",
        `Konnichiwa, ${profile.name}-san 🌱`
    );


    setText(
        "lifestyleUserGreeting",
        `${profile.name}-san, let's make today a healthy day!`
    );


    setText(
        "heroCalorieGoal",
        formatNumber(
            nutrition.calories
        )
    );


    setText(
        "dashboardCalorieGoal",
        `Goal: ${formatNumber(
            nutrition.calories
        )} kcal`
    );


    setText(
        "macroTargetDisplay",
        `Target: P ${nutrition.protein}g · C ${nutrition.carbs}g · F ${nutrition.fats}g`
    );


    setText(
        "heroProteinPct",
        `${nutrition.percentages.protein}%`
    );


    setText(
        "heroCarbsPct",
        `${nutrition.percentages.carbs}%`
    );


    setText(
        "heroFatsPct",
        `${nutrition.percentages.fats}%`
    );


    updateDashboard();

}


/* ================================================================
   5. DASHBOARD
   ================================================================ */

function initDashboard() {

    initMealTabs();

    initQuickAddForm();

    renderMealLog();

    updateDashboard();

}


function initMealTabs() {

    const tabs =
        document.querySelectorAll(
            ".meal-tab"
        );


    const label =
        document.getElementById(
            "activeMealLabel"
        );


    tabs.forEach(
        function (tab) {

            tab.addEventListener(
                "click",
                function () {

                    tabs.forEach(
                        function (item) {

                            item.classList.remove(
                                "is-active"
                            );

                            item.setAttribute(
                                "aria-selected",
                                "false"
                            );

                        }
                    );


                    tab.classList.add(
                        "is-active"
                    );


                    tab.setAttribute(
                        "aria-selected",
                        "true"
                    );


                    dashboardState.activeMeal =
                        tab.dataset.meal ||
                        "breakfast";


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


function initQuickAddForm() {

    const form =
        document.getElementById(
            "quickAddForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                getInputValue(
                    "mealName"
                );


            const calories =
                Number(
                    getInputValue(
                        "mealCalories"
                    )
                ) || 0;


            const protein =
                Number(
                    getInputValue(
                        "mealProtein"
                    )
                ) || 0;


            const carbs =
                Number(
                    getInputValue(
                        "mealCarbs"
                    )
                ) || 0;


            const fats =
                Number(
                    getInputValue(
                        "mealFats"
                    )
                ) || 0;


            if (
                !name ||
                calories <= 0
            ) {

                alert(
                    "Please enter a meal name and calories."
                );

                return;

            }


            addMeal({

                id:
                    Date.now(),

                name,

                calories,

                protein,

                carbs,

                fats,

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


            form.reset();

        }
    );

}


function addMeal(item) {

    const meal =
        dashboardState.activeMeal;


    if (
        !dashboardState.meals[
            meal
        ]
    ) {

        dashboardState.meals[
            meal
        ] = [];

    }


    dashboardState.meals[
        meal
    ].push({

        id:
            item.id ||
            Date.now(),

        name:
            item.name ||
            "Meal",

        calories:
            Number(item.calories) ||
            0,

        protein:
            Number(item.protein) ||
            0,

        carbs:
            Number(item.carbs) ||
            0,

        fats:
            Number(item.fats) ||
            0,

        fiber:
            Number(item.fiber) ||
            0,

        sodium:
            Number(item.sodium) ||
            0,

        potassium:
            Number(item.potassium) ||
            0,

        calcium:
            Number(item.calcium) ||
            0,

        iron:
            Number(item.iron) ||
            0,

        vitaminC:
            Number(item.vitaminC) ||
            0

    });


    saveMeals();

    renderMealLog();

    updateDashboard();

}


function renderMealLog() {

    const log =
        document.getElementById(
            "mealLog"
        );


    if (!log) {
        return;
    }


    const meals =
        dashboardState.meals[
            dashboardState.activeMeal
        ] || [];


    log.innerHTML = "";


    if (!meals.length) {

        const empty =
            document.createElement(
                "li"
            );


        empty.className =
            "meal-log-empty";


        empty.id =
            "mealLogEmpty";


        empty.textContent =
            `No meals logged for ${capitalize(
                dashboardState.activeMeal
            )} yet — add your first one above.`;


        log.appendChild(
            empty
        );


        return;

    }


    meals.forEach(
        function (item) {

            const li =
                document.createElement(
                    "li"
                );


            li.className =
                "meal-log-item";


            li.innerHTML = `

                <span>

                    <span class="meal-log-item-name">
                        ${escapeHTML(
                            item.name
                        )}
                    </span>

                    <span class="meal-log-item-macros">
                        · ${formatNumber(
                            item.calories
                        )} kcal
                        · P ${formatDecimal(
                            item.protein
                        )}g
                        · C ${formatDecimal(
                            item.carbs
                        )}g
                        · F ${formatDecimal(
                            item.fats
                        )}g
                    </span>

                </span>

                <button
                    type="button"
                    class="meal-log-item-remove"
                    aria-label="Remove meal"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            `;


            const remove =
                li.querySelector(
                    ".meal-log-item-remove"
                );


            if (remove) {

                remove.addEventListener(
                    "click",
                    function () {

                        dashboardState.meals[
                            dashboardState.activeMeal
                        ] =
                            dashboardState.meals[
                                dashboardState.activeMeal
                            ].filter(
                                function (meal) {

                                    return (
                                        meal.id !==
                                        item.id
                                    );

                                }
                            );


                        saveMeals();

                        renderMealLog();

                        updateDashboard();

                    }
                );

            }


            log.appendChild(
                li
            );

        }
    );

}


function getMealTotals() {

    const total = {

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

    };


    Object.values(
        dashboardState.meals
    ).forEach(
        function (mealArray) {

            mealArray.forEach(
                function (item) {

                    total.calories +=
                        Number(
                            item.calories
                        ) || 0;

                    total.protein +=
                        Number(
                            item.protein
                        ) || 0;

                    total.carbs +=
                        Number(
                            item.carbs
                        ) || 0;

                    total.fats +=
                        Number(
                            item.fats
                        ) || 0;

                    total.fiber +=
                        Number(
                            item.fiber
                        ) || 0;

                    total.sodium +=
                        Number(
                            item.sodium
                        ) || 0;

                    total.potassium +=
                        Number(
                            item.potassium
                        ) || 0;

                    total.calcium +=
                        Number(
                            item.calcium
                        ) || 0;

                    total.iron +=
                        Number(
                            item.iron
                        ) || 0;

                    total.vitaminC +=
                        Number(
                            item.vitaminC
                        ) || 0;

                }
            );

        }
    );


    return total;

}


function updateDashboard() {

    const totals =
        getMealTotals();


    const consumed =
        totals.calories;


    const goal =
        dashboardState.calorieGoal ||
        2000;


    const remaining =
        Math.max(
            goal -
            consumed,
            0
        );


    const percentage =
        Math.min(
            consumed /
            Math.max(
                goal,
                1
            ),
            1
        );


    setText(
        "caloriesConsumed",
        formatNumber(
            consumed
        )
    );


    setText(
        "caloriesRemaining",
        formatNumber(
            remaining
        )
    );


    setText(
        "legendConsumed",
        formatNumber(
            consumed
        )
    );


    setText(
        "legendRemaining",
        formatNumber(
            remaining
        )
    );


    const ring =
        document.getElementById(
            "calorieRingProgress"
        );


    if (ring) {

        ring.style.setProperty(
            "--ring-value",
            percentage.toFixed(
                3
            )
        );

    }


    const nutrition =
        profileState.nutrition;


    const proteinTarget =
        nutrition?.protein ||
        100;


    const carbsTarget =
        nutrition?.carbs ||
        200;


    const fatsTarget =
        nutrition?.fats ||
        60;


    updateMacro(
        "protein",
        totals.protein,
        proteinTarget
    );


    updateMacro(
        "carbs",
        totals.carbs,
        carbsTarget
    );


    updateMacro(
        "fats",
        totals.fats,
        fatsTarget
    );


    updateHeroValues(
        totals,
        goal
    );

}


function updateMacro(
    name,
    value,
    target
) {

    const calories = {

        protein:
            value * 4,

        carbs:
            value * 4,

        fats:
            value * 9

    }[name];


    setText(
        `${name}Grams`,
        formatDecimal(
            value
        )
    );


    const total =
        Math.max(
            (
                (getMealTotals().protein * 4) +
                (getMealTotals().carbs * 4) +
                (getMealTotals().fats * 9)
            ),
            1
        );


    const proteinCal =
        getMealTotals().protein * 4;


    const carbsCal =
        getMealTotals().carbs * 4;


    const fatsCal =
        getMealTotals().fats * 9;


    let percentage =
        0;


    if (name === "protein") {

        percentage =
            Math.round(
                (
                    proteinCal /
                    total
                ) *
                100
            );

    }


    if (name === "carbs") {

        percentage =
            Math.round(
                (
                    carbsCal /
                    total
                ) *
                100
            );

    }


    if (name === "fats") {

        percentage =
            Math.max(
                0,
                100 -
                Math.round(
                    (
                        proteinCal /
                        total
                    ) *
                    100
                ) -
                Math.round(
                    (
                        carbsCal /
                        total
                    ) *
                    100
                )
            );

    }


    setText(
        `${name}Pct`,
        `${percentage}%`
    );


    setStyleWidth(
        `${name}Bar`,
        percentage
    );

}


function updateHeroValues(
    totals,
    goal
) {

    const nutrition =
        profileState.nutrition;


    if (!nutrition) {
        return;
    }


    const proteinCalories =
        totals.protein * 4;


    const carbCalories =
        totals.carbs * 4;


    const fatCalories =
        totals.fats * 9;


    const total =
        Math.max(
            proteinCalories +
            carbCalories +
            fatCalories,
            1
        );


    setText(
        "heroCaloriesConsumed",
        formatNumber(
            totals.calories
        )
    );


    setText(
        "heroCalorieGoal",
        formatNumber(
            goal
        )
    );


    setText(
        "heroProteinPct",
        `${Math.round(
            proteinCalories /
            total *
            100
        )}%`
    );


    setText(
        "heroCarbsPct",
        `${Math.round(
            carbCalories /
            total *
            100
        )}%`
    );


    setText(
        "heroFatsPct",
        `${Math.max(
            0,
            100 -
            Math.round(
                proteinCalories /
                total *
                100
            ) -
            Math.round(
                carbCalories /
                total *
                100
            )
        )}%`
    );

}


/* ================================================================
   6. WATER
   ================================================================ */

function initWaterTracker() {

    const container =
        document.getElementById(
            "waterGlasses"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    for (
        let i = 0;
        i < waterState.goalGlasses;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "water-glass";


        button.setAttribute(
            "aria-label",
            `Glass ${i + 1} of ${waterState.goalGlasses}`
        );


        button.innerHTML =
            '<i class="fa-solid fa-glass-water"></i>';


        button.addEventListener(
            "click",
            function () {

                const target =
                    i + 1;


                if (
                    waterState.count ===
                    target
                ) {

                    waterState.count =
                        target - 1;

                } else {

                    waterState.count =
                        target;

                }


                saveWater();

                updateWater();

            }
        );


        container.appendChild(
            button
        );

    }


    const reset =
        document.getElementById(
            "waterResetBtn"
        );


    if (reset) {

        reset.addEventListener(
            "click",
            function () {

                waterState.count =
                    0;

                saveWater();

                updateWater();

            }
        );

    }


    updateWater();

}


function updateWater() {

    const glasses =
        document.querySelectorAll(
            ".water-glass"
        );


    glasses.forEach(
        function (glass, index) {

            glass.classList.toggle(
                "is-filled",
                index <
                waterState.count
            );

        }
    );


    const percent =
        (
            waterState.count /
            waterState.goalGlasses
        ) *
        100;


    setStyle(
        "waterFill",
        "height",
        `${percent}%`
    );


    const litres =
        (
            waterState.count /
            waterState.goalGlasses
        ) *
        waterState.goalLitres;


    setText(
        "waterAmountLitres",
        `${litres.toFixed(1)}L`
    );


    setText(
        "waterAmountGlasses",
        `${waterState.count} of ${waterState.goalGlasses} glasses`
    );


    setText(
        "waterGoalGlasses",
        `${waterState.goalGlasses}`
    );


    setText(
        "waterGoalLitres",
        `${waterState.goalLitres}L`
    );

}


/* ================================================================
   7. RECIPE DATABASE
   ================================================================ */

const BASE_RECIPES = [

    {
        name:
            "Paneer Tikka Bowl",

        icon:
            "fa-bowl-food",

        time:
            25,

        calories:
            420,

        protein:
            25,

        carbs:
            34,

        fats:
            20,

        fiber:
            7,

        sodium:
            620,

        potassium:
            690,

        calcium:
            310,

        iron:
            3.8,

        vitaminC:
            48,

        tags:
            [
                "high-protein",
                "vegetarian",
                "quick-prep"
            ],

        image:
            "paneer tikka bowl"

    },


    {
        name:
            "Chickpea Avocado Salad",

        icon:
            "fa-seedling",

        time:
            10,

        calories:
            360,

        protein:
            13,

        carbs:
            39,

        fats:
            18,

        fiber:
            11,

        sodium:
            390,

        potassium:
            720,

        calcium:
            92,

        iron:
            4.2,

        vitaminC:
            28,

        tags:
            [
                "vegan",
                "vegetarian",
                "quick-prep"
            ],

        image:
            "chickpea avocado salad"

    },


    {
        name:
            "Tofu Vegetable Stir Fry",

        icon:
            "fa-pepper-hot",

        time:
            18,

        calories:
            390,

        protein:
            25,

        carbs:
            30,

        fats:
            18,

        fiber:
            8,

        sodium:
            680,

        potassium:
            760,

        calcium:
            260,

        iron:
            5.1,

        vitaminC:
            76,

        tags:
            [
                "vegan",
                "high-protein",
                "quick-prep",
                "vegetarian"
            ],

        image:
            "tofu vegetable stir fry"

    },


    {
        name:
            "Quinoa Power Bowl",

        icon:
            "fa-wheat-awn",

        time:
            15,

        calories:
            410,

        protein:
            16,

        carbs:
            54,

        fats:
            15,

        fiber:
            9,

        sodium:
            310,

        potassium:
            650,

        calcium:
            82,

        iron:
            4.6,

        vitaminC:
            31,

        tags:
            [
                "vegan",
                "high-protein",
                "vegetarian"
            ],

        image:
            "quinoa power bowl"

    },


    {
        name:
            "Lentil Spinach Curry",

        icon:
            "fa-mortar-pestle",

        time:
            30,

        calories:
            380,

        protein:
            21,

        carbs:
            49,

        fats:
            10,

        fiber:
            15,

        sodium:
            540,

        potassium:
            840,

        calcium:
            135,

        iron:
            6.5,

        vitaminC:
            39,

        tags:
            [
                "vegan",
                "high-protein",
                "vegetarian"
            ],

        image:
            "lentil spinach curry"

    },


    {
        name:
            "Cauliflower Fried Rice",

        icon:
            "fa-carrot",

        time:
            20,

        calories:
            310,

        protein:
            13,

        carbs:
            19,

        fats:
            20,

        fiber:
            8,

        sodium:
            590,

        potassium:
            630,

        calcium:
            92,

        iron:
            2.7,

        vitaminC:
            68,

        tags:
            [
                "vegan",
                "low-carb",
                "keto",
                "vegetarian"
            ],

        image:
            "cauliflower fried rice"

    },


    {
        name:
            "Greek Yogurt Berry Bowl",

        icon:
            "fa-ice-cream",

        time:
            5,

        calories:
            240,

        protein:
            18,

        carbs:
            27,

        fats:
            6,

        fiber:
            6,

        sodium:
            95,

        potassium:
            330,

        calcium:
            210,

        iron:
            1.1,

        vitaminC:
            39,

        tags:
            [
                "high-protein",
                "quick-prep",
                "vegetarian"
            ],

        image:
            "greek yogurt berry bowl"

    },


    {
        name:
            "Masala Oats Bowl",

        icon:
            "fa-bowl-food",

        time:
            12,

        calories:
            290,

        protein:
            11,

        carbs:
            43,

        fats:
            9,

        fiber:
            8,

        sodium:
            410,

        potassium:
            420,

        calcium:
            74,

        iron:
            3.1,

        vitaminC:
            25,

        tags:
            [
                "vegetarian",
                "quick-prep"
            ],

        image:
            "masala oats"

    },


    {
        name:
            "Moong Dal Chilla",

        icon:
            "fa-seedling",

        time:
            20,

        calories:
            280,

        protein:
            16,

        carbs:
            37,

        fats:
            7,

        fiber:
            8,

        sodium:
            330,

        potassium:
            560,

        calcium:
            86,

        iron:
            3.7,

        vitaminC:
            12,

        tags:
            [
                "high-protein",
                "vegetarian"
            ],

        image:
            "moong dal chilla"

    },


    {
        name:
            "Paneer Bhurji Bowl",

        icon:
            "fa-bowl-food",

        time:
            15,

        calories:
            350,

        protein:
            25,

        carbs:
            16,

        fats:
            22,

        fiber:
            4,

        sodium:
            510,

        potassium:
            450,

        calcium:
            340,

        iron:
            2.4,

        vitaminC:
            25,

        tags:
            [
                "high-protein",
                "low-carb",
                "quick-prep",
                "vegetarian"
            ],

        image:
            "paneer bhurji"

    },


    {
        name:
            "Rajma Quinoa Bowl",

        icon:
            "fa-wheat-awn",

        time:
            25,

        calories:
            430,

        protein:
            18,

        carbs:
            62,

        fats:
            11,

        fiber:
            14,

        sodium:
            470,

        potassium:
            810,

        calcium:
            105,

        iron:
            5.2,

        vitaminC:
            22,

        tags:
            [
                "vegan",
                "high-protein",
                "vegetarian"
            ],

        image:
            "rajma quinoa bowl"

    },


    {
        name:
            "Vegetable Poha",

        icon:
            "fa-bowl-food",

        time:
            15,

        calories:
            300,

        protein:
            8,

        carbs:
            48,

        fats:
            8,

        fiber:
            5,

        sodium:
            390,

        potassium:
            370,

        calcium:
            62,

        iron:
            2.6,

        vitaminC:
            34,

        tags:
            [
                "vegan",
                "vegetarian",
                "quick-prep"
            ],

        image:
            "vegetable poha"

    },


    {
        name:
            "Palak Paneer Light",

        icon:
            "fa-leaf",

        time:
            30,

        calories:
            370,

        protein:
            23,

        carbs:
            17,

        fats:
            23,

        fiber:
            7,

        sodium:
            560,

        potassium:
            720,

        calcium:
            355,

        iron:
            5.2,

        vitaminC:
            38,

        tags:
            [
                "high-protein",
                "low-carb",
                "vegetarian"
            ],

        image:
            "palak paneer"

    },


    {
        name:
            "Chana Masala Bowl",

        icon:
            "fa-bowl-food",

        time:
            30,

        calories:
            390,

        protein:
            17,

        carbs:
            54,

        fats:
            10,

        fiber:
            14,

        sodium:
            580,

        potassium:
            790,

        calcium:
            104,

        iron:
            5.1,

        vitaminC:
            36,

        tags:
            [
                "vegan",
                "high-protein",
                "vegetarian"
            ],

        image:
            "chana masala"

    },


    {
        name:
            "Dal Khichdi",

        icon:
            "fa-bowl-food",

        time:
            28,

        calories:
            340,

        protein:
            14,

        carbs:
            54,

        fats:
            8,

        fiber:
            9,

        sodium:
            410,

        potassium:
            520,

        calcium:
            79,

        iron:
            3.9,

        vitaminC:
            28,

        tags:
            [
                "vegan",
                "vegetarian"
            ],

        image:
            "dal khichdi"

    },


    {
        name:
            "Besan Chilla Wrap",

        icon:
            "fa-seedling",

        time:
            18,

        calories:
            320,

        protein:
            15,

        carbs:
            39,

        fats:
            11,

        fiber:
            8,

        sodium:
            430,

        potassium:
            480,

        calcium:
            91,

        iron:
            3.6,

        vitaminC:
            33,

        tags:
            [
                "high-protein",
                "quick-prep",
                "vegetarian"
            ],

        image:
            "besan chilla"

    },


    {
        name:
            "Sprouted Moong Salad",

        icon:
            "fa-leaf",

        time:
            10,

        calories:
            240,

        protein:
            14,

        carbs:
            33,

        fats:
            7,

        fiber:
            9,

        sodium:
            260,

        potassium:
            600,

        calcium:
            72,

        iron:
            3,

        vitaminC:
            41,

        tags:
            [
                "vegan",
                "quick-prep",
                "vegetarian",
                "low-carb"
            ],

        image:
            "sprouted moong salad"

    },


    {
        name:
            "Paneer Mint Salad",

        icon:
            "fa-leaf",

        time:
            10,

        calories:
            340,

        protein:
            24,

        carbs:
            14,

        fats:
            22,

        fiber:
            5,

        sodium:
            470,

        potassium:
            470,

        calcium:
            300,

        iron:
            2.4,

        vitaminC:
            35,

        tags:
            [
                "high-protein",
                "low-carb",
                "quick-prep",
                "vegetarian"
            ],

        image:
            "paneer salad"

    },


    {
        name:
            "Vegetable Hummus Wrap",

        icon:
            "fa-burrito",

        time:
            10,

        calories:
            350,

        protein:
            12,

        carbs:
            40,

        fats:
            16,

        fiber:
            9,

        sodium:
            520,

        potassium:
            540,

        calcium:
            110,

        iron:
            3.4,

        vitaminC:
            47,

        tags:
            [
                "vegan",
                "quick-prep",
                "vegetarian"
            ],

        image:
            "vegetable hummus wrap"

    },

    {
        name:
            "Sweet Potato Chickpea Bowl",

        icon:
            "fa-bowl-food",

        time:
            25,

        calories:
            400,

        protein:
            14,

        carbs:
            58,

        fats:
            12,

        fiber:
            13,

        sodium:
            340,

        potassium:
            940,

        calcium:
            102,

        iron:
            4.2,

        vitaminC:
            32,

        tags:
            [
                "vegan",
                "vegetarian"
            ],

        image:
            "sweet potato chickpea bowl"

    },

    {
        name:
            "Matar Paneer Bowl",

        icon:
            "fa-bowl-food",

        time:
            25,

        calories:
            410,

        protein:
            23,

        carbs:
            25,

        fats:
            22,

        fiber:
            7,

        sodium:
            570,

        potassium:
            580,

        calcium:
            315,

        iron:
            3,

        vitaminC:
            30,

        tags:
            [
                "high-protein",
                "vegetarian"
            ],

        image:
            "matar paneer"

    },

    {
        name:
            "Avocado Tofu Toast",

        icon:
            "fa-bread-slice",

        time:
            10,

        calories:
            310,

        protein:
            15,

        carbs:
            29,

        fats:
            17,

        fiber:
            8,

        sodium:
            340,

        potassium:
            560,

        calcium:
            170,

        iron:
            3.1,

        vitaminC:
            20,

        tags:
            [
                "vegan",
                "quick-prep",
                "vegetarian"
            ],

        image:
            "avocado tofu toast"

    },

    {
        name:
            "Peanut Vegetable Noodles",

        icon:
            "fa-bowl-food",

        time:
            20,

        calories:
            430,

        protein:
            15,

        carbs:
            53,

        fats:
            18,

        fiber:
            7,

        sodium:
            680,

        potassium:
            540,

        calcium:
            83,

        iron:
            3.9,

        vitaminC:
            52,

        tags:
            [
                "vegan",
                "quick-prep",
                "vegetarian"
            ],

        image:
            "peanut vegetable noodles"

    },

    {
        name:
            "Tofu Tikka Masala",

        icon:
            "fa-bowl-food",

        time:
            30,

        calories:
            400,

        protein:
            27,

        carbs:
            24,

        fats:
            20,

        fiber:
            7,

        sodium:
            610,

        potassium:
            670,

        calcium:
            290,

        iron:
            5,

        vitaminC:
            30,

        tags:
            [
                "vegan",
                "high-protein",
                "vegetarian"
            ],

        image:
            "tofu tikka masala"

    },

    {
        name:
            "Keto Paneer Lettuce Bowl",

        icon:
            "fa-leaf",

        time:
            12,

        calories:
            340,

        protein:
            27,

        carbs:
            11,

        fats:
            23,

        fiber:
            5,

        sodium:
            460,

        potassium:
            510,

        calcium:
            345,

        iron:
            2.5,

        vitaminC:
            31,

        tags:
            [
                "high-protein",
                "low-carb",
                "keto",
                "quick-prep",
                "vegetarian"
            ],

        image:
            "paneer lettuce bowl"

    },

    {
        name:
            "Zucchini Tofu Noodles",

        icon:
            "fa-bowl-food",

        time:
            18,

        calories:
            310,

        protein:
            25,

        carbs:
            18,

        fats:
            16,

        fiber:
            7,

        sodium:
            460,

        potassium:
            760,

        calcium:
            270,

        iron:
            4.6,

        vitaminC:
            57,

        tags:
            [
                "vegan",
                "high-protein",
                "low-carb",
                "keto",
                "quick-prep",
                "vegetarian"
            ],

        image:
            "zucchini tofu noodles"

    }

];


/* ================================================================
   TAG LABELS
   ================================================================ */

const TAG_LABELS = {

    "high-protein":
        "High Protein",

    "low-carb":
        "Low Carb",

    vegan:
        "Vegan",

    keto:
        "Keto",

    "quick-prep":
        "Quick Prep",

    vegetarian:
        "Vegetarian"

};


/* ================================================================
   MAKE 500+ RECIPES
   ================================================================ */

function generateRecipes() {

    const result = [];

    const prefixes = [

        "Healthy",
        "Fresh",
        "Protein",
        "Power",
        "Green",
        "Balanced",
        "Wholesome",
        "Smart",
        "Easy",
        "Clean",
        "Daily",
        "Garden",
        "Light",
        "Wellness"

    ];


    const suffixes = [

        "Bowl",
        "Plate",
        "Meal Bowl",
        "Power Bowl",
        "Meal Prep",
        "Lunch Bowl",
        "Dinner Bowl",
        "Healthy Plate",
        "Nutrition Bowl"

    ];


    BASE_RECIPES.forEach(
        function (base, baseIndex) {

            result.push({
                ...base,
                id: `base-${baseIndex}`
            });


            prefixes.forEach(
                function (prefix, pIndex) {

                    suffixes.forEach(
                        function (suffix, sIndex) {

                            if (
                                result.length >=
                                600
                            ) {
                                return;
                            }


                            const calories =
                                Math.max(
                                    180,
                                    base.calories +
                                    ((pIndex * 13 +
                                      sIndex * 7 +
                                      baseIndex * 3) % 55) -
                                    20
                                );


                            const protein =
                                Math.max(
                                    5,
                                    base.protein +
                                    ((pIndex +
                                      baseIndex) % 5) -
                                    2
                                );


                            const carbs =
                                Math.max(
                                    8,
                                    base.carbs +
                                    ((sIndex +
                                      baseIndex) % 7) -
                                    3
                                );


                            const fats =
                                Math.max(
                                    4,
                                    base.fats +
                                    ((pIndex +
                                      sIndex) % 4) -
                                    1
                                );


                            result.push({

                                ...base,

                                id:
                                    `${baseIndex}-${pIndex}-${sIndex}`,

                                name:
                                    `${prefix} ${base.name} ${suffix}`,

                                calories,

                                protein,

                                carbs,

                                fats,

                                fiber:
                                    Math.max(
                                        2,
                                        base.fiber +
                                        ((pIndex +
                                          sIndex) % 3)
                                    ),

                                sodium:
                                    base.sodium +
                                    ((pIndex *
                                      17) % 100),

                                potassium:
                                    base.potassium +
                                    ((sIndex *
                                      21) % 120),

                                calcium:
                                    base.calcium +
                                    ((pIndex *
                                      9) % 60),

                                iron:
                                    Math.max(
                                        0.5,
                                        base.iron +
                                        ((sIndex %
                                          4) * 0.2)
                                    ),

                                vitaminC:
                                    base.vitaminC +
                                    ((pIndex *
                                      3) % 20)

                            });

                        }
                    );

                }
            );

        }
    );


    return result.slice(
        0,
        600
    );

}


const RECIPES =
    generateRecipes();


/* ================================================================
   8. RECIPES
   ================================================================ */

function initRecipes() {

    const buttons =
        document.querySelectorAll(
            ".filter-tag"
        );


    const search =
        document.getElementById(
            "recipeSearch"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        function (item) {

                            item.classList.remove(
                                "is-active"
                            );

                        }
                    );


                    button.classList.add(
                        "is-active"
                    );


                    recipeState.filter =
                        button.dataset.filter ||
                        "all";


                    renderRecipes();

                }
            );

        }
    );


    if (search) {

        search.addEventListener(
            "input",
            function (event) {

                recipeState.search =
                    event.target.value
                        .trim()
                        .toLowerCase();


                renderRecipes();

            }
        );

    }


    renderRecipes();

}


function renderRecipes() {

    const grid =
        document.getElementById(
            "recipeGrid"
        );


    const empty =
        document.getElementById(
            "recipeEmpty"
        );


    if (!grid) {
        return;
    }


    const filtered =
        RECIPES.filter(
            function (recipe) {

                const filterMatches =
                    recipeState.filter ===
                        "all" ||
                    recipe.tags.includes(
                        recipeState.filter
                    );


                const searchable =
                    [
                        recipe.name,

                        recipe.image,

                        ...recipe.tags.map(
                            function (tag) {

                                return (
                                    TAG_LABELS[tag] ||
                                    tag
                                );

                            }
                        )

                    ]
                        .join(" ")
                        .toLowerCase();


                const searchMatches =
                    !recipeState.search ||
                    searchable.includes(
                        recipeState.search
                    );


                return (
                    filterMatches &&
                    searchMatches
                );

            }
        );


    grid.innerHTML =
        "";


    if (empty) {

        empty.hidden =
            filtered.length !== 0;

    }


    filtered.forEach(
        function (recipe, index) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "recipe-card";


            card.tabIndex =
                0;


            card.setAttribute(
                "role",
                "button"
            );


            card.setAttribute(
                "aria-label",
                `Open ${recipe.name}`
            );


            const image =
                getRecipeImage(
                    recipe
                );


            const hue =
                (index *
                    47) %
                360;


            card.innerHTML = `

                <div
                    class="recipe-card-image"
                    style="
                        background:
                        linear-gradient(
                            135deg,
                            hsla(
                                ${hue},
                                65%,
                                25%,
                                .25
                            ),
                            hsla(
                                ${(hue + 45) % 360},
                                60%,
                                15%,
                                .25
                            )
                        ),
                        url('${image}')
                        center / cover no-repeat;
                    "
                >

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
                            ${formatNumber(
                                recipe.calories
                            )}
                        </b>

                        kcal per serving

                    </p>


                    <div class="recipe-card-tags">

                        ${recipe.tags
                            .map(
                                function (tag) {

                                    return `
                                        <span class="recipe-card-tag">
                                            ${escapeHTML(
                                                TAG_LABELS[tag] ||
                                                tag
                                            )}
                                        </span>
                                    `;

                                }
                            )
                            .join("")}

                    </div>

                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    openRecipeModal(
                        recipe
                    );

                }
            );


            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                            "Enter" ||
                        event.key ===
                            " "
                    ) {

                        event.preventDefault();

                        openRecipeModal(
                            recipe
                        );

                    }

                }
            );


            grid.appendChild(
                card
            );

        }
    );

}


/* ================================================================
   RECIPE IMAGE
   ================================================================ */

function getRecipeImage(
    recipe
) {

    const query =
        recipe.image ||
        recipe.name ||
        "healthy vegetarian food";


    return (
        "https://loremflickr.com/900/650/" +
        encodeURIComponent(
            query
        ) +
        "?lock=" +
        Math.abs(
            hashString(
                recipe.name
            )
        )
    );

}


/* ================================================================
   9. RECIPE MODAL
   ================================================================ */

function initRecipeModal() {

    const modal =
        document.getElementById(
            "recipeModal"
        );


    if (!modal) {
        return;
    }


    const close =
        document.getElementById(
            "recipeModalClose"
        );


    if (close) {

        close.addEventListener(
            "click",
            closeRecipeModal
        );

    }


    const backdrop =
        document.querySelector(
            "[data-close-recipe]"
        );


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeRecipeModal
        );

    }


    const addButton =
        document.getElementById(
            "recipeAddMealBtn"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                if (activeRecipe) {

                    addRecipeToMeal(
                        activeRecipe
                    );

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                    "Escape" &&
                modal.hidden === false
            ) {

                closeRecipeModal();

            }

        }
    );

}


function openRecipeModal(
    recipe
) {

    if (!recipe) {
        return;
    }


    activeRecipe =
        recipe;


    const modal =
        document.getElementById(
            "recipeModal"
        );


    if (!modal) {
        return;
    }


    const image =
        document.getElementById(
            "recipeModalImage"
        );


    const kicker =
        document.getElementById(
            "recipeModalKicker"
        );


    const title =
        document.getElementById(
            "recipeModalTitle"
        );


    const meta =
        document.getElementById(
            "recipeModalMeta"
        );


    const tags =
        document.getElementById(
            "recipeModalTags"
        );


    const ingredients =
        document.getElementById(
            "recipeIngredients"
        );


    const steps =
        document.getElementById(
            "recipeSteps"
        );


    const nutrition =
        document.getElementById(
            "recipeNutrition"
        );


    if (image) {

        image.src =
            getRecipeImage(
                recipe
            );

        image.alt =
            recipe.name;

    }


    if (kicker) {

        kicker.textContent =
            "Vegetarian recipe";

    }


    if (title) {

        title.textContent =
            recipe.name;

    }


    if (meta) {

        meta.innerHTML = `

            <span>
                <i class="fa-solid fa-fire"></i>
                ${formatNumber(
                    recipe.calories
                )} kcal
            </span>

            <span>
                <i class="fa-regular fa-clock"></i>
                ${recipe.time} min
            </span>

            <span>
                <i class="fa-solid fa-dumbbell"></i>
                ${formatDecimal(
                    recipe.protein
                )}g protein
            </span>

        `;

    }


    if (tags) {

        tags.innerHTML =
            recipe.tags
                .map(
                    function (tag) {

                        return `
                            <span class="recipe-card-tag">
                                ${escapeHTML(
                                    TAG_LABELS[tag] ||
                                    tag
                                )}
                            </span>
                        `;

                    }
                )
                .join("");

    }


    if (ingredients) {

        ingredients.innerHTML =
            getRecipeIngredients(
                recipe
            )
                .map(
                    function (item) {

                        return `
                            <li>
                                ${escapeHTML(
                                    item
                                )}
                            </li>
                        `;

                    }
                )
                .join("");

    }


    if (steps) {

        steps.innerHTML =
            getRecipeSteps(
                recipe
            )
                .map(
                    function (item) {

                        return `
                            <li>
                                ${escapeHTML(
                                    item
                                )}
                            </li>
                        `;

                    }
                )
                .join("");

    }


    if (nutrition) {

        nutrition.innerHTML =
            renderRecipeNutrition(
                recipe
            );

    }


    modal.hidden =
        false;


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );

}


function closeRecipeModal() {

    const modal =
        document.getElementById(
            "recipeModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    activeRecipe =
        null;

}


/* ================================================================
   RECIPE INGREDIENTS
   ================================================================ */

function getRecipeIngredients(
    recipe
) {

    const name =
        recipe.name.toLowerCase();


    if (
        name.includes(
            "paneer"
        )
    ) {

        return [

            "Paneer",

            "Capsicum",

            "Onion",

            "Tomato",

            "Curd or Greek yogurt",

            "Ginger-garlic paste",

            "Turmeric",

            "Red chilli powder",

            "Cumin powder",

            "Garam masala",

            "Lemon juice",

            "Fresh coriander",

            "Salt"

        ];

    }


    if (
        name.includes(
            "tofu"
        )
    ) {

        return [

            "Firm tofu",

            "Broccoli",

            "Bell pepper",

            "Carrot",

            "Onion",

            "Garlic",

            "Ginger",

            "Soy sauce",

            "Sesame oil",

            "Black pepper",

            "Chilli flakes",

            "Fresh coriander"

        ];

    }


    if (
        name.includes(
            "dal"
        ) ||
        name.includes(
            "lentil"
        )
    ) {

        return [

            "Moong dal or lentils",

            "Spinach",

            "Tomato",

            "Onion",

            "Garlic",

            "Ginger",

            "Turmeric",

            "Cumin",

            "Coriander powder",

            "Garam masala",

            "Fresh coriander",

            "Salt"

        ];

    }


    if (
        name.includes(
            "chickpea"
        ) ||
        name.includes(
            "chana"
        )
    ) {

        return [

            "Cooked chickpeas",

            "Cucumber",

            "Tomato",

            "Red onion",

            "Lemon juice",

            "Fresh coriander",

            "Roasted cumin",

            "Chaat masala",

            "Black pepper",

            "Salt"

        ];

    }


    if (
        name.includes(
            "quinoa"
        )
    ) {

        return [

            "Cooked quinoa",

            "Mixed vegetables",

            "Chickpeas",

            "Cucumber",

            "Tomato",

            "Lemon juice",

            "Olive oil",

            "Fresh herbs",

            "Black pepper",

            "Salt"

        ];

    }


    if (
        name.includes(
            "poha"
        )
    ) {

        return [

            "Poha",

            "Onion",

            "Green peas",

            "Peanuts",

            "Mustard seeds",

            "Curry leaves",

            "Turmeric",

            "Lemon juice",

            "Fresh coriander",

            "Salt"

        ];

    }


    if (
        name.includes(
            "oat"
        )
    ) {

        return [

            "Rolled oats",

            "Mixed vegetables",

            "Onion",

            "Tomato",

            "Green peas",

            "Cumin",

            "Turmeric",

            "Chilli powder",

            "Fresh coriander",

            "Salt"

        ];

    }


    if (
        name.includes(
            "salad"
        )
    ) {

        return [

            "Mixed greens",

            "Cucumber",

            "Tomato",

            "Carrot",

            "Bell pepper",

            "Beans or chickpeas",

            "Lemon juice",

            "Olive oil",

            "Fresh herbs",

            "Black pepper",

            "Salt"

        ];

    }


    return [

        "Mixed seasonal vegetables",

        "Vegetarian protein source",

        "Onion",

        "Tomato",

        "Garlic",

        "Ginger",

        "Fresh herbs",

        "Indian spices",

        "Lemon juice",

        "Olive oil",

        "Black pepper",

        "Salt"

    ];

}


/* ================================================================
   RECIPE STEPS
   ================================================================ */

function getRecipeSteps(
    recipe
) {

    const name =
        recipe.name.toLowerCase();


    if (
        name.includes(
            "smoothie"
        )
    ) {

        return [

            "Add all ingredients to a blender.",

            "Blend until smooth and creamy.",

            "Taste and adjust the thickness.",

            "Pour into a glass and serve immediately."

        ];

    }


    if (
        name.includes(
            "salad"
        )
    ) {

        return [

            "Wash and prepare the vegetables.",

            "Add all ingredients to a large bowl.",

            "Mix lemon juice, olive oil and seasonings.",

            "Pour the dressing over the bowl.",

            "Toss well and serve fresh."

        ];

    }


    if (
        name.includes(
            "stir"
        ) ||
        name.includes(
            "noodle"
        )
    ) {

        return [

            "Wash and chop all vegetables.",

            "Heat a pan over medium-high heat.",

            "Add oil, garlic and ginger.",

            "Add vegetables and cook until slightly tender.",

            "Add tofu or the main vegetarian protein.",

            "Add sauces and spices.",

            "Toss everything together.",

            "Serve hot."

        ];

    }


    return [

        "Prepare and chop all ingredients.",

        "Heat a pan or pot over medium heat.",

        "Add a small amount of oil.",

        "Add onion, garlic and ginger.",

        "Add the main ingredients and spices.",

        "Cook until everything is tender and well combined.",

        "Taste and adjust the seasoning.",

        "Finish with lemon juice and fresh coriander.",

        "Serve warm."

    ];

}


/* ================================================================
   RECIPE NUTRITION
   ================================================================ */

function renderRecipeNutrition(
    recipe
) {

    const values = [

        [
            "Calories",
            `${formatNumber(
                recipe.calories
            )} kcal`
        ],

        [
            "Protein",
            `${formatDecimal(
                recipe.protein
            )} g`
        ],

        [
            "Carbs",
            `${formatDecimal(
                recipe.carbs
            )} g`
        ],

        [
            "Fats",
            `${formatDecimal(
                recipe.fats
            )} g`
        ],

        [
            "Fiber",
            `${formatDecimal(
                recipe.fiber
            )} g`
        ],

        [
            "Sodium",
            `${formatNumber(
                recipe.sodium
            )} mg`
        ],

        [
            "Potassium",
            `${formatNumber(
                recipe.potassium
            )} mg`
        ],

        [
            "Calcium",
            `${formatNumber(
                recipe.calcium
            )} mg`
        ],

        [
            "Iron",
            `${formatDecimal(
                recipe.iron
            )} mg`
        ],

        [
            "Vitamin C",
            `${formatDecimal(
                recipe.vitaminC
            )} mg`
        ]

    ];


    return values
        .map(
            function (item) {

                return `

                    <div class="recipe-nutrition-item">

                        <span>
                            ${escapeHTML(
                                item[0]
                            )}
                        </span>

                        <strong>
                            ${escapeHTML(
                                item[1]
                            )}
                        </strong>

                    </div>

                `;

            }
        )
        .join("");

}


/* ================================================================
   ADD RECIPE TO MEAL
   ================================================================ */

function addRecipeToMeal(
    recipe
) {

    addMeal({

        id:
            Date.now(),

        name:
            recipe.name,

        calories:
            recipe.calories,

        protein:
            recipe.protein,

        carbs:
            recipe.carbs,

        fats:
            recipe.fats,

        fiber:
            recipe.fiber,

        sodium:
            recipe.sodium,

        potassium:
            recipe.potassium,

        calcium:
            recipe.calcium,

        iron:
            recipe.iron,

        vitaminC:
            recipe.vitaminC

    });


    closeRecipeModal();


    showToast(
        `${recipe.name} added to ${capitalize(
            dashboardState.activeMeal
        )}.`
    );

}


/* ================================================================
   10. MANUAL VEGETARIAN FOOD DATABASE
   ================================================================ */

const MANUAL_FOODS = [

    {
        name:
            "Steamed White Rice",

        keywords:
            [
                "rice",
                "chawal",
                "white rice"
            ],

        servings: [

            {
                label:
                    "1 katori (150 g)",

                base: {
                    calories: 195,
                    protein: 4,
                    carbs: 42,
                    fats: 0.4,
                    fiber: 0.6,
                    sodium: 2,
                    potassium: 65,
                    calcium: 15,
                    iron: 0.3,
                    vitaminC: 0
                }

            },

            {
                label:
                    "1 bowl (250 g)",

                base: {
                    calories: 325,
                    protein: 6.7,
                    carbs: 70,
                    fats: 0.7,
                    fiber: 1,
                    sodium: 3,
                    potassium: 108,
                    calcium: 25,
                    iron: 0.5,
                    vitaminC: 0
                }

            }

        ]

    },


    {
        name:
            "Roti / Chapati",

        keywords:
            [
                "roti",
                "chapati",
                "atta",
                "wheat"
            ],

        servings: [

            {
                label:
                    "1 roti (35 g)",

                base: {
                    calories: 105,
                    protein: 3,
                    carbs: 18,
                    fats: 2.5,
                    fiber: 2.5,
                    sodium: 90,
                    potassium: 85,
                    calcium: 12,
                    iron: 1.1,
                    vitaminC: 0
                }

            },

            {
                label:
                    "2 rotis (70 g)",

                base: {
                    calories: 210,
                    protein: 6,
                    carbs: 36,
                    fats: 5,
                    fiber: 5,
                    sodium: 180,
                    potassium: 170,
                    calcium: 24,
                    iron: 2.2,
                    vitaminC: 0
                }

            },

            {
                label:
                    "1 large roti (50 g)",

                base: {
                    calories: 150,
                    protein: 4.2,
                    carbs: 26,
                    fats: 3.5,
                    fiber: 3.5,
                    sodium: 125,
                    potassium: 120,
                    calcium: 17,
                    iron: 1.5,
                    vitaminC: 0
                }

            }

        ]

    },


    {
        name:
            "Dal Tadka",

        keywords:
            [
                "dal",
                "daal",
                "lentils",
                "dal tadka"
            ],

        servings: [

            {
                label:
                    "1 katori (150 g)",

                base: {
                    calories: 190,
                    protein: 10,
                    carbs: 25,
                    fats: 5,
                    fiber: 8,
                    sodium: 420,
                    potassium: 410,
                    calcium: 46,
                    iron: 2.5,
                    vitaminC: 4
                }

            },

            {
                label:
                    "1 bowl (250 g)",

                base: {
                    calories: 317,
                    protein: 16.7,
                    carbs: 41.7,
                    fats: 8.3,
                    fiber: 13.3,
                    sodium: 700,
                    potassium: 683,
                    calcium: 77,
                    iron: 4.2,
                    vitaminC: 6.7
                }

            }

        ]

    },


    {
        name:
            "Paneer",

        keywords:
            [
                "paneer",
                "cottage cheese"
            ],

        servings: [

            {
                label:
                    "50 g cubes",

                base: {
                    calories: 130,
                    protein: 11,
                    carbs: 2,
                    fats: 9,
                    fiber: 0,
                    sodium: 15,
                    potassium: 90,
                    calcium: 220,
                    iron: 1.3,
                    vitaminC: 0
                }

            },

            {
                label:
                    "100 g cubes",

                base: {
                    calories: 260,
                    protein: 22,
                    carbs: 4,
                    fats: 18,
                    fiber: 0,
                    sodium: 30,
                    potassium: 180,
                    calcium: 440,
                    iron: 2.6,
                    vitaminC: 0
                }

            }

        ]

    },


    {
        name:
            "Curd / Yogurt",

        keywords:
            [
                "curd",
                "dahi",
                "yogurt",
                "hung curd"
            ],

        servings: [

            {
                label:
                    "1 katori (150 g)",

                base: {
                    calories: 95,
                    protein: 5.2,
                    carbs: 7,
                    fats: 4.5,
                    fiber: 0,
                    sodium: 70,
                    potassium: 230,
                    calcium: 180,
                    iron: 0.1,
                    vitaminC: 1
                }

            },

            {
                label:
                    "1 bowl (250 g)",

                base: {
                    calories: 158,
                    protein: 8.7,
                    carbs: 11.7,
                    fats: 7.5,
                    fiber: 0,
                    sodium: 117,
                    potassium: 383,
                    calcium: 300,
                    iron: 0.2,
                    vitaminC: 1.7
                }

            }

        ]

    },


    {
        name:
            "Chickpeas",

        keywords:
            [
                "chickpeas",
                "chana",
                "kabuli chana"
            ],

        servings: [

            {
                label:
                    "1 katori (120 g)",

                base: {
                    calories: 197,
                    protein: 10.7,
                    carbs: 33,
                    fats: 3.1,
                    fiber: 9.1,
                    sodium: 9,
                    potassium: 430,
                    calcium: 59,
                    iron: 3.1,
                    vitaminC: 1
                }

            },

            {
                label:
                    "1 bowl (200 g)",

                base: {
                    calories: 328,
                    protein: 17.8,
                    carbs: 55,
                    fats: 5.2,
                    fiber: 15.2,
                    sodium: 15,
                    potassium: 717,
                    calcium: 98,
                    iron: 5.2,
                    vitaminC: 1.7
                }

            }

        ]

    },


    {
        name:
            "Rajma",

        keywords:
            [
                "rajma",
                "kidney beans"
            ],

        servings: [

            {
                label:
                    "1 katori (150 g)",

                base: {
                    calories: 190,
                    protein: 13,
                    carbs: 34,
                    fats: 0.8,
                    fiber: 11,
                    sodium: 10,
                    potassium: 540,
                    calcium: 70,
                    iron: 3.8,
                    vitaminC: 2
                }

            },

            {
                label:
                    "1 bowl (250 g)",

                base: {
                    calories: 317,
                    protein: 21.7,
                    carbs: 56.7,
                    fats: 1.3,
                    fiber: 18.3,
                    sodium: 17,
                    potassium: 900,
                    calcium: 117,
                    iron: 6.3,
                    vitaminC: 3.3
                }

            }

        ]

    },


    {
        name:
            "Moong Dal",

        keywords:
            [
                "moong",
                "mung",
                "green gram",
                "moong dal"
            ],

        servings: [

            {
                label:
                    "1 katori (150 g)",

                base: {
                    calories: 170,
                    protein: 11,
                    carbs: 27,
                    fats: 2.2,
                    fiber: 7,
                    sodium: 12,
                    potassium: 350,
                    calcium: 50,
                    iron: 2.7,
                    vitaminC: 4
                }

            },

            {
                label:
                    "1 bowl (250 g)",

                base: {
                    calories: 283,
                    protein: 18.3,
                    carbs: 45,
                    fats: 3.7,
                    fiber: 11.7,
                    sodium: 20,
                    potassium: 583,
                    calcium: 83,
                    iron: 4.5,
                    vitaminC: 6.7
                }

            }

        ]

    },


    {
        name:
            "Mixed Vegetables",

        keywords:
            [
                "vegetables",
                "sabzi",
                "mixed veg",
                "vegetable"
            ],

        servings: [

            {
                label:
                    "1 katori (150 g)",

                base: {
                    calories: 110,
                    protein: 4,
                    carbs: 16,
                    fats: 4,
                    fiber: 5,
                    sodium: 230,
                    potassium: 420,
                    calcium: 60,
                    iron: 1.5,
                    vitaminC: 35
                }

            },

            {
                label:
                    "1 bowl (250 g)",

                base: {
                    calories: 183,
                    protein: 6.7,
                    carbs: 26.7,
                    fats: 6.7,
                    fiber: 8.3,
                    sodium: 383,
                    potassium: 700,
                    calcium: 100,
                    iron: 2.5,
                    vitaminC: 58.3
                }

            }

        ]

    },


    {
        name:
            "Banana",

        keywords:
            [
                "banana",
                "kela"
            ],

        servings: [

            {
                label:
                    "1 small piece (80 g)",

                base: {
                    calories: 71,
                    protein: 0.9,
                    carbs: 18,
                    fats: 0.2,
                    fiber: 2.1,
                    sodium: 1,
                    potassium: 285,
                    calcium: 4,
                    iron: 0.2,
                    vitaminC: 7
                }

            },

            {
                label:
                    "1 medium piece (118 g)",

                base: {
                    calories: 105,
                    protein: 1.3,
                    carbs: 27,
                    fats: 0.4,
                    fiber: 3.1,
                    sodium: 1,
                    potassium: 422,
                    calcium: 6,
                    iron: 0.3,
                    vitaminC: 10
                }

            }

        ]

    },


    {
        name:
            "Apple",

        keywords:
            [
                "apple",
                "seb"
            ],

        servings: [

            {
                label:
                    "1 small piece (150 g)",

                base: {
                    calories: 78,
                    protein: 0.4,
                    carbs: 21,
                    fats: 0.3,
                    fiber: 3.6,
                    sodium: 2,
                    potassium: 160,
                    calcium: 9,
                    iron: 0.2,
                    vitaminC: 7
                }

            },

            {
                label:
                    "1 medium piece (180 g)",

                base: {
                    calories: 94,
                    protein: 0.5,
                    carbs: 25,
                    fats: 0.3,
                    fiber: 4.3,
                    sodium: 2,
                    potassium: 194,
                    calcium: 11,
                    iron: 0.2,
                    vitaminC: 8
                }

            }

        ]

    },


    {
        name:
            "Almonds",

        keywords:
            [
                "almond",
                "almonds",
                "badam"
            ],

        servings: [

            {
                label:
                    "10 almonds (12 g)",

                base: {
                    calories: 69,
                    protein: 2.5,
                    carbs: 2.6,
                    fats: 6,
                    fiber: 1.5,
                    sodium: 0,
                    potassium: 88,
                    calcium: 31,
                    iron: 0.4,
                    vitaminC: 0
                }

            },

            {
                label:
                    "1 handful (28 g)",

                base: {
                    calories: 164,
                    protein: 6,
                    carbs: 6.1,
                    fats: 14.2,
                    fiber: 3.5,
                    sodium: 0,
                    potassium: 207,
                    calcium: 76,
                    iron: 1,
                    vitaminC: 0
                }

            }

        ]

    },


    {
        name:
            "Peanut Butter",

        keywords:
            [
                "peanut butter",
                "groundnut"
            ],

        servings: [

            {
                label:
                    "1 tbsp (16 g)",

                base: {
                    calories: 94,
                    protein: 4,
                    carbs: 3.2,
                    fats: 8,
                    fiber: 1,
                    sodium: 75,
                    potassium: 104,
                    calcium: 8,
                    iron: 0.3,
                    vitaminC: 0
                }

            },

            {
                label:
                    "2 tbsp (32 g)",

                base: {
                    calories: 188,
                    protein: 8,
                    carbs: 6.4,
                    fats: 16,
                    fiber: 2,
                    sodium: 150,
                    potassium: 208,
                    calcium: 16,
                    iron: 0.6,
                    vitaminC: 0
                }

            }

        ]

    },


    {
        name:
            "Milk",

        keywords:
            [
                "milk",
                "doodh"
            ],

        servings: [

            {
                label:
                    "1 glass (250 ml)",

                base: {
                    calories: 150,
                    protein: 8,
                    carbs: 12,
                    fats: 8,
                    fiber: 0,
                    sodium: 105,
                    potassium: 300,
                    calcium: 300,
                    iron: 0.1,
                    vitaminC: 0
                }

            },

            {
                label:
                    "1 cup (200 ml)",

                base: {
                    calories: 120,
                    protein: 6.4,
                    carbs: 9.6,
                    fats: 6.4,
                    fiber: 0,
                    sodium: 84,
                    potassium: 240,
                    calcium: 240,
                    iron: 0.1,
                    vitaminC: 0
                }

            }

        ]

    },


    {
        name:
            "Oats",

        keywords:
            [
                "oats",
                "oatmeal",
                "rolled oats"
            ],

        servings: [

            {
                label:
                    "1/2 cup dry (40 g)",

                base: {
                    calories: 150,
                    protein: 5,
                    carbs: 27,
                    fats: 3,
                    fiber: 4,
                    sodium: 0,
                    potassium: 140,
                    calcium: 20,
                    iron: 1.8,
                    vitaminC: 0
                }

            },

            {
                label:
                    "1 cup cooked (234 g)",

                base: {
                    calories: 166,
                    protein: 6,
                    carbs: 28,
                    fats: 3.5,
                    fiber: 4,
                    sodium: 9,
                    potassium: 164,
                    calcium: 21,
                    iron: 2.1,
                    vitaminC: 0
                }

            }

        ]

    },


    {
        name:
            "Sweet Potato",

        keywords:
            [
                "sweet potato",
                "shakarkand"
            ],

        servings: [

            {
                label:
                    "1 small piece (100 g)",

                base: {
                    calories: 90,
                    protein: 2,
                    carbs: 21,
                    fats: 0.2,
                    fiber: 3,
                    sodium: 36,
                    potassium: 475,
                    calcium: 30,
                    iron: 0.6,
                    vitaminC: 19
                }

            },

            {
                label:
                    "1 medium piece (150 g)",

                base: {
                    calories: 135,
                    protein: 3,
                    carbs: 32,
                    fats: 0.3,
                    fiber: 4.5,
                    sodium: 54,
                    potassium: 713,
                    calcium: 45,
                    iron: 0.9,
                    vitaminC: 29
                }

            }

        ]

    }

];


/* ================================================================
   MANUAL FOOD STATE
   ================================================================ */

const manualFoodState = {

    selectedFood:
        0,

    selectedServing:
        0

};


/* ================================================================
   11. MANUAL FOOD
   ================================================================ */

function initManualFood() {

    const modal =
        document.getElementById(
            "manualFoodModal"
        );


    const openButton =
        document.getElementById(
            "manualFoodBtn"
        );


    const closeButton =
        document.getElementById(
            "manualFoodClose"
        );


    const backdrop =
        document.querySelector(
            "[data-close-food]"
        );


    const search =
        document.getElementById(
            "manualFoodSearch"
        );


    if (!modal || !openButton) {
        return;
    }


    openButton.addEventListener(
        "click",
        function () {

            modal.hidden =
                false;


            document.body.classList.add(
                "modal-open"
            );


            renderManualFoodList();

            renderManualFoodDetails();


            setTimeout(
                function () {

                    search?.focus();

                },
                100
            );

        }
    );


    closeButton?.addEventListener(
        "click",
        closeManualFood
    );


    backdrop?.addEventListener(
        "click",
        closeManualFood
    );


    search?.addEventListener(
        "input",
        function () {

            renderManualFoodList();

        }
    );

}


function closeManualFood() {

    const modal =
        document.getElementById(
            "manualFoodModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    if (
        document.getElementById(
            "profileModal"
        )?.hidden !== false
    ) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


function getManualFoodResults() {

    const search =
        (
            document.getElementById(
                "manualFoodSearch"
            )?.value || ""
        )
            .trim()
            .toLowerCase();


    if (!search) {

        return MANUAL_FOODS;

    }


    return MANUAL_FOODS.filter(
        function (food) {

            const text =
                `${food.name} ${
                    food.keywords.join(
                        " "
                    )
                }`
                    .toLowerCase();


            return text.includes(
                search
            );

        }
    );

}


function renderManualFoodList() {

    const list =
        document.getElementById(
            "manualFoodList"
        );


    if (!list) {
        return;
    }


    const foods =
        getManualFoodResults();


    if (!foods.length) {

        list.innerHTML = `

            <div class="food-search-empty">

                No vegetarian food found.

                <br>

                Try rice, dal, roti, paneer, fruit, tofu...

            </div>

        `;

        return;

    }


    const selectedFoodObject =
        MANUAL_FOODS[
            manualFoodState.selectedFood
        ];


    if (
        !selectedFoodObject ||
        !foods.includes(
            selectedFoodObject
        )
    ) {

        manualFoodState.selectedFood =
            MANUAL_FOODS.indexOf(
                foods[0]
            );


        manualFoodState.selectedServing =
            0;

    }


    list.innerHTML =
        "";


    foods.forEach(
        function (food) {

            const index =
                MANUAL_FOODS.indexOf(
                    food
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "manual-food-item";


            if (
                index ===
                manualFoodState.selectedFood
            ) {

                button.classList.add(
                    "is-active"
                );

            }


            button.innerHTML = `

                <strong>
                    ${escapeHTML(
                        food.name
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        food.servings[0].label
                    )}
                </span>

            `;


            button.addEventListener(
                "click",
                function () {

                    manualFoodState.selectedFood =
                        index;


                    manualFoodState.selectedServing =
                        0;


                    renderManualFoodList();

                    renderManualFoodDetails();

                }
            );


            list.appendChild(
                button
            );

        }
    );

}


function scaleNutrition(
    nutrition,
    multiplier
) {

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
            multiplier

    };

}


function getCurrentManualFood() {

    const food =
        MANUAL_FOODS[
            manualFoodState.selectedFood
        ] ||
        MANUAL_FOODS[0];


    const serving =
        food.servings[
            manualFoodState.selectedServing
        ] ||
        food.servings[0];


    const amountInput =
        document.getElementById(
            "manualFoodAmount"
        );


    const amount =
        Math.max(
            0.25,
            Number(
                amountInput?.value
            ) || 1
        );


    return {

        food,

        serving,

        amount,

        nutrition:
            scaleNutrition(
                serving.base,
                amount
            )

    };

}


function renderManualFoodDetails() {

    const container =
        document.getElementById(
            "manualFoodDetails"
        );


    if (!container) {
        return;
    }


    const current =
        getCurrentManualFood();


    const food =
        current.food;


    const serving =
        current.serving;


    const nutrition =
        current.nutrition;


    container.innerHTML = `

        <div class="food-detail-head">

            <div>

                <h3>
                    ${escapeHTML(
                        food.name
                    )}
                </h3>

                <p>
                    Vegetarian food • serving-based nutrition
                </p>

            </div>

            <i
                class="fa-solid fa-leaf"
                style="
                    color:
                    var(--emerald-strong);
                "
            ></i>

        </div>


        <div class="food-serving-row">

            <div class="form-field">

                <label
                    for="manualFoodServing"
                >
                    Serving
                </label>

                <select
                    id="manualFoodServing"
                >

                    ${food.servings
                        .map(
                            function (
                                item,
                                index
                            ) {

                                return `

                                    <option
                                        value="${index}"
                                        ${
                                            index ===
                                            manualFoodState.selectedServing
                                                ? "selected"
                                                : ""
                                        }
                                    >

                                        ${escapeHTML(
                                            item.label
                                        )}

                                    </option>

                                `;

                            }
                        )
                        .join("")}

                </select>

            </div>


            <div class="form-field">

                <label
                    for="manualFoodAmount"
                >
                    Quantity
                </label>

                <input
                    id="manualFoodAmount"
                    type="number"
                    min="0.25"
                    max="20"
                    step="0.25"
                    value="${current.amount}"
                >

            </div>


            <button
                class="btn btn-primary food-add-btn"
                id="addManualFoodToMeal"
                type="button"
            >

                <i class="fa-solid fa-plus"></i>

                Add to ${capitalize(
                    dashboardState.activeMeal
                )}

            </button>

        </div>


        <div class="food-nutrient-group">

            <h4>
                Macros
            </h4>

            <div class="food-nutrient-grid">

                ${manualNutrientRow(
                    "Calories",
                    `${nutrition.calories.toFixed(0)} kcal`
                )}

                ${manualNutrientRow(
                    "Protein",
                    `${nutrition.protein.toFixed(1)} g`
                )}

                ${manualNutrientRow(
                    "Carbs",
                    `${nutrition.carbs.toFixed(1)} g`
                )}

                ${manualNutrientRow(
                    "Fats",
                    `${nutrition.fats.toFixed(1)} g`
                )}

                ${manualNutrientRow(
                    "Fiber",
                    `${nutrition.fiber.toFixed(1)} g`
                )}

            </div>

        </div>


        <div class="food-nutrient-group">

            <h4>
                Micronutrients
            </h4>

            <div class="food-nutrient-grid">

                ${manualNutrientRow(
                    "Sodium",
                    `${nutrition.sodium.toFixed(0)} mg`
                )}

                ${manualNutrientRow(
                    "Potassium",
                    `${nutrition.potassium.toFixed(0)} mg`
                )}

                ${manualNutrientRow(
                    "Calcium",
                    `${nutrition.calcium.toFixed(0)} mg`
                )}

                ${manualNutrientRow(
                    "Iron",
                    `${nutrition.iron.toFixed(1)} mg`
                )}

                ${manualNutrientRow(
                    "Vitamin C",
                    `${nutrition.vitaminC.toFixed(0)} mg`
                )}

            </div>

        </div>

    `;


    document
        .getElementById(
            "manualFoodServing"
        )
        ?.addEventListener(
            "change",
            function (event) {

                manualFoodState.selectedServing =
                    Number(
                        event.target.value
                    );


                renderManualFoodDetails();

            }
        );


    document
        .getElementById(
            "manualFoodAmount"
        )
        ?.addEventListener(
            "input",
            function () {

                renderManualFoodDetails();

            }
        );


    document
        .getElementById(
            "addManualFoodToMeal"
        )
        ?.addEventListener(
            "click",
            function () {

                const data =
                    getCurrentManualFood();


                addMeal({

                    id:
                        Date.now(),

                    name:
                        `${data.food.name} — ${data.serving.label} × ${data.amount}`,

                    calories:
                        Math.round(
                            data.nutrition.calories
                        ),

                    protein:
                        round1(
                            data.nutrition.protein
                        ),

                    carbs:
                        round1(
                            data.nutrition.carbs
                        ),

                    fats:
                        round1(
                            data.nutrition.fats
                        ),

                    fiber:
                        round1(
                            data.nutrition.fiber
                        ),

                    sodium:
                        Math.round(
                            data.nutrition.sodium
                        ),

                    potassium:
                        Math.round(
                            data.nutrition.potassium
                        ),

                    calcium:
                        Math.round(
                            data.nutrition.calcium
                        ),

                    iron:
                        round1(
                            data.nutrition.iron
                        ),

                    vitaminC:
                        round1(
                            data.nutrition.vitaminC
                        )

                });


                closeManualFood();


                showToast(
                    `${data.food.name} added to ${capitalize(
                        dashboardState.activeMeal
                    )}.`
                );

            }
        );

}


function manualNutrientRow(
    label,
    value
) {

    return `

        <div class="food-nutrient">

            <span>
                ${escapeHTML(
                    label
                )}
            </span>

            <strong>
                ${escapeHTML(
                    value
                )}
            </strong>

        </div>

    `;

}


/* ================================================================
   12. PROFILE UI
   ================================================================ */

function updateProfileUI() {

    if (!profileState.profile) {
        return;
    }


    const name =
        profileState.profile.name;


    setText(
        "lifestyleJapaneseGreeting",
        `Konnichiwa, ${name}-san 🌱`
    );


    setText(
        "lifestyleUserGreeting",
        `${name}-san, let's make today a healthy day!`
    );


    if (
        profileState.nutrition
    ) {

        setText(
            "heroCalorieGoal",
            formatNumber(
                profileState.nutrition.calories
            )
        );

    }

}


/* ================================================================
   13. TOAST
   ================================================================ */

function showToast(
    message
) {

    let toast =
        document.getElementById(
            "lifestyleToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "lifestyleToast";


        toast.style.position =
            "fixed";


        toast.style.left =
            "50%";


        toast.style.bottom =
            "25px";


        toast.style.transform =
            "translateX(-50%) translateY(20px)";


        toast.style.padding =
            "13px 20px";


        toast.style.borderRadius =
            "999px";


        toast.style.background =
            "var(--bg-2, #111827)";


        toast.style.color =
            "var(--text-primary, #fff)";


        toast.style.border =
            "1px solid var(--border-strong, rgba(255,255,255,.15))";


        toast.style.boxShadow =
            "0 18px 50px rgba(0,0,0,.25)";


        toast.style.fontSize =
            "14px";


        toast.style.fontWeight =
            "600";


        toast.style.zIndex =
            "999999";


        toast.style.opacity =
            "0";


        toast.style.transition =
            "opacity .25s ease, transform .25s ease";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    requestAnimationFrame(
        function () {

            toast.style.opacity =
                "1";

            toast.style.transform =
                "translateX(-50%) translateY(0)";

        }
    );


    clearTimeout(
        toast._timeout
    );


    toast._timeout =
        setTimeout(
            function () {

                toast.style.opacity =
                    "0";


                toast.style.transform =
                    "translateX(-50%) translateY(20px)";

            },
            2500
        );

}


/* ================================================================
   14. UTILITY FUNCTIONS
   ================================================================ */

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

    const value =
        Math.max(
            0,
            Math.min(
                Number(
                    percentage
                ) || 0,
                100
            )
        );


    setStyle(
        id,
        "width",
        `${value}%`
    );

}


function getInputValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    return element
        ? element.value
        : "";

}


function setInputValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value ?? "";

    }

}


function capitalize(
    value
) {

    if (!value) {
        return "";
    }


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


function formatNumber(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-US",
        {
            maximumFractionDigits:
                0
        }
    );

}


function formatDecimal(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-US",
        {
            maximumFractionDigits:
                1
        }
    );

}


function round1(
    value
) {

    return Math.round(
        Number(value || 0) *
        10
    ) / 10;

}


function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value ??
            ""
        );


    return div.innerHTML;

}


function hashString(
    value
) {

    let hash =
        0;


    for (
        let i = 0;
        i < value.length;
        i++
    ) {

        hash =
            (
                (
                    hash << 5
                ) -
                hash
            ) +
            value.charCodeAt(
                i
            );


        hash |=
            0;

    }


    return hash;

}


/* ================================================================
   END
   ================================================================ */