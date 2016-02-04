'use strict';
var fs = require('fs');
var _ = require('underscore');
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

    uploadFile(req, 'prescription', function (err, filePath) {
      if (err) {
        req.flash('error', {
          type: 'ValidationError',
          title: 'Hubo un problema enviando su mensaje:',
          list: _.pluck(err.errors, 'message')
        });
        return next();
      }

      req.body.prescription = filePath;

      var newEnquiry = new Enquiry.model();
      var updater = newEnquiry.getUpdateHandler(req);

      updater.process(req.body, {
        flashErrors: true,
        fields: 'name, email, phone, prescription, message',
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

  });
  
  view.render('contact');

};

function uploadFile(req, fileName, callback) {
  if (!req.files || !req.files[fileName]) {
    return callback();
  }

  var file = req.files[fileName];
  var path = file.path;

  var tenMB = 10000000;

  if (file.size > tenMB) {
    return callback(getError('La prescripción no puede superar los 10MB'));
  }

  fs.readFile(path, function (err, data) {
    if (err) {
      console.error(err);
      return callback(getError('Error al cargar prescripción'));
    }

    var newPath = process.cwd() + '/uploads/' + file.name;

    fs.writeFile(newPath, data, function (err) {
      if (err) {
        console.error(err);
        return callback(getError('Error al cargar prescripción'));
      }

      callback(null, newPath);
    });

  });
}

function getError(message) {
  return {
    message: 'Validation failed',
    name: 'ValidationError',
    errors: {
      prescription: {
        name: 'ValidatorError',
        path: 'prescription',
        message: message,
        type: 'required'
      }
    }
  }
}
