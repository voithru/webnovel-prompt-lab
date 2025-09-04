console.log("🔧 금릉춘 과제 데이터 수동 복구 시작...")

// 1. submission_1 데이터에서 response_raw 추출
const submissionData = localStorage.getItem("submission_1")
if (submissionData) {
  const parsed = JSON.parse(submissionData)
  console.log("📋 기존 submission 데이터:", Object.keys(parsed))
  
  if (parsed.response_raw) {
    const responseData = JSON.parse(parsed.response_raw)
    console.log("🔍 response_raw에서 발견된 데이터:", {
      allLikedPrompts: responseData.allLikedPrompts?.length || 0,
      originalText: responseData.originalText?.length || 0,
      baselineTranslation: responseData.baselineTranslation?.length || 0,
      bestPromptId: responseData.bestPromptId
    })
    
    // 2. promptInput_1 복원
    if (responseData.allLikedPrompts && responseData.allLikedPrompts.length > 0) {
      const promptInputData = {
        prompts: responseData.allLikedPrompts,
        originalText: responseData.originalText || "",
        baselineTranslation: responseData.baselineTranslation || "",
        totalPromptCount: responseData.totalPromptCount || 1,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem("promptInput_1", JSON.stringify(promptInputData))
      console.log("✅ promptInput_1 복원 완료:", promptInputData.prompts.length, "개 프롬프트")
      
      // 3. promptReview_1 복원
      const savedComments = {}
      const savedQualityEvaluations = {}
      const savedQualityScores = {}
      
      responseData.allLikedPrompts.forEach(prompt => {
        if (prompt.comment) savedComments[prompt.id] = prompt.comment
        if (prompt.qualityEvaluation) savedQualityEvaluations[prompt.id] = prompt.qualityEvaluation
        if (prompt.qualityScore) savedQualityScores[prompt.id] = prompt.qualityScore
      })
      
      const promptReviewData = {
        prompts: responseData.allLikedPrompts,
        originalText: responseData.originalText || "",
        baselineTranslation: responseData.baselineTranslation || "",
        savedComments: savedComments,
        savedQualityEvaluations: savedQualityEvaluations,
        savedQualityScores: savedQualityScores,
        bestPromptId: responseData.bestPromptId,
        totalPromptCount: responseData.totalPromptCount || 1,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem("promptReview_1", JSON.stringify(promptReviewData))
      console.log("✅ promptReview_1 복원 완료")
      console.log("📝 복원된 데이터:", {
        프롬프트수: promptReviewData.prompts.length,
        코멘트수: Object.keys(savedComments).length,
        평가수: Object.keys(savedQualityEvaluations).length,
        점수수: Object.keys(savedQualityScores).length,
        bestPromptId: promptReviewData.bestPromptId
      })
      
      alert("✅ 금릉춘 과제 데이터 복구 완료!\n페이지를 새로고침해주세요.")
    } else {
      console.log("❌ allLikedPrompts 데이터가 비어있습니다")
      console.log("📋 response_raw 전체:", responseData)
    }
  } else {
    console.log("❌ response_raw가 없습니다")
  }
} else {
  console.log("❌ submission_1 데이터가 없습니다")
}
