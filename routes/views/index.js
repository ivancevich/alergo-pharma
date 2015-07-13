'use strict';

var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  locals.section = 'home';

  view.query('home', keystone.list('Home').model.findOne());

  view.render('index');

};
