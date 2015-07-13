'use strict';

var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  locals.section = 'products';
  locals.title = 'Alergo Pharma - Productos';

  view.render('products');

};
