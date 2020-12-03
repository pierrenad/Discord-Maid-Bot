const GphApiClient = require('giphy-js-sdk-core');

module.exports = async (msg, args, command) => {
    if(!args.length) return; 
    const api = process.env.GIF_API;

    const giphy = GphApiClient(api);
    var argument = args.join(' ');

    giphy.random('gifs', { 'tag': argument, 'rating': 'g' })
        .then(gif => {
            msg.channel.send(gif.data.url);
        });
}