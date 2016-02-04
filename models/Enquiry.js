'use strict';
var fs = require('fs');
var keystone = require('keystone');
var fileType = require('file-type');
var readChunk = require('read-chunk');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
  nocreate: true,
  noedit: true
});

Enquiry.add({
  name: { type: Types.Name, required: true },
  email: { type: Types.Email, required: true },
  phone: { type: String },
  prescription: { type: Types.Url },
  message: { type: Types.Markdown, required: true },
  createdAt: { type: Date, 'default': Date.now }
});

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, createdAt';

Enquiry.schema.methods.sendEmail = function() {
  var enquiry = this;

  keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
    if (err) return console.error('Error getting admins', err);

    getPrescription(enquiry, function(err, prescription) {
      var Email = new keystone.Email('enquiry-notification');
      var attachments = [];

      if (prescription) {
        attachments.push(prescription);
      }

      Email.send({
          subject: 'Consulta desde la web de Alergo-Pharma',
          tags: 'Enquiry',
          to: admins,
          from: {
            name: enquiry.name.first + (enquiry.name.last ? (' ' + enquiry.name.last) : ''),
            email: enquiry.email
          },
          attachments: attachments,
          enquiry: enquiry
      }, function (err, info) {
        if (err) {
          console.error('Error sending enquiry email', err);
        }
      });
    });

  });
};

Enquiry.register();

function getPrescription(enquiry, callback) {
  if (!enquiry.prescription) {
    return callback();
  }

  fs.readFile(enquiry.prescription, 'base64', function (err, data) {
    if (err) {
      return callback(err);
    }

    var buffer = readChunk.sync(enquiry.prescription, 0, 262);
    var type = fileType(buffer) || {};

    callback(null, {
      type: type.mime,
      name: 'prescripcion.' + type.ext,
      content: data,
    });
  });
}
