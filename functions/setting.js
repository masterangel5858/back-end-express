
function getFormattedDate() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding leading zero if needed
    let date = String(currentDate.getDate()).padStart(2, '0'); // Adding leading zero if needed
    return `${year}-${month}-${date}`;
  }


  
module.exports={
  getFormattedDate
};