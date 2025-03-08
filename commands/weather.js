const { SlashCommandBuilder } = require('discord.js');
const { weather_token, weather_url } = require('../config.json');
//const request = require('request');
//const xml2js = require('xml2js');
const { makeRequest } = require('../apiRequest');
const logger = require('../logger')

/*
const parseXML = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
*/

module.exports = {
    data: new SlashCommandBuilder()
        .setName('날씨') // '/ping'으로 명령어 이름 지정 (한글 가능, 대문자 불가능)
        .setDescription('현재 서울 날씨 알림'), // '/ping'을 대화 채널에 타이핑 했을 때 뜨는 도움말
    async execute(interaction) {
        // 현재 날짜와 시간 (예: 20210325, 0600)
        const now = new Date();
        const base_date = now.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD 형식
        const base_time = `${now.getHours()}00`; // 시간은 HH00 형식

        // 예시로 서울의 좌표 (nx, ny)
        const nx = 55;
        const ny = 127;

        // API 요청 URL 설정
        let queryParams = `?serviceKey=${encodeURIComponent(weather_token)}`
            + `&pageNo=1&numOfRows=1000&dataType=XML`
            + `&base_date=${base_date}&base_time=${base_time}`
            + `&nx=${nx}&ny=${ny}`;
        
        const fullUrl = weather_url + queryParams;

        logger.logApiRequest(fullUrl);

        try {
            logger.logInfo('날씨 명령어 실행 중...');
            const weatherInfo = await makeRequest(fullUrl);
            const temperature = weatherInfo.response.body[0].items[0].item[3].obsrValue[0];
            // body[0].items[0].item[[0: PTY], [1:REH], [2:RN1], [3:T1H(기온)], [4: UUU], [5: VEC], [6: VVV], [7: WSD]]
            logger.logInfo(`추출된 온도 정보: ${temperature}°C`);
            
            // message.channel.send(`현재 서울 온도: ${temperature}°C`);
            interaction.reply(`현재 서울 온도: ${temperature}°C`); 
        } catch (err) {
            //console.error(err);
            logger.logError('날씨 정보를 가져오는 중 오류 발생', err);
            message.channel.send('날씨 정보를 파싱하는 데 문제가 발생했습니다.');
        }
        /*
        request({
            url: weather_url + queryParams,
            method: 'GET'
        }, async function (error, response, body) {
            if (error) {
                console.error(error);
                message.channel.send('날씨 정보를 가져오는 데 문제가 발생했습니다.');
            } else {
                // XML 파싱
                try {
                    const parsedData = await parseXML(body);
                    // 여기서 parsedData를 이용해 필요한 정보를 추출합니다.
                    // 예시: 기온, 날씨 상태 등을 출력
                    const temperature = parsedData.response.body[0].items[0].item[0].obsrValue[0];
                    // message.channel.send(`현재 서울 온도: ${temperature}°C`);
                    interaction.reply(`현재 서울 온도: ${temperature}°C`); 
                } catch (err) {
                    console.error(err);
                    message.channel.send('날씨 정보를 파싱하는 데 문제가 발생했습니다.');
                }
            }
        });    
        */
    },
};


