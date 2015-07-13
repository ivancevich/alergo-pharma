'use strict';

var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  locals.section = 'respiratory-allergy';
  locals.title = 'Alergo Pharma - Alergia Respiratoria';

  view.render('respiratory-allergy');

};
