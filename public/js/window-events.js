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
      if (deet != this && deet.open) deet.open = false;
    });
  }
};

allDetails.forEach(deet => {
  deet.addEventListener('toggle', toggleOpenOneOnly);
});

// Open modals
const createTitle = document.querySelector('.create-title'),
  createChapter = document.querySelector('.create-chapter'),
  chapterForm = createChapter.children[1];

document.addEventListener('click', e => {
  const el = e.target;

  if (el.classList.contains('modal-display')) {
    location.reload();
  }

  if (el.id === 'ctb-cover') {
    createTitle.parentElement.removeAttribute('hidden');
  }

  if (el.id === 'ccb-cover') {
    const titleInfo = el.parentElement.parentElement.children,
      idInput = chapterForm.children['title'],
      nameDisp = chapterForm.children[2].children['chapter-title-name'];

    idInput.value = titleInfo[1].textContent;
    nameDisp.textContent = titleInfo[2].textContent;

    createChapter.parentElement.removeAttribute('hidden');
  }

  if (el.id === 'chapter-form-reset') {
    for (let elem of chapterForm.children) {
      if (!elem.classList.contains('input')) continue;
      elem.value = '';
    }
  }

  if (el.classList.contains('etb-cover')) {
    let nameInput = createTitle.children[1].children['title-name'],
      descInput = createTitle.children[1].children['description'],
      titleName = el.parentElement.parentElement.parentElement.children[0].textContent,
      titleId = el.parentElement.children[0].textContent,
      description = el.parentElement.children[1].textContent;

    createTitle.children['title-form-title'].textContent = 'Editar obra';
    createTitle.children[1].setAttribute('action', `/titles/edit/${titleId}`);
    nameInput.value = titleName;
    descInput.value = description;

    createTitle.parentElement.removeAttribute('hidden');
  }
});

// Delete
const titleDelete = document.getElementsByClassName('delete-title-form');
const chapDelete = document.getElementsByClassName('delete-chapter-form');

for (const elem of titleDelete)
  elem.addEventListener('submit', e => {
    e.preventDefault();
    let conf = confirm('Deseja mesmo deletar este título?');
    if (conf) e.target.submit();
  });

for (const elem of chapDelete)
  elem.addEventListener('submit', e => {
    e.preventDefault();
    let conf = confirm('Deseja mesmo deletar este capítulo?');
    if (conf) e.target.submit();
  });