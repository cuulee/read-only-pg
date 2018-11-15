const pg = require('pg');

let Client = function (params) {
  this.params = params;
  this.innerClient = null;
};

Client.prototype.query = function (a, b, c) {
  if (this.innerClient) {
    this.innerClient.query(a, b, c);
  } else {
    throw new Error('Read-only not yet verified!');
  }
};

Client.prototype.end = function () {
  if (this.innerClient) {
    this.innerClient.end();
  }
};

Client.prototype.connect = function(callback) {
  if (!callback) {
    callback = () => {};
  }
  //console.log('attempting connect');
  //console.log(this.params);
  let innerClient = new pg.Client(this.params);
  innerClient.connect((err) => {
    if (err) {
      throw err;
    }

    // connected now
    innerClient.query("SELECT grantee, privilege_type, table_name FROM information_schema.role_table_grants WHERE privilege_type != 'SELECT'", (err, results) => {
      if (err) {
        throw err;
      }
      if (results.rows.length > 0) {
        console.log(results.rows);
        return callback('You have some non-SELECT permissions!');
      } else {
        innerClient.query('CREATE TABLE xyz_read_only_pg (a INT)', (create_err) => {
          // error is good here
          if (create_err && create_err.code === '42501') {
            this.innerClient = innerClient;
            return callback();
          } else if (create_err) {
            return callback('You have a non-permissions error on CREATE TABLE');
          } else {
            return callback('You have a CREATE TABLE permission!');
          }
        });
      }
    });
  });
};

module.exports = {
  Client: Client
};
