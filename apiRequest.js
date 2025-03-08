const request = require('request');
const xml2js = require('xml2js');
const logger = require('./logger')

// XML 파싱 함수
const parseXML = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// API 요청 함수
const makeRequest = (url, method = 'GET') => {
    return new Promise((resolve, reject) => {
        request({
            url,
            method
        }, async function (error, response, body) {
            if (error) {
                logger.logError('API 요청 중 오류 발생', error);
                reject(error);
            } else {
                try {
                    // 원본 데이터 로깅
                    logger.logOriginalData(body);
                    // XML 응답인 경우 파싱
                    if (response.headers['content-type'] && 
                        response.headers['content-type'].includes('xml')) {
                        const parsedData = await parseXML(body);
                        
                        // 파싱된 데이터 로깅
                        logger.logParsedData(parsedData);
                        
                        resolve(parsedData);
                    } else {
                        // JSON인 경우
                        const jsonData = JSON.parse(body);
                        logger.logParsedData(jsonData);
                        // XML이 아닌 경우 그대로 반환
                        resolve(body);
                    }
                } catch (err) {
                    logger.logError('데이터 파싱 오류', err);
                    reject(err);
                }
            }
        });
    });
};

module.exports = {
    makeRequest
};