'use strict';

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Home Model
 * ==========
 */

var Home = new keystone.List('Home', {
  nocreate: true,
  nodelete: true,
  map: { name: 'title' }
});

Home.add({
  title: { type: String, required: true, initial: true },
  subtitle: { type: String, required: true, initial: true },
  description: {
    title: { type: String, required: true, initial: true },
    text: { type: Types.Html, wysiwyg: true, height: 400, required: true, initial: true }
  }
});

Home.defaultColumns = 'title';
Home.register();
