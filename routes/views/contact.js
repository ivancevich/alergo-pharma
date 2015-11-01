'use strict';

var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {
  
  var view = new keystone.View(req, res);
  var locals = res.locals;
  
  // Set locals
  locals.section = 'contact';
  locals.title = 'Alergo Pharma - Contacto';
  locals.formData = req.body || {};
  locals.validationErrors = {};
  locals.enquirySubmitted = false;
  
  // On POST requests, add the Enquiry item to the database
  view.on('post', { action: 'contact' }, function (next) {
    
    var newEnquiry = new Enquiry.model(),
      updater = newEnquiry.getUpdateHandler(req);
    
    updater.process(req.body, {
      flashErrors: true,
      fields: 'name, email, phone, message',
      errorMessage: 'Hubo un problema enviando su mensaje:'
    }, function (err) {
      if (err) {
        locals.validationErrors = err.errors;
      } else {
        locals.enquirySubmitted = true;
        newEnquiry.sendEmail();
      }
      next();
    });
    
  });
  
  view.render('contact');
  
};
