const ytdl = require('ytdl-core');
const search = require('youtube-search');
const Discord = require('discord.js');
const servers = require('../bot').servers;
const getUrlTitle = require("get-url-title");

function play(connection, msg) {
    var server = servers[msg.guild.id];
    const stream = ytdl(server.queue[0].url, { filter: 'audioonly' });
    server.dispatcher = connection.play(stream);

    server.queue.shift();

    server.dispatcher.on("finish", async () => {
        if (server.queue[0]) {
            play(connection, msg);
            return;
        }
        connection.disconnect();
    })
}

module.exports = async (msg, args, command) => {
    if (!servers[msg.guild.id]) {
        servers[msg.guild.id] = {
            queue: [],
            channels: [],
            roles: {
                roles: [],
                admin: []
            }
        }
    }
    const server = servers[msg.guild.id];
    if (server.channels.find(item => item.name === 'ai') && msg.channel.id !== server.channels.find(item => item.name === 'ai').id) return;
    if (!msg.member.voice.channel) {
        let embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription('Faut être dans un channel vocal mon chou 🙄')
            .setTitle('❌ Erreur ❌');
        await msg.channel.send(embed);
        return;
    }
    // if (msg.member.voice.channel.id === process.env.CHANNEL_AFK) {
    //     let embed = new Discord.MessageEmbed()
    //         .setColor("#ff0000")
    //         .setDescription('T\'est pas dans un channel vocal approprié 😘')
    //         .setTitle('❌ Erreur ❌');
    //     await msg.channel.send(embed);
    //     return;
    // }

    switch (command) {
        case 'play':
            if (!args.length) return;

            // verify if url is given or not
            var isUrl = true;
            var isYoutube = false;
            try {
                args.join(' ').split('://');
            } catch (e) { isUrl = false; }
            if (isUrl)
                try {
                    var siteName = args.join(' ').split('://')[1].split('/')[0];
                } catch (e) { }
            if (siteName === 'www.youtube.com')
                isYoutube = true;

            if (isYoutube) { // if youtube link
                // var server = servers[msg.guild.id];
                var urlTitle;
                async function getTitleAndAddToQueue() {
                    urlTitle = await getUrlTitle(args.join(' '));
                    server.queue.push({ url: args.join(' '), title: urlTitle });

                    let embed = new Discord.MessageEmbed()
                        .setColor("#73ffdc")
                        .setDescription(urlTitle)
                        .setTitle("Added to the queue");
                    msg.channel.send(embed);

                    if (msg.member.voice.channel.members.has(process.env.BOT_ID)) {
                        return;
                    }
                    else {
                        msg.member.voice.channel.join().then(connection => {
                            play(connection, msg);
                        })
                    }
                }
                getTitleAndAddToQueue();
            }
            else { // if not an url
                var opts = {
                    maxresults: 5,
                    key: process.env.YT_API_KEY,
                    type: 'video'
                };
                try {
                    var result = await search(args.join(' '), opts);
                }
                catch (e) {
                    if (e.response.status === 403) {
                        let embed = new Discord.MessageEmbed()
                            .setColor("#ff0000")
                            .setDescription('Plus de musique pour aujourd\'hui 😭\nMais tu peux toujours donner un lien si tu y tiens vraiment 🙄')
                            .setTitle("❌ Erreur ❌");
                        msg.channel.send(embed);
                    }
                    else {
                        let embed = new Discord.MessageEmbed()
                            .setColor("#ff0000")
                            .setDescription('Une erreur est survenue 🤔')
                            .setTitle("❌ Erreur ❌");
                        msg.channel.send(embed);
                    }
                    return;
                }
                var resp = '';
                var numberOfChoices = 5;
                for (var i = 0; i < numberOfChoices; i++) {
                    resp += `**[${parseInt(i) + 1}]** \'${result.results[i].title}\'\n`;
                }
                resp += `**[❌]** Cancel`;

                var theResult;
                let embed = new Discord.MessageEmbed()
                    .setColor("#73ffdc")
                    .setDescription(resp)
                    .setTitle('Musiques proposées')
                    .setFooter('Fais ton choix en réagissant à ce message');
                msg.channel.send(embed).then(async function (sent) {
                    await sent.react('1️⃣')
                        .then(() => sent.react('2️⃣'))
                        .then(() => sent.react('3️⃣'))
                        .then(() => sent.react('4️⃣'))
                        .then(() => sent.react('5️⃣'))
                        .then(() => sent.react('❌'))
                        .then(() => sent.awaitReactions(async function (reaction) {
                            switch (reaction._emoji.name) {
                                case '1️⃣':
                                    theResult = await result.results[0];
                                    sent.delete();
                                    break;
                                case '2️⃣':
                                    theResult = await result.results[1];
                                    sent.delete();
                                    break;
                                case '3️⃣':
                                    theResult = await result.results[2];
                                    sent.delete();
                                    break;
                                case '4️⃣':
                                    theResult = await result.results[3];
                                    sent.delete();
                                    break;
                                case '5️⃣':
                                    theResult = await result.results[4];
                                    sent.delete();
                                    break;
                                case '❌':
                                    sent.delete();
                                    break;
                                default:
                                    console.log('Autre emoji non pris en compte');
                            }
                        }));

                    if (!theResult) {
                        let embed = new Discord.MessageEmbed()
                            .setColor("#73ffdc")
                            .setDescription('Demande de musique annulée')
                            .setTitle("Canceled");
                        msg.channel.send(embed);
                        return;
                    }
                    // var server = servers[msg.guild.id];
                    server.queue.push({ url: theResult.link, title: theResult.title });

                    let embed = new Discord.MessageEmbed()
                        .setColor("#73ffdc")
                        .setDescription(theResult.title)
                        .setTitle("Added to the queue");
                    msg.channel.send(embed);

                    if (msg.member.voice.channel.members.has(process.env.BOT_ID)) {
                        return;
                    }
                    else {
                        msg.member.voice.channel.join().then(connection => {
                            play(connection, msg);
                        })
                    }
                })
            }
            break;
        case 'skip':
            // var server = servers[msg.guild.id];
            if (server.dispatcher)
                server.dispatcher.end(); // will end and go back to play (event) if there is something in the queue
            break;
        case 'pause':
            // var server = servers[msg.guild.id];
            if (server.dispatcher) {
                server.dispatcher.pause();
            }
            break;
        case 'resume':
            // var server = servers[msg.guild.id];
            if (server.dispatcher) {
                server.dispatcher.resume();
            }
            break;
        case 'leave':
            // var server = servers[msg.guild.id];
            if (msg.guild.voice.connection) {
                msg.guild.voice.connection.disconnect();
            }
            break;
        case 'queue':
            // var server = servers[msg.guild.id];
            var resp = [];
            if (server.queue.length === 0) {
                resp.push('No song in the queue');
            }
            else {
                for (i in server.queue) {
                    resp += `${server.queue[i].title}\n`;
                }
            }
            let embed = new Discord.MessageEmbed()
                .setColor("#73ffdc")
                .setDescription(resp)
                .setTitle("Music queue");
            msg.channel.send(embed);
            break;
        case 'clearqueue':
            // var server = servers[msg.guild.id];
            var resp = [];
            if (server.queue.length === 0) {
                resp.push('La queue est déjà vide');
            }
            else {
                server.queue= [];
                resp.push('La queue a été vidée')
            }
            let embedcls = new Discord.MessageEmbed()
                .setColor("#73ffdc")
                .setDescription(resp)
                .setTitle("Music queue");
            msg.channel.send(embedcls);
            break;
        default:
    }
}