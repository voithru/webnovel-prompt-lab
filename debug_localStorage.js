console.log("🔍 localStorage 데이터 확인:")
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.includes("submission_1")) {
    console.log(`키: ${key}`);
    console.log("데이터:", JSON.parse(localStorage.getItem(key)));
  }
}
