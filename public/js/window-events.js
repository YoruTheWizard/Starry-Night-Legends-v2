// Set date
const uploadDates = document.getElementsByClassName('db-date');
const dateDisplays = document.getElementsByClassName('date');

for (let i in uploadDates) {
  const d = new Date(uploadDates[i].textContent);
  let day = d.getDate(), month = d.getMonth() + 1, year = d.getFullYear();

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;

  dateDisplays[i].textContent = `${day}/${month}/${year}`;
}

// Close details
const allDetails = document.querySelectorAll('.title-name');

function toggleOpenOneOnly(e) {
  if (this.open) {
    allDetails.forEach(deet => {
      let sinopsys = deet.parentElement.children[1].children[0].children[0];
      if (deet != this) {
        if (deet.open) deet.open = false;
        if (sinopsys.open) sinopsys.open = false;
      }
    });
  }
};

allDetails.forEach(deet => {
  deet.addEventListener('toggle', toggleOpenOneOnly);
});