console.log("🧹 금릉춘 ep1 step2 데이터 삭제 시작...")

// 금릉춘 ep1 step2 과제 ID는 1
const taskId = 1

console.log("📋 삭제할 데이터 목록:")
console.log("- submission_1 (제출 데이터)")
console.log("- promptReview_1 (검토 데이터)")
console.log("- promptInput_1 (입력 데이터)")
console.log("- taskProgress_1 (진행 상태)")
console.log("- baseline_translation_1 (기본 번역문)")
console.log("- baseline_llm_called_1 (LLM 호출 플래그)")

// 모든 관련 데이터 삭제
localStorage.removeItem(`submission_${taskId}`)
localStorage.removeItem(`promptReview_${taskId}`)
localStorage.removeItem(`promptInput_${taskId}`)
localStorage.removeItem(`taskProgress_${taskId}`)
localStorage.removeItem(`baseline_translation_${taskId}`)
localStorage.removeItem(`baseline_llm_called_${taskId}`)

console.log("✅ 모든 데이터 삭제 완료!")
console.log("📊 삭제 후 localStorage 상태:")
console.log("- submission_1:", localStorage.getItem("submission_1") ? "존재" : "삭제됨")
console.log("- promptReview_1:", localStorage.getItem("promptReview_1") ? "존재" : "삭제됨")
console.log("- promptInput_1:", localStorage.getItem("promptInput_1") ? "존재" : "삭제됨")
console.log("- taskProgress_1:", localStorage.getItem("taskProgress_1") ? "존재" : "삭제됨")
console.log("- baseline_translation_1:", localStorage.getItem("baseline_translation_1") ? "존재" : "삭제됨")
console.log("- baseline_llm_called_1:", localStorage.getItem("baseline_llm_called_1") ? "존재" : "삭제됨")

alert("🧹 금릉춘 ep1 step2 데이터가 모두 삭제되었습니다!\n페이지를 새로고침해주세요.")
