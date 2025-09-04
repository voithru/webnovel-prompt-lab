console.log("🔍 promptReview_1 데이터 확인:")
const reviewData = localStorage.getItem("promptReview_1");
if (reviewData) {
  const parsed = JSON.parse(reviewData);
  console.log("📋 promptReview_1 키들:", Object.keys(parsed));
  console.log("📝 prompts 길이:", parsed.prompts?.length || 0);
  console.log("📝 savedComments:", Object.keys(parsed.savedComments || {}));
  console.log("📝 savedQualityEvaluations:", Object.keys(parsed.savedQualityEvaluations || {}));
  console.log("📝 bestPromptId:", parsed.bestPromptId);
  if (parsed.prompts && parsed.prompts.length > 0) {
    console.log("📝 첫번째 프롬프트:", parsed.prompts[0]);
  }
} else {
  console.log("❌ promptReview_1 데이터가 없습니다");
}
