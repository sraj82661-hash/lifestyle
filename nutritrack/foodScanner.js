/**
 * foodScanner.js - Connects to Open Food Facts API
 */
async function searchFoodNutrients(query) {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`);
        const data = await response.json();

        if (data.products && data.products.length > 0) {
            return data.products.map(product => ({
                name: product.product_name || 'Unknown Item',
                brand: product.brands || 'Generic',
                calories: Math.round(product.nutriments['energy-kcal_100g'] || 0),
                protein: Math.round(product.nutriments.proteins_100g || 0),
                carbs: Math.round(product.nutriments.carbohydrates_100g || 0),
                fat: Math.round(product.nutriments.fat_100g || 0)
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching food data:", error);
        return [];
    }
}