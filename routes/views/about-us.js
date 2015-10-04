'use strict';

var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  locals.section = 'about-us';
  locals.title = 'Alergo Pharma - Quiénes Somos';

  view.render('about-us');

};
