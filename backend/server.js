'use strict';

const express = require('express');
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');

// // Constants
// const PORT = 8080
// const HOST = '0.0.0.0'
// const cnxn = {
//     'user': process.env.USER,
//     'password': process.env.PASSWORD,
//     'host': process.env.HOST,
//     'port': '5432',
//     'database': 'apps'
// }

// Constants
const PORT = 8080
const HOST = '0.0.0.0'
const cnxn = {
    'user': 
    'password': 
    'host': 
    'port': 
    'database': 
}


const app = express()
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

const db = pgp(cnxn)

app.post('/table/:table/', function(req, res) {
  let {table} = req.params
  let {filterOn, filterBy, columns, unique, addtlQuery} = req.body
  columns = columns && columns.length > 0 ? columns.join(',') : '*'
  unique = unique ? 'DISTINCT' : ''

  let query = `SELECT ${unique} ${columns} FROM ${table}`
  if (filterOn && filterBy) {
    query += ` WHERE ${filterOn} = '${filterBy}'`
  }
  if (addtlQuery) {
    query += addtlQuery
  }

  console.log(query)
  db.query(query, [true])
    .then(data => {
      res.send(data)
    })
    .catch(error => {
      console.log(error)
    })
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
