const request = require('request');
const xml2js = require('xml2js');

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
                reject(error);
            } else {
                try {
                    // XML 응답인 경우 파싱
                    if (response.headers['content-type'] && 
                        response.headers['content-type'].includes('xml')) {
                        const parsedData = await parseXML(body);
                        resolve(parsedData);
                    } else {
                        // XML이 아닌 경우 그대로 반환
                        resolve(body);
                    }
                } catch (err) {
                    reject(err);
                }
            }
        });
    });
};

module.exports = {
    makeRequest
};