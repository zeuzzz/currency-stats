var pg = require('pg');
pg.defaults.poolSize = 3
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/xyz';

exports.getMessagesReceived = function(callback) {
    var sql = "SELECT count(1) AS messages_per_minute FROM message WHERE created_at > current_timestamp - INTERVAL '1 minute'";
    execQuery(sql, callback);
};

exports.getTopSell = function(callback) {
    var sql = "SELECT currency_from AS name, SUM(amount_sell) AS value, 'asc' AS trend FROM message WHERE created_at > current_timestamp - INTERVAL '1 day' GROUP BY currency_from ORDER BY value DESC";
    execQuery(sql, callback);
};

exports.getTopBuy = function(callback) {
    var sql = "SELECT currency_to AS name, SUM(amount_buy) AS value, 'desc' AS trend FROM message WHERE created_at > current_timestamp - INTERVAL '1 day' GROUP BY currency_to ORDER BY value DESC";
    execQuery(sql, callback);
};

var execQuery = function(sql, callback) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query(sql, function (err, result) {
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                return console.error('error running query', err);
            }
            callback(null, result.rows);
        });
    });
};