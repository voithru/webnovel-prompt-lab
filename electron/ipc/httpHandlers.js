const { ipcMain } = require('electron')
const https = require('https')
const http = require('http')
const { URL } = require('url')
const zlib = require('zlib')

/**
 * HTTP 요청 핸들러
 * CORS 제한을 우회하여 웹 콘텐츠를 가져옵니다.
 */
class HttpHandlers {
  constructor() {
    this.setupHandlers()
  }

  setupHandlers() {
    // URL에서 콘텐츠 가져오기
    ipcMain.handle('http:fetch-url', async (event, url) => {
      try {
        console.log('HTTP 요청:', url)
        const content = await this.fetchUrl(url)
        console.log('HTTP 응답 길이:', content ? content.length : 0)
        return content
      } catch (error) {
        console.error('HTTP 요청 실패:', error)
        throw error
      }
    })
  }

  /**
   * URL에서 콘텐츠를 가져옵니다
   * @param {string} url - 가져올 URL
   * @returns {Promise<string>} - 응답 콘텐츠
   */
  async fetchUrl(url) {
    return new Promise((resolve, reject) => {
      try {
        const parsedUrl = new URL(url)
        const isHttps = parsedUrl.protocol === 'https:'
        const client = isHttps ? https : http

        const options = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (isHttps ? 443 : 80),
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          timeout: 30000 // 30초 타임아웃
        }

        const req = client.request(options, (res) => {
          let chunks = []
          let data = ''

          // 리다이렉트 처리
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            console.log('리다이렉트:', res.headers.location)
            return this.fetchUrl(res.headers.location)
              .then(resolve)
              .catch(reject)
          }

          // 응답 상태 확인
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`))
            return
          }

          // gzip 압축 해제를 위해 바이너리 데이터로 수집
          res.on('data', (chunk) => {
            chunks.push(chunk)
          })

          res.on('end', async () => {
            try {
              // 바이너리 데이터를 Buffer로 결합
              const buffer = Buffer.concat(chunks)
              
              // gzip 압축 해제 시도
              if (res.headers['content-encoding'] === 'gzip' || 
                  buffer[0] === 0x1f && buffer[1] === 0x8b) {
                try {
                  console.log('🚨 Gzip 압축 데이터 감지, 해제 시도 중...')
                  const decompressed = zlib.gunzipSync(buffer)
                  data = decompressed.toString('utf8')
                  console.log('✅ Gzip 압축 해제 완료')
                } catch (decompressError) {
                  console.error('❌ Gzip 해제 실패, 원본 데이터 사용:', decompressError.message)
                  data = buffer.toString('utf8')
                }
              } else {
                // 일반 텍스트로 처리
                data = buffer.toString('utf8')
              }
              
              resolve(data)
            } catch (error) {
              console.error('응답 처리 중 오류:', error)
              reject(error)
            }
          })
        })

        req.on('error', (error) => {
          console.error('HTTP 요청 에러:', error)
          reject(error)
        })

        req.on('timeout', () => {
          req.destroy()
          reject(new Error('요청 시간 초과'))
        })

        req.end()
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = HttpHandlers
