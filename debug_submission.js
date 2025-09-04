console.log("🔍 submission_1 데이터 상세 분석:")
const submissionData = localStorage.getItem("submission_1");
if (submissionData) {
  const parsed = JSON.parse(submissionData);
  console.log("📋 submission_1 키들:", Object.keys(parsed));
  console.log("📝 response_raw 존재:", !!parsed.response_raw);
  if (parsed.response_raw) {
    const responseData = JSON.parse(parsed.response_raw);
    console.log("🔍 response_raw 키들:", Object.keys(responseData));
    console.log("📝 allLikedPrompts:", responseData.allLikedPrompts);
    console.log("📝 allLikedPrompts 길이:", responseData.allLikedPrompts?.length || 0);
    console.log("📝 totalPrompts:", responseData.totalPrompts);
    console.log("📝 bestPromptId:", responseData.bestPromptId);
  }
} else {
  console.log("❌ submission_1 데이터가 없습니다");
}
