// setTimeout(() => { appendDataToFile(fs.createWriteStream(fileName, {flags:'as'}),'utf-8', data.data.data, fileName, () => {
//     fs.createWriteStream(fileName, {flags:'as'}).end();
//   })}, 1000)


const path = require('path');
const copyFrom = require('pg-copy-streams').from;
const { Pool, Client} = require('pg');
const config = require('./config.json');
const fs = require('fs');
const host = config.host
const user = config.user
const pw = config.pw
const db = config.db
const port = config.port
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`
const poolPG = new Pool({
    connectionString: conString,
  })

var allBrands = [];
var distinctBrands = [];
const searchTerms = ["jeans", "men's jeans", "women's jeans", "toilet paper", "paper towels", "headphones", "wireless earbuds", "ssd", "fitbit", "tv", "television", "air fryer", "bluetooth headphones", "roku", "external hard drive", "instant pot", "tablet", "micro sd card", "gaming chair", "earbuds", "desk", "office chair", "weighted blanket", "backpack", "water bottle", "hdmi cable", "wireless mouse", "mouse pad", "iphone charger", "phone charger", "bluetooth earbuds", "hydro flask", "gaming mouse", "printer", "bluetooth speakers", "keyboard", "phone", "coffee", "aa batteries", "wireless headphones", "ps4 controller", "xbox controller", "xbox one controller", "shoes", "men's shoes", "women's shoes", "mouse", "shower curtain", "smart watch", "watch", "men's watch", "women's watch", "cbd oil", "led strip lights", "led lights", "pop socket", "sd card", "microwave", "usb cable", "usb c cable", "laptop", "gaming laptop", "mattress", "vacuum", "vacuum cleaner", "phone case", "iphone case", "android case", "desk", "computer desk", "protein powder", "socks", "low cut socks", "knee socks", "men's socks", "women's socks", "underwear", "men's underwear", "women's underwear", "protein powder", "shoe rack", "tv stand", "yoga mat", "aaa batteries", "computer monitor", "monitor", "headset", "gaming headset", "noise cancelling headphones", "blender", "dash cam", "gaming pc", "pc", "luggage", "suitcase", "men's suitcase", "women's suitcase", "usb hub", "camera", "iphone 11 case", "iphone xr case", "iphone x case", "projector", "notebook" ];
var valueBrands = [];
let modifiedSearchTerm = '';
const writeUsers = fs.createWriteStream(`./csv/valuesToInput.csv`);
writeUsers.write('id | brand\n', 'utf8');
  // const valuesData = async () => {


  // for (let i = 0; i < searchTerms.length; i++) {
  //   let specificSearchTerm = searchTerms[i];
  //   return poolPG.query(`Select distinct brand from ${specificSearchTerm}`)
  //   .then((data) => {
  //     console.log(data.rows);
  //     for (var j = 0; j < data.rows.length; j++) {
  //       console.log(data.rows[j].brand);
  //       allBrands.push(data.rows[j].brand);
  //     }
  //   })
     
  //   .then(() => {
  //     console.log(allBrands);
  //   })
  //   .catch((err) => console.log(err));
  // }
  //   }
  //  valuesData();



  async function appendDataToFile(writer, encoding, productInfo, fileName, callback) {
    // let i = data.products.totalCount;
    let i = productInfo.length;
    
    // for (var b = 1; b< 100; b++) {
    //   console.log(results[b]);
    // }
    
    let id = 0;
    let gymid = 0;
    let place = -1;
    let hrc = null;
    let fairtrade = null;
    let peta = null;
    var data;
    async function write() {
        let ok = true;
        do {
            i--;
            id++;
            place++;
            if (gymid === 0) {
                gymid = 1;
                console.log("10 MILLION ADDED");
                }
                else {
                    gymid +=1;
                }
    
                
                
    
          let brand =  productInfo[place]; 
        
          
          const dataGather = await (() => {
             data =  `${id}|${brand}\n`;
          });
          dataGather();
          if (i === 0) {
            return writer.write(data, encoding, callback);
          } else {
    // see if we should continue, or wait
    // don't pass the callback, because we're not done yet.
            ok = writer.write(data, encoding);
            
          }
        } while (i > 0 && ok);
        if (i > 0) {
    // had to stop early!
    // write some more once it drains
          writer.once('drain', write);
        }
      }
    write()
    }





  const  removeDuplicates = (arr) => {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
  }

const valuesData = async () => {
  let dataValues = await poolPG.query(`Select distinct brand from valuesTable`);
  for (var k = 0; k <dataValues.rows.length; k++) {
    valueBrands.push(dataValues.rows[k].brand)
  }
  console.log(valueBrands);
    for (let i = 0; i < searchTerms.length; i++) {
    let specificSearchTerm = searchTerms[i];
    modifiedSearchTerm = specificSearchTerm.replace(/'+/g, '').split(" ").join("");
    try {
    let data = await poolPG.query(`Select distinct brand from ${modifiedSearchTerm}`)
    for (var j = 0; j< data.rows.length; j++) {
      allBrands.push(data.rows[j].brand)
    }
    console.log("all brands: " + allBrands.length);
    }
    catch (err) {
      console.log(err.stack)
    }
  
   
  }
  distinctBrands = removeDuplicates(allBrands);
  console.log("bands after duplicate brands removed: " + distinctBrands.length)
    distinctBrands = distinctBrands.filter(val => !valueBrands.includes(val));
    console.log(distinctBrands.length);
    console.log(distinctBrands);
   
    return distinctBrands;
  
}
valuesData()
.then(async (data) => {
  let fileName = `./csv/valuesToInput.csv`;
  appendDataToFile(fs.createWriteStream(fileName, {flags:'as'}),'utf-8', data, fileName, () => {
    fs.createWriteStream(fileName, {flags:'as'}).end();


});

})
.then(async () => {
  
  const tableCreate = `CREATE TABLE IF NOT EXISTS valuesToInput(id integer NOT null, brand text NOT Null)`;
  const client = new Client({
    connectionString: conString,
  })
  const seedClient = new Client({
    connectionString: conString,
  })

client.connect()
    client.query(tableCreate, err => {  
        if (err) {
        console.log("table not created");
        }
        console.log("CREATED");
    });
    const executeQuery = (targetTable) => {
      const execute = (target, callback) => {
          client.query(`Truncate ${target}`, (err) => {
                  if (err) {
                  client.end()
                  callback(err)
                  // return console.log(err.stack)
                  } else {
                  console.log(`Truncated ${target}`)
                  callback(null, target)
                  
                  
                  }
              })
      }
      execute(targetTable, (err) =>{
          var inputFile = path.join(__dirname, `./csv/${targetTable}.csv`)
          if (err) return console.log(`Error in Truncate Table: ${err}`)
          var stream = client.query(copyFrom(`COPY ${targetTable} FROM STDIN DELIMITER '|' CSV HEADER`))
          var fileStream = fs.createReadStream(inputFile)
          
          fileStream.on('error', (error) =>{
              console.log(`Error in creating read stream ${error}` + error)
            
          })
          stream.on('error', (error) => {
              console.log(`Error in creating stream ${error}`)
          })
          stream.on('end', () => {
              console.log(`Completed loading data into ${targetTable}`)
              fs.unlink(inputFile, (err) => {
                if (err) throw err;
                console.log(`${inputFile} was deleted`);
              });
              client.end()
              .then(() => {
                  seedClient.connect()
                  seedClient.query(`ALTER TABLE ${targetTable} ADD PRIMARY KEY (id);`, err => {  
                      if (err) {
                      console.log(err);
                      }
                      else {
                      console.log("INDEXED");
                      seedClient.end();
                  }
              });
              
              })
              .catch((err) => {
                  console.log(err)
              }) 
          })
          fileStream.pipe(stream);
          fileStream.on("end", () => {
            console.log("This has ended the table input");
          })
      })  
  }
  // Execute the function
  executeQuery('valuesToInput');
})
.catch((error) => {
    console.error(error)
});
