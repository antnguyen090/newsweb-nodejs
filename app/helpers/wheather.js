const fs = require('fs');
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const newDate = require('new-date');

let getDataWheather = async (path, data, delay) => {
  let dataFile, dataStore, feed,result
  let dataWheather = [];
  // let dataProcess = await data.forEach(async (item, index)=>{
  //     if (fs.existsSync(`${path}${item.id}`)){
  //       dataFile = fs.readFileSync(`${path}${item.id}`,'utf8')
  //       dataFile = JSON.parse(dataFile)
  //       let datePub = newDate(dataFile.pubDate)
  //       let dateNow = newDate(Date.now())
  //       if(dateNow-datePub > delay){
  //                   // change the endpoint with yours
  //                   result = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${item.api}%20viet%20nam?unitGroup=metric&key=ZTYE8BVSEZGU69YC62WFMKQLH&contentType=json`);
  //                   feed = await result.json();
  //                   feed.pubDate = newDate(Date.now())
  //                   feed.id      = await item.id
  //                   dataStore  =  JSON.stringify(feed);
  //                   dataWheather.push(feed)
  //                   fs.writeFileSync(`${path}${item.id}`, dataStore, err => {
  //                       console.log('File successfully written to disk ');
  //                   });
  //       } else {
  //               feed = dataFile;
  //               dataWheather.push(feed)
  //       }
  //     } else{
  //       result = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${item.api}%20viet%20nam?unitGroup=metric&key=ZTYE8BVSEZGU69YC62WFMKQLH&contentType=json`);
  //       feed = await result.json();
  //       feed.pubDate = newDate(Date.now())
  //       feed.id      = await item.id
  //       dataStore  =  JSON.stringify(feed);
  //       fs.writeFileSync(`${path}${item.id}`, dataStore, err => {
  //           console.log('File successfully written to disk 3');
  //       });
  //       dataWheather.push(feed)
  //     }
  // })
  await Promise.all(data.map(async (item,index) => {
    if (fs.existsSync(`${path}${item.id}`)){
      dataFile = fs.readFileSync(`${path}${item.id}`,'utf8')
      dataFile = JSON.parse(dataFile)
      let datePub = newDate(dataFile.pubDate)
      let dateNow = newDate(Date.now())
      if(dateNow-datePub > delay){
                  // change the endpoint with yours
                  result = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${item.api}%20viet%20nam?unitGroup=metric&key=ZTYE8BVSEZGU69YC62WFMKQLH&contentType=json`);
                  feed = await result.json();
                  feed.pubDate = newDate(Date.now())
                  feed.id      = await item.id
                  feed.ordering = await item.ordering
                  dataStore  =  JSON.stringify(feed);
                  dataWheather.push(feed)
                  fs.writeFileSync(`${path}${item.id}`, dataStore, err => {
                      console.log('File successfully written to disk ');
                  });
      } else {
              feed = dataFile;
              dataWheather.push(feed)
      }
    } else{
      result = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${item.api}%20viet%20nam?unitGroup=metric&key=ZTYE8BVSEZGU69YC62WFMKQLH&contentType=json`);
      feed = await result.json();
      feed.pubDate = newDate(Date.now())
      feed.id      = await item.id
      dataStore  =  JSON.stringify(feed);
      fs.writeFileSync(`${path}${item.id}`, dataStore, err => {
          console.log('File successfully written to disk 3');
      });
      dataWheather.push(feed)
    }
  }));
    dataWheather.sort((a,b)=> a.ordering - b.ordering)
    return dataWheather
}

module.exports = {
  getDataWheather
}