const axios = require('axios');




/**
 * Send Api to LineNotification
 * @param {string} message 
 * @param {string} LineID 
 */
async function sendapi(message,LineID) {
  let data = JSON.stringify({
    "to": LineID,
    "messages": [
      {
        "type": "text",
        "text": message
      }
    ]
  });





/**
 * Send Api to LineNotification
 * @param {string} message 
 * @param {string} LineID 
 */
async function sendapi(message,LineID) {
let data = JSON.stringify({
  "to": LineID,
  "messages": [
    {
      "type": "text",
      "text": message
    }
  ]
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.line.me/v2/bot/message/push',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer N4jUMig3X5sk7cvppqoQJLWds+vXdZ8EfLAq6Nv2u/qNGu8bfnNep+D/EcAv17UNZDKPKhRFU6U4xyFKuwgtfitTTbbEif0tsqBkA+iZoBNtEPbKlhfQoPWt6viW058N7QtonTiiBpCUXc/XQhtTfgdB04t89/1O/w1cDnyilFU='
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
}

module.exports = { sendapi };
// sendapi('อย่าลืมกินยาน้าาาาาาาาาาาาา','U33cd6913cb1d26a21f1f83b1a3bd7638');