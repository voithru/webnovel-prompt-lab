
// 브라우저 개발자 도구에서 실행할 스크립트
console.log('🧹 로컬 스토리지 정리 시작...');
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && (key.includes('promptInput_') || key.includes('baseline_translation_') || key.includes('baseline_llm_called_'))) {
    keysToRemove.push(key);
  }
}
keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log('🗑️ 삭제:', key);
});
console.log('✅ 로컬 스토리지 정리 완료:', keysToRemove.length, '개 항목 삭제');

