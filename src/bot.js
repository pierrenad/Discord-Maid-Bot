/***************************
 * Created by pierrenad
 * Maid Bot with discord js
 ***************************/

require('dotenv').config(); // get the environment variables into process.env
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = ['$'];
exports.prefix = prefix;
exports.servers = {};

const commandHandler = require('./commands');

client.once('ready', () => {
    console.log('Here I am');
    client.user.setPresence({ status: "online", activity: { name: prefix[0] + 'help | v1.0' } });
});

client.on('message', commandHandler);

// new member get a role and send message to welcome the member
client.on('guildMemberAdd', async function (member) {
    if (member.user.bot.valueOf()) return;
    if (member.guild.id === '509462489935904794') { // test server
        const role = member.guild.roles.cache.find(role => role.name === 'newbies');
        member.roles.add(role);
        const embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.avatarURL())
            .setColor(0xff0000)
            .setDescription("A rejoint **" + member.guild.name + "**\nBienvenue **" + member.user.tag + "** !")
            .setFooter(`Voici notre ${member.guild.memberCount}eme membre`, member.guild.iconURL());
        await member.guild.channels.cache.get('776562644538621963').send(embed);
        return;
    }
    // real server (astral)
    const role = member.guild.roles.cache.find(role => role.name === 'Recrue');
    member.roles.add(role);
    const embed = new Discord.MessageEmbed()
        .setAuthor(member.user.tag, member.user.avatarURL())
        .setColor(0xff0000)
        .setDescription("A rejoint **" + member.guild.name + "**\nBienvenue **" + member.user.tag + "** !")
        .setFooter(`Voici notre ${member.guild.memberCount}eme membre`, member.guild.iconURL());
    await member.guild.channels.cache.get(process.env.CHANNEL_ASSISTANT).send(embed);
});

// on reaction -> change the role of the member
client.on('messageReactionAdd', async function (reaction, user) {
    if (user.bot) return;
    if (reaction.message.guild.id === '509462489935904794') { // test server
        if (reaction.message.channel.id === '778413087475761193') {
            const addRole = reaction.message.channel.guild.roles.cache.find(role => role.name === 'Un peu moins');
            const delRole = reaction.message.channel.guild.roles.cache.find(role => role.name === 'newbies');
            var member = reaction.message.guild.members.cache.get(user.id);
            if (!member.roles.cache.has(addRole.id))
                await member.roles.add(addRole);
            if (member.roles.cache.has(delRole.id)) {
                await member.roles.remove(delRole);
            }
        }
        return;
    }
    if (reaction.message.channel.id === process.env.CHANNEL_REGLEMENT) {
        const addRole = reaction.message.channel.guild.roles.cache.find(role => role.name === 'Légion');
        const delRole = reaction.message.channel.guild.roles.cache.find(role => role.name === 'Recrue');
        var member = reaction.message.guild.members.cache.get(user.id);
        if (!member.roles.cache.has(addRole.id))
            await member.roles.add(addRole);
        if (member.roles.cache.has(delRole.id)) {
            await member.roles.remove(delRole);
        }
    }
});
client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.cache.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.cache.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.messages.fetch(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.cache.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
        }
    });
});

/* works but doesn't have any verification of the message sent 
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    channel_id = error.path.split('/')[2];
    let embedQueue = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setDescription('Trop de musiques dans la queue pour pouvoir les afficher')
        .setTitle("❌ Erreur ❌");
    var found;
    client.guilds.cache.forEach(guild => {
        try {
            found = guild.channels.cache.get(channel_id);
        }
        catch (e) {
            console.log('Not this guild : ' + guild);
        }
        if (found) {
            found.messages.fetch({ limit: 1 }).then(message => {
                let content = (prefix[0] + 'queue');
                if (message.first().content === content) {
                    console.log('queue');
                }
                else {
                    console.log('else');
                }
            })
            found.send(embedQueue);
        }
    })
});*/

client.login(process.env.BOT_TOKEN);