const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping') // '/ping'으로 명령어 이름 지정 (한글 가능, 대문자 불가능)
        .setDescription('ping and pong'), // '/ping'을 대화 채널에 타이핑 했을 때 뜨는 도움말
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
        //await interaction.reply(`pong`); // '/ping' 를 입력했을 때 봇이 'pong'으로 대답
    },
};

// property
// data: Discord에 등록될 command 정의
// execute: 해당 command가 사용될 때 event handler에 의해 실행될 메소드