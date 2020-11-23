const Discord = require('discord.js');

module.exports = async (msg) => {
    await msg.channel.send('Ca fonctionne 😊');

    // add a text channel under category
    // msg.guild.channels.create('testing', { type: 'text' }).then(channel => {
    //     let category = msg.guild.channels.cache.find(c => c.name == "Salons textuels" && c.type == "category");
    //     if (!category) return;
    //     channel.setParent(category.id);
    // }).catch(console.error);

    // reaction to a message
    let embed = new Discord.MessageEmbed()
        .setColor("#73ffdc")
        .setDescription('test')
        .setTitle("Testing");
    msg.channel.send(embed).then(sent => {
        // let id = sent.id;
        // console.log(id);
        sent.react('1️⃣')
            .then(() => sent.react('2️⃣'))
            .then(() => sent.react('3️⃣'))
            .then(() => sent.react('4️⃣'))
            .then(() => sent.react('5️⃣'))
            .then(() => sent.react('❌'))
            .then(() => sent.awaitReactions((reaction) => {
                // console.log(reaction.users.cache.find(user => user.username === 'Z_Nyster2')); 
                /**
                 * need to check if new members have react.
                 * members who have already react doesn't need to be checked.
                 * unless someone unreact, we will have to check everyone except new members that didn't react yet
                 */
                sent.delete(); 
            }));
    });
}