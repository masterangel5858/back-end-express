
function getFormattedDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding leading zero if needed
    const date = String(currentDate.getDate()).padStart(2, '0'); // Adding leading zero if needed
    return `${year}-${month}-${date}`;
  }


  
module.exports={
  getFormattedDate
};