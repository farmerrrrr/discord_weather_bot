// 1. 주요 클래스 가져오기
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token, weather_token, weather_url } = require('./config.json');
const request = require('request');
const xml2js = require('xml2js');
const path = require('node:path');
const fs = require('node:fs');

const parseXML = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// 2. 클라이언트 객체 생성 (Guilds관련, 메시지관련 인텐트 추가)
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
]});

// 3. 봇이 준비됐을때 한번만(once) 표시할 메시지
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// 4. 누군가 ping을 작성하면 pong으로 답장한다.
client.on('messageCreate', (message) => {
    if(message.content == 'ping'){
        message.reply('pong');
    }
    if(message.content == '그거 하자 그거'){
        message.reply('그거그거그거');
    }
    if(message.content == 'ㅋㅋ'){
        message.reply('ㅋㅋ;;');
    }
    if(message.content == '이슈'){
        message.reply('비이이이사아아아아아앙!!!!!!!!!!!!!!');
    }
    if(message.content == '헉'){
        message.reply('뭔데 왜 헉인데 에러야? 문제 생겼어? 뭐야 비사아아아아아앙!!!!!!!!');
    }
    if(message.content == '날씨'){
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
                    message.channel.send(`현재 서울 온도: ${temperature}°C`);
                } catch (err) {
                    console.error(err);
                    message.channel.send('날씨 정보를 파싱하는 데 문제가 발생했습니다.');
                }
            }
        });    
    }
})

// 5. 슬래시 커맨드
// 커맨드 등록
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// commands 폴더의 js 파일을 이름과 함께 등록
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

//커맨드 입력 이벤트가 들어온다면
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return; //기존 채팅 커맨드는 제외

    // /ping 입력될 경우 pong으로 대답하기
	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Pong' });
	}

    if (interaction.commandName === '날씨') {
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
                    interaction.reply({ content: `현재 서울 온도: ${temperature}°C` });
                } catch (err) {
                    console.error(err);
                    message.channel.send('날씨 정보를 파싱하는 데 문제가 발생했습니다.');
                }
            }
        });    
	}
});

// *. 시크릿키(토큰)을 통해 봇 로그인 실행
client.login(token);