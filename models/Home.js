'use strict';

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Home Model
 * ==========
 */

var Home = new keystone.List('Home', {
  nocreate: true,
  nodelete: true
});

Home.add({
  title: { type: String, required: true, initial: true }
});

Home.defaultColumns = 'title';
Home.register();
