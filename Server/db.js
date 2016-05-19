var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var format = require('util').format;
var request = require("request");
var cheerio = require("cheerio");
var xpath = require('xpath');
var $, cars = [];
var iconv = require("iconv-lite");
var url = 'mongodb://localhost:27017/cars';

for(var i = 1; i <= 5; i++) {
    var url_data = "http://public.aw.by/search.php?page=" + i;

    request(url_data, function (error, response, body) {
        if (!error) {
            $ = cheerio.load(
                iconv.encode(
                    iconv.decode(
                        new Buffer(body,'binary'),
                        'win1251'),
                    'utf8')
            );

            $('.content2').toArray().forEach(parseCar);

            console.log(cars);
        } else {
            console.log(error);
        }
    });
}

function parseCar(car) {
    var name = $(car).find('b').text().replace(new RegExp("э",'g'),"").replace(new RegExp("..,",'g'),"").replace(new RegExp(":",'g'),"");
    var img = $(car).find('img').attr('src');
    var href = $(car).find('a').attr('href');
    var price = parseInt($(car).find('.price').first().text());
    var date = $(car).find('.link').last().text().replace(new RegExp("э",'g'),"").replace(new RegExp("\n\t\t\t »\n\t\t\t : ",'g'),"").replace(new RegExp("\n\t\t    ",'g'),"");


    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        var collection = db.collection('cars');
        collection.insert({
            "name": name,
            "cost": price,
            "href": href,
            "img": img,
            "date": date
        });

        collection.count(function(err, count){
            console.log(format("count = %s", count));
        });

        collection.find().toArray(function(err, result){
            console.dir(result);
            db.close();
        });

    });
}