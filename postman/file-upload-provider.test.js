const {handleResult} = require('jest-runner-newman/handle-result')
const newman = require('newman');

module.exports = newman.run({
  collection: `./pact/postman/collections/test-consumer-file-upload-provider.postman.json`,
  environment: `./pact/postman/env/test-consumer-file-upload-provider.postman.env.json`,
  reporters: ['cli'],
  // any other newman configs
}, (err, result) => {
  handleResult(err, result);

  // anything else you want
})