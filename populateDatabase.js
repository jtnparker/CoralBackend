const axios = require('axios');
const copyFrom = require('pg-copy-streams').from;
const productQueryUrl = 'https://ads.api.cj.com/query';
// const searchTerms = ["jeans", "toilet paper"];
// const searchTerms = ["jeans", "toilet paper", "paper towels", "women's jeans", "headphones", "wireless earbuds", "ssd", "fitbit", "tv"];
const searchTerms = ["jeans", "men's jeans", "women's jeans", "toilet paper", "paper towels", "headphones", "wireless earbuds", "ssd", "fitbit", "tv", "television", "air fryer", "bluetooth headphones", "roku", "external hard drive", "instant pot", "tablet", "micro sd card", "gaming chair", "earbuds", "desk", "office chair", "weighted blanket", "backpack", "water bottle", "hdmi cable", "wireless mouse", "mouse pad", "iphone charger", "phone charger", "bluetooth earbuds", "hydro flask", "gaming mouse", "printer", "bluetooth speakers", "keyboard", "phone", "coffee", "aa batteries", "wireless headphones", "ps4 controller", "xbox controller", "xbox one controller", "shoes", "men's shoes", "women's shoes", "mouse", "shower curtain", "smart watch", "watch", "men's watch", "women's watch", "cbd oil", "led strip lights", "led lights", "pop socket", "sd card", "microwave", "usb cable", "usb c cable", "laptop", "gaming laptop", "mattress", "vacuum", "vacuum cleaner", "phone case", "iphone case", "android case", "desk", "computer desk", "protein powder", "socks", "low cut socks", "knee socks", "men's socks", "women's socks", "underwear", "men's underwear", "women's underwear", "protein powder", "shoe rack", "tv stand", "yoga mat", "aaa batteries", "computer monitor", "monitor", "headset", "gaming headset", "noise cancelling headphones", "blender", "dash cam", "gaming pc", "pc", "luggage", "suitcase", "men's suitcase", "women's suitcase", "usb hub", "camera", "iphone 11 case", "iphone xr case", "iphone x case", "projector", "notebook" ];

const path = require('path');
const limit = 10000;
let specificSearchTerm = '';
let cjData = [];
const fs = require('fs');
let values = [];
let modifiedSearchTerm = '';


const { Pool, Client} = require('pg');
const config = require('./config.json');
const authorization = config.authorization;
const host = config.host
const user = config.user
const pw = config.pw
const db = config.db
const port = config.port
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`
const poolPG = new Pool({
    connectionString: conString,
  })
  const valuesData = async () => {
  return poolPG.query(`Select * from valuesTable`)
  .then((data) => values = data.rows)
  .catch((err) => console.log(err));
  }

// writeUsers.write('reviewid | gymid | nameid | gymscore | trainerscore | trainerid | likes | time | quotes\n', 'utf8');
const fileChecker = async (filename) => {
fs.open(filename,'r',function(err, fd){
    if (err) {
      const writeUsers = fs.createWriteStream(filename);
      writeUsers.write('id | title | brand | advertiserId | catalogId | imageLink | cost | currency | clickUrl | imageUrl | hrc | peta | fairtrade \n', 'utf8');
      writeUsers.end();
      
    } else {
      console.log("The file exists!");
    }
  });
}

async function appendDataToFile(writer, encoding, productInfo, fileName, callback) {
// let i = data.products.totalCount;
let i = productInfo.products.totalCount;
if (productInfo.products.totalCount > 10000)  {
  i = 10000;
}

let results = productInfo.products.resultList;
// for (var b = 1; b< 100; b++) {
//   console.log(results[b]);
// }

let id = 0;
let gymid = 0;
let place = -1;
let hrc = 0;
let fla = 0;
let peta = 0;
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

            for (var j = 0; j < values.length; j++) {
              if (values[j].brand === results[place].brand) {
                hrc = values[j].hrc;
                fla = values[j].fla;
                peta = values[j].peta;
                break;
              }
              else {
                hrc = 0;
                fla = 0;
                peta = 0;
              }
            }
            
            

      let brand =  results[place].brand; 
    
      let advertiserId =  results[place].advertiserId; 
      let catalogId =  results[place].catalogId; 
      let imageLink =  results[place].imageLink; 
      let cost =  results[place].price.amount;
      let title =  results[place].title;
      title = title.replace(/\n/g, '').replace(/"/g, ' inch');
      // let title =  results[place].title
      let currency =  results[place].price.currency;
      let clickUrl =  results[place].linkCode.clickUrl;
      let imageUrl =  results[place].linkCode.imageUrl;     
    //   let description =  results[place].description;  
      
      const dataGather = await (() => {
         data =  `${id}|${title}|${brand}|${advertiserId}|${catalogId}|${imageLink}|${cost}|${currency}|${clickUrl}|${imageUrl}|${hrc}|${peta}|${fla}\n`;
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
// var productQuery = {
//     query: ` query products($cid: ID!, $prid: ID!, $joined: PartnerStatus, $searchTerm: [String!], $limit: Int) {
//         products(companyId: $cid limit: $limit keywords: $searchTerm partnerStatus: $joined) {
//             totalCount
//             resultList {
//               brand,
//               advertiserId,
//               catalogId,
//               id,
//               title,
//               description,
//               imageLink,
              
//               price {0
//                 amount,
//                 currency
//               }
//               linkCode(pid: $prid) {
//                 clickUrl,
//                 imageUrl,
//                 clickUrl
                
//               }
//     }}}`,
// variables: {
//     cid: "5541501",
//     prid: "100200821",
//     joined: 'JOINED',
//     searchTerm: specificSearchTerm,
//     limit: limit
// }};


const searchCategories = async () => {
    for (let i = 0; i < searchTerms.length; i++) {
        specificSearchTerm = await searchTerms[i];
        modifiedSearchTerm = specificSearchTerm.replace(/'+/g, '').split(" ").join("");
        var productQuery = {
            query: ` query products($cid: ID!, $prid: ID!, $joined: PartnerStatus, $searchTerm: [String!], $limit: Int) {
                products(companyId: $cid limit: $limit keywords: $searchTerm partnerStatus: $joined) {
                    totalCount
                    resultList {
                      brand,
                      advertiserId,
                      catalogId,
                      id,
                      title,
                      imageLink,
                      
                      price {
                        amount,
                        currency
                      }
                      linkCode(pid: $prid) {
                        clickUrl,
                        imageUrl,
                        clickUrl
                        
                      }
            }}}`,
        variables: {
            cid: "5541501",
            prid: "100200821",
            joined: 'JOINED',
            searchTerm: specificSearchTerm,
            limit: limit
        }};

       
        let fileName = `./csv/${modifiedSearchTerm}.csv`;

        await fileChecker(fileName);
        const axiosResponse = await axios.post(productQueryUrl, productQuery, {
            headers: {
                'Authorization': authorization
            }
        
        })
        .then(async (data) => {
           
          console.log(`Returned ${data.data.data.products.totalCount} Items for a ${specificSearchTerm} Search`);
          console.log(values);
           return appendDataToFile(fs.createWriteStream(fileName, {flags:'as'}),'utf-8', data.data.data, fileName, () => {
            fs.createWriteStream(fileName, {flags:'as'}).end();
          });
            // fs.open(filename,'r',function(err, fd){
            //     if (err) {
            //       const writeUsers = fs.createWriteStream(filename);
            //     } else {
            //       console.log("The file exists!");
            //     }
            //   });



        // console.log(data.data.data.products.resultList);
        
        })
        .then(async () => {
  
          const tableCreate = `DROP TABLE IF EXISTS ${modifiedSearchTerm}; CREATE TABLE IF NOT EXISTS ${modifiedSearchTerm}(id integer NOT null, title text NOT Null, brand text NOT null, advertiserId integer NOT Null, catalogId integer NOT null, imageLink text NOT null, cost text NOT null, currency text NOT null, clickUrl text NOT null, imageUrl text NOT null, hrc integer NOT null, peta integer NOT null, fairtrade integer NOT null)`;
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
                          seedClient.query(`ALTER TABLE ${targetTable} ADD PRIMARY KEY (id);  CREATE INDEX ${targetTable}_brand_idx on ${targetTable} (brand);`, err => {  
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
          executeQuery(modifiedSearchTerm);
        })
        .catch((error) => {
            console.error(error)
        });
        console.log(axiosResponse);

    }
}
valuesData();
searchCategories();


