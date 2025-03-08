// logger.js
const logOriginalData = (data) => {
    console.log('===== 원본 API 응답 데이터 =====');
    console.log(data);
    console.log('==============================');
};

const logParsedData = (data) => {
    console.log('===== 파싱된 데이터 =====');
    console.log(JSON.stringify(data, null, 2));
    console.log('==============================');
};

const logApiRequest = (url) => {
    console.log(`API 요청 URL: ${url}`);
};

const logError = (message, error) => {
    console.error(`[오류] ${message}:`, error);
};

const logInfo = (message) => {
    console.log(`[정보] ${message}`);
};

module.exports = {
    logOriginalData,
    logParsedData,
    logApiRequest,
    logError,
    logInfo
};