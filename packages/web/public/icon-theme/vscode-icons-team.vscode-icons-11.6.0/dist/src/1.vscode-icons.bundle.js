(exports.ids = [1]),
  (exports.modules = {
    296: function (e) {
      e.exports = JSON.parse(
        '{"$schema":"http://json-schema.org/draft-07/schema#","title":"Integrity","description":"Integrity object schema","definitions":{"entity":{"title":"The contents or computed hash of the directory","type":["object","string"],"properties":{"hash":{"$ref":"#/definitions/hash"},"contents":{"$ref":"#/definitions/hashes"}},"required":["hash","contents"]},"hash":{"title":"The computed hash of the directory","type":"string"},"hashes":{"title":"The computed hashes","type":"object","patternProperties":{"^[\\\\w-.]+$":{"$ref":"#/definitions/entity"}}}},"properties":{"version":{"title":"The schema version","type":"string","pattern":"^[0-9](?:\\\\.[0-9])?$"},"hashes":{"$ref":"#/definitions/hashes"}},"required":["version","hashes"]}',
      );
    },
  });
