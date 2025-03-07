// 1. 주요 클래스 가져오기
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token, weather_token, weather_url } = require('./config.json');
const path = require('node:path');
const fs = require('node:fs');

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
     //기존 채팅 커맨드는 제외
	if (!interaction.isChatInputCommand()) return;

    // deploy-command.js 파일 실행으로 등록한 command 불러오기
    const command = interaction.client.commands.get(interaction.commandName);

	if (interaction.commandName === 'ping') {
        await command.execute(interaction);
	}

    if (interaction.commandName === '날씨') {
        await command.execute(interaction);
	}
});

// *. 시크릿키(토큰)을 통해 봇 로그인 실행
client.login(token);