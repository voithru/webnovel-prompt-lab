/**
 * WebNovel MT Editor - Google Apps Script 토큰 서버 (CORS 완전 해결 버전)
 * 
 * 🔧 설정 방법:
 * 1. 이 코드를 Google Apps Script에 붙여넣기
 * 2. 배포 > 새 배포 > 유형: 웹 앱
 * 3. 실행 대상: 나
 * 4. 액세스 권한: 모든 사용자
 * 5. 배포 후 웹앱 URL을 .env 파일의 VITE_GOOGLE_TOKEN_SERVER_URL에 설정
 */

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function doOptions(e) {
  // OPTIONS 요청 (CORS preflight) 처리
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Max-Age': '86400'
    });
}

function handleRequest(e) {
  try {
    console.log('🔐 토큰 서버 요청 받음');
    
    // Google Apps Script의 현재 사용자 액세스 토큰 사용
    const accessToken = ScriptApp.getOAuthToken();
    
    if (!accessToken) {
      throw new Error('액세스 토큰을 가져올 수 없습니다');
    }
    
    const response = {
      success: true,
      access_token: accessToken,
      expires_in: 3600,
      token_type: 'Bearer',
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ 토큰 발급 성공');
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        'Access-Control-Max-Age': '86400'
      });
      
  } catch (error) {
    console.error('❌ 토큰 서버 오류:', error);
    
    const errorResponse = {
      success: false,
      error: error.message || '알 수 없는 오류',
      timestamp: new Date().toISOString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        'Access-Control-Max-Age': '86400'
      });
  }
}

/**
 * 테스트 함수 - Apps Script 에디터에서 직접 실행 가능
 */
function testTokenGeneration() {
  try {
    const token = ScriptApp.getOAuthToken();
    console.log('🧪 테스트 토큰 생성:', token ? '성공' : '실패');
    console.log('🔑 토큰 길이:', token ? token.length : 0);
    return token;
  } catch (error) {
    console.error('❌ 테스트 토큰 생성 오류:', error);
    return null;
  }
}

/**
 * 권한 테스트 함수
 */
function testDrivePermissions() {
  try {
    const files = DriveApp.getFiles();
    console.log('✅ Google Drive 권한 테스트 성공');
    return true;
  } catch (error) {
    console.error('❌ Google Drive 권한 테스트 실패:', error);
    return false;
  }
}
