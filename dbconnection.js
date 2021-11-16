const mssql = require('mssql')
class DBConnection {
  async getConnection () {
    try {
      return await mssql.connect({
        server: '192.168.1.123',
        authentication: {
          type: 'default',
          options: {
            userName: 'RubixSQL',
            password: 'RubixD0gm@t1x!'
          }
        },
        options: {
          enableArithAbort: true,
          database: 'Rubix',
          trustServerCertificate: true,
          // instanceName: 'SQLEXPRESS',
          rowCollectionOnDone: true,
          useColumnNames: false
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = new DBConnection()
