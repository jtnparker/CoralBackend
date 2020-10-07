const { Pool, Client} = require('pg');
const config = require('../config.json');
const host = config.host
const user = config.user
const pw = config.pw
const db = config.db
const port = config.port
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`
const poolPG = new Pool({
    connectionString: conString,
  })



const controller = {
  getAll: (req, res) => {
    poolPG.query(`Select * from valuestoinput`)
      .then((data) => res.status(200).send(data.rows))
      .catch((err) => res.status(400).send(err))
    },
   postValues:(req, res) => {
    
        console.log(req.body)
        // var productID = parseInt(req.params.productID);
        let {brand} = req.body;
        let {peta} = req.body;
        let {hrc} = req.body;
        let {fla} = req.body;
      // console.log(brand);
      // console.log(peta);
        // console.log(`'${email}'`);
       poolPG.query(`INSERT INTO valuestable(brand, hrc, peta, fla) VALUES ('${brand}', ${hrc}, ${peta}, ${fla});`)
       
        .then((data) => {
          res.status(200).send(data.rows);
        
      })
          .catch((err) => res.status(400).send(err))
        },
        deleteBrand: (req, res) => {
        let {id} = req.params;
        console.log(req.params);
        console.log(id);
          poolPG.query(`DELETE FROM valuestoinput where id = ${id}`)
            .then((data) => res.status(200).send(data.rows))
            .catch((err) => res.status(400).send(err))
          }
}

module.exports = controller;