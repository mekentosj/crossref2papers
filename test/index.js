var assert = require('assert');
var parse = require('./../');
var crossRefJson = require('./fixtures/crossref.json');
var papersOutput = require('./fixtures/papers.json')
  .publications['A08D818B-6A56-4FF6-B3B2-4AE6E33B8CED'];
var result = parse(crossRefJson);

assert.equal(result.doi, papersOutput.doi);
assert.equal(result.publication_date, papersOutput.publication_date);
assert.equal(result.authors.length, papersOutput.authors.length);
assert.equal(result.bundle_string, papersOutput.bundle_string);
assert.equal(result.bundle.title, papersOutput.bundle.title);
