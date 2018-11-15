# read-only-pg

I created this module because I wanted code-learners to run SQL from
ObservableHQ and other sites which only support fetch / HTTP requests.
I already made a read-only user for my database, so it was safe to create
an open endpoint. To confirm that it was safe, and to avoid others using
my code and exposing their databases in an unsafe way, I created a node module.

It works like this:
- receive the username / password / host information for a PostgreSQL db
- get a list of user's non-SELECT permissions on tables
- attempt to CREATE a new table
- if any of the above succeeds, refuse to start
- if the tables are truly all read-only, then connect to PostgreSQL and allow queries

If you add a new table to your database, restart your server to verify that
is is read-only!!!

```javascript
const ropg = require('read-only-pg')
const client = new ropg.Client({ user: 'read', password: 'only', port: 5432, host: 'db.example.com' });

// throws error if something is wrong
client.connect((err) => {
  // callback optional
  if (err) {
    throw err;
  }
  
  // when everything is OK
  client.query('SELECT NOW()')
});
```

## License

Open source, MIT license
