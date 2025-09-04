/**
 * Google Apps Script 기반 서비스 계정 토큰 서버
 * 클라이언트에서 직접 서비스 계정 키를 사용하지 않고 안전하게 토큰 발급
 */

// 서비스 계정 정보 (Google Apps Script의 스크립트 속성에 저장)
const SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID", 
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "YOUR_SERVICE_ACCOUNT_EMAIL",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
}

/**
 * HTTP POST 요청 처리
 */
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents)
    
    // CORS 헤더 설정
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
    
    // 서비스 계정으로 액세스 토큰 획득
    const accessToken = getServiceAccountAccessToken(requestData.scope || 'https://www.googleapis.com/auth/drive.file')
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        access_token: accessToken,
        expires_in: 3600
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(response.headers)
      
  } catch (error) {
    console.error('토큰 서버 오류:', error)
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*'
      })
  }
}

/**
 * OPTIONS 요청 처리 (CORS preflight)
 */
function doOptions() {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    })
}

/**
 * 서비스 계정으로 액세스 토큰 획득
 */
function getServiceAccountAccessToken(scope) {
  // Google Apps Script의 내장 OAuth 서비스 사용
  const service = OAuth2.createService('GoogleDrive')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://oauth2.googleapis.com/token')
    .setPrivateKey(SERVICE_ACCOUNT.private_key)
    .setIssuer(SERVICE_ACCOUNT.client_email)
    .setSubject(SERVICE_ACCOUNT.client_email)
    .setScope(scope)
    .setPropertyStore(PropertiesService.getScriptProperties())
  
  if (service.hasAccess()) {
    return service.getAccessToken()
  } else {
    const authorizationUrl = service.getAuthorizationUrl()
    throw new Error('서비스 계정 인증 실패: ' + authorizationUrl)
  }
}

/**
 * 수동 설정: 스크립트 속성에 서비스 계정 정보 저장
 * 이 함수를 한 번 실행해서 서비스 계정 정보를 안전하게 저장
 */
function setupServiceAccount() {
  const properties = PropertiesService.getScriptProperties()
  
  // 실제 서비스 계정 정보로 교체
  properties.setProperties({
    'SERVICE_ACCOUNT_PROJECT_ID': 'your-project-id',
    'SERVICE_ACCOUNT_PRIVATE_KEY': 'your-private-key',
    'SERVICE_ACCOUNT_CLIENT_EMAIL': 'your-service-account@project.iam.gserviceaccount.com'
  })
  
  console.log('서비스 계정 정보 저장 완료')
}
