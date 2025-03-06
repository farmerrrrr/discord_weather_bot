const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping') // '/ping'으로 명령어 이름 지정 (한글 가능, 대문자 불가능)
        .setDescription('ping and pong'), // '/ping'을 대화 채널에 타이핑 했을 때 뜨는 도움말
    async execute(interaction) {
        await interaction.reply(`pong`); // '/ping' 를 입력했을 때 봇이 'ping'으로 대답
    },
};