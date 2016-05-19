var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var passport   = require('passport');
var User       = require('./app/user');
var config     = require('./config/db');
var port       = process.env.PORT || 3000;
var jwt        = require('jwt-simple');
var cors       = require('cors');
var clc        = require('cli-color');
var request    = require("request");

var dt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());

mongoose.connect(config.database);

require('./config/passport')(passport);

var apiRoutes = express.Router();

apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Пожалуйста введите логин и пароль.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });

    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Такой логин уже существует.'});
      }
      res.json({success: true, msg: 'Новый пользователь успешно создан.'});
    });
  }
});

apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Пользователь не найден.'});
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.encode(user, config.secret);
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Неверный пароль.'});
        }
      });
    }
  });
});

apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({success: false, msg: 'Пользователь не найден.'});
      } else {
        res.json({success: true, msg: 'Здравстуйте, ' + user.name + '!', name: user.name});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

apiRoutes.get('/carData', function (req, res) {
  mongoose.model('cars', carsInfo).find(function (err, cars) {
    res.json(cars);
    res.end();
  });
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

app.use('/api', apiRoutes);

mongoose.connection.on('error', function (err) {
  console.log(dt + ' - ' + clc.red.bold('Внимание! Ошибка соединения с БД: ' + err));
});

mongoose.connection.on('connected', function () {
  console.log(dt + ' - ' + clc.green('Соединение с БД осуществленно.'));
});

var carsInfo = new mongoose.Schema({
  name: String,
  cost: String,
  href: String,
  img: String,
  date: String
});

/*var url = "http://auto2.yandex.ru/api/1.0/stats/?rid=213&mark=FORD&model=FOCUS";

request({
  url: url,
  json: true
}, function (error, response, body) {

  if (!error && response.statusCode === 200) {
    console.log(body);
  }
});*/



app.listen(port, function () {
  console.log(dt + ' - ' + clc.bold('Сервер запущен - 127.0.0.1:' + port));
});