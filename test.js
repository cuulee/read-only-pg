const ropg = require('./index');

const client = new ropg.Client({
  user: 'py',
  password: 'zim',
  port: 5432,
  host: 'gis.georeactor.com',
  database: 'pyzim'
});

// throws error if something is wrong
client.connect((err) => {
  if (err) {
    throw err;
  }
  client.query('SELECT NOW();', (err, results) => {
    console.log(err || results.rows);
    client.end();
  });
});
