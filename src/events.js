var events = require('events');

module.exports = function(server) {
    var io = require('socket.io')(server);
    var database = require('./database');
    var eventEmitter = new events.EventEmitter();

    io.on('connection', function (socket) {
        var stats = [
            {'type': 'currency-sell', 'name': 'Sell', 'class': 'number'},
            {'type': 'currency-buy', 'name': 'Buy', 'class': 'number'},
            {'type': 'messages-received', 'name': 'Messages received', 'class': 'number'}
        ];
        socket.emit('stats-list', stats);
        eventEmitter.on("em:stats:messages-received", function(data) {
            socket.emit('stats:messages-received', {'data': {'messagesPerMinute': data[0].messages_per_minute, 'hourTrend': 'desc'}});
        });
        eventEmitter.on("em:stats:currency-sell", function (topSellRows) {
            socket.emit('stats:currency-sell', {'data': topSellRows});
        });
        eventEmitter.on("em:stats:currency-buy", function (topBuyRows) {
            socket.emit('stats:currency-buy', {'data': topBuyRows});
        });
    });

    setInterval(function () {
        database.getMessagesReceived(function (err, row) {
            eventEmitter.emit('em:stats:messages-received', row);
        });

        database.getTopSell(function (err, topSellRows) {
            eventEmitter.emit('em:stats:currency-sell', topSellRows);
        });
        database.getTopBuy(function (err, topSellRows) {
            eventEmitter.emit('em:stats:currency-buy', topSellRows);
        });
    }, 3000);
};