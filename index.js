const Discord = require('discord.js');
const client = new Discord.Client({ 
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
});
const { channels } = require('./config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Global Servers', { type: 'LISTENING' });
});

client.on('message', msg => {
    if (msg.author.bot) return;
    let embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setDescription(`${msg.content}`)
        .setTimestamp(new Date())
        .setFooter("Sent From " + msg.guild.name);
    let cache = client.channels.cache;
    let channel = msg.channel;
    for (let i = 0; i < channels.length; i++) {
        if (channel.name === channels[i]) {
            cache.get(channels[i]).send();
        }
    }
});

client.login(process.env.token);