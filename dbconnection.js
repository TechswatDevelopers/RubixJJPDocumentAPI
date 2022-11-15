const mssql = require('mssql')
class DBConnection {
  async getConnection () {
    try {
      return await mssql.connect({
        server: '129.232.144.178',
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
          encrypt: false,
          trustServerCertificate: false,
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

// const config = {
//   server: '129.232.144.178',
//   authentication: {
//     type: 'default',
//     options: {
//       userName: 'RubixSQL',
//       password: 'RubixD0gm@t1x!'
//     }
//   },
//   options: {
//     enableArithAbort: true,
//     database: 'Rubix',
//     encrypt: false,
//     trustServerCertificate: false,
//     rowCollectionOnDone: true,
//     useColumnNames: false
//   }
// }

// server: '129.232.144.178',
// authentication: {
//   type: 'default',
//   options: {
//     userName: 'RubixSQL',
//     password: 'RubixD0gm@t1x!'
//   }
// },
// options: {
//   enableArithAbort: true,
//   database: 'Rubix',
//   trustServerCertificate: false,
//   // instanceName: 'SQLEXPRESS',
//   rowCollectionOnDone: true,
//   useColumnNames: false
// }
// }
