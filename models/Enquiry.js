'use strict';

var keystone = require('keystone');
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
  message: { type: Types.Markdown, required: true },
  createdAt: { type: Date, 'default': Date.now }
});

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, createdAt';

Enquiry.schema.methods.sendEmail = function() {
  var enquiry = this;

  keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
    if (err) return console.error('Error getting admins', err);

    var Email = new keystone.Email('enquiry-notification');

    Email.send({
        subject: 'Consulta desde la web de Alergo-Pharma',
        tags: 'Enquiry',
        to: admins,
        from: {
          name: enquiry.name.first + ' ' + enquiry.name.last,
          email: enquiry.email
        },
        enquiry: enquiry
    }, function (err, info) {
      if (err) {
        console.error('Error sending enquiry email', err);
      }
    });
  });
};

Enquiry.register();
