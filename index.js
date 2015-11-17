function PapersParser(crossRefJson) {
  this.crossRefJson = crossRefJson;
  this.result = {};
}

PapersParser.prototype.toJSON = function() {
  this.result.title = this.crossRefJson.title || '';
  this.result.attributed_title = this.result.title;
  this.result.canonical_title = this.result.title.toLowerCase();;

  this.result.doi = this.crossRefJson.DOI;

  if (this.crossRefJson.URL) {
    this.result.url = this.crossRefJson.URL;
  }

  this.result.authors = this.convertAuthorsToPapers();

  this.result.bundle_string = this.crossRefJson['container-title'];
  this.result.bundle = this.convertToBundle();

  this.result.publication_date = this.papersDate(this.crossRefJson.issued ? this.crossRefJson.issued['date-parts'] : null);

  return this.result;
};

function getFirstName(name) {
  if (!name || name.indexOf(' ') === -1) return name;
  return name.split(' ')[0];
}

PapersParser.prototype.convertAuthorsToPapers = function() {
  return (this.crossRefJson.author || []).map(function(author) {
    return {
      fullname: author.given + ' ' + author.family,
      standard_name: author.family + ', ' + author.given,
      surname: author.family,
      prename: getFirstName(author.given),
      firstName: getFirstName(author.given),
      lastName: author.family
    };
  });
};

PapersParser.prototype.convertToBundle = function() {
  var bundle = {};
  // Ask Ben:
  //   subtype
  //   type
  bundle.abbreviation = this.crossRefJson['container-title'] || this.crossRefJson.publisher;
  bundle.title = this.crossRefJson['container-title'] || this.crossRefJson.publisher;
  bundle.citekey_base = this.crossRefJson['container-title'] || this.crossRefJson.publisher;
  bundle.attributed_title = this.crossRefJson['container-title'] || this.crossRefJson.publisher;
  return bundle;
};

PapersParser.prototype.papersDate = function(dateParts) {
  var date;
  var papersDate;
  if (dateParts && dateParts.length && dateParts[0] && dateParts[0][0]) {
    date = new Date(dateParts);
    papersDate = '99';
    papersDate += date.getFullYear();
    papersDate += ('0' + (date.getMonth() + 1)).slice(-2);
    papersDate += ('0' + (date.getDate())).slice(-2);
    papersDate += '1200000000222000';
  }

  return papersDate;
};


module.exports = function(crossRefJson) {
  var parser = new PapersParser(crossRefJson);
  return parser.toJSON();
};
