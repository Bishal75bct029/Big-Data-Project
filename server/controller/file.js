const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const document = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  age: 30
};

client.index({
  index: 'example',
  body: document
}).then((response) => {
  console.log(response);
}).catch((error) => {
  console.error(error);
});