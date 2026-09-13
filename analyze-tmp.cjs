const tr=require("./src/data/translations.json");
const en = tr.en;
const keys = Object.keys(en);
// Check which quiz-related keys exist
const quizKeys = keys.filter(k => k.includes('quiz') || k.includes('question') || k.includes('answer') || k.includes('correct') || k.includes('wrong') || k.includes('streak') || k.includes('score') || k.includes('reset') || k.includes('habitat') || k.includes('diet'));
quizKeys.forEach(k => console.log(k+": "+en[k]));
console.log("\n--- Missing quiz keys per locale ---");
const quizKeyList = ['quiz_title', 'quiz_desc', 'quiz_how_it_works', 'quiz_question_habitat', 'quiz_question_diet', 'quiz_correct', 'quiz_wrong', 'quiz_next', 'quiz_score', 'quiz_streak', 'quiz_reset', 'quiz_animal_knowledge', 'quiz_test_knowledge', 'quiz_pick_correct', 'quiz_congratulations', 'quiz_well_done'];
for (const locale of Object.keys(tr)) {
    const missing = quizKeyList.filter(k => !(k in tr[locale]));
    console.log(locale+": "+missing.join(", ") || " (none)");
}
