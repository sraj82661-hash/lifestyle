/**
 * pdfExporter.js - Generates downloadable health reports
 */
function downloadPDFReport(userData) {
    // Requires jsPDF library loaded via CDN
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        alert("PDF generator loading, please try again in a moment.");
        return;
    }

    const doc = new jsPDF();

    // Title & Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // NutriTrack Green
    doc.text("NutriTrack Health Report", 20, 20);

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 28);

    // Divider
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 32, 190, 32);

    // User Metrics Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("User Profile & Targets", 20, 45);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`• Age: ${userData.age || 25} years`, 25, 55);
    doc.text(`• Weight: ${userData.weight || 70} kg`, 25, 63);
    doc.text(`• Height: ${userData.height || 175} cm`, 25, 71);
    doc.text(`• Primary Goal: ${userData.goal || 'Maintenance'}`, 25, 79);
    doc.text(`• Daily Calorie Target: ${userData.targetCalories || 2000} kcal/day`, 25, 87);

    // Estimated Macro Targets
    const target = userData.targetCalories || 2000;
    const protein = Math.round((target * 0.30) / 4);
    const carbs = Math.round((target * 0.40) / 4);
    const fats = Math.round((target * 0.30) / 9);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recommended Macro Distribution", 20, 102);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`• Protein (30%): ${protein}g / day`, 25, 112);
    doc.text(`• Carbohydrates (40%): ${carbs}g / day`, 25, 120);
    doc.text(`• Fats (30%): ${fats}g / day`, 25, 128);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("NutriTrack - Personal Health Companion", 20, 280);

    // Save File
    doc.save(`NutriTrack_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}