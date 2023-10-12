let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const pageNumInput = document.querySelector('#page-num'),
  canvas = document.querySelector('#pdf-render'),
  ctx = canvas.getContext('2d');

// Setting scale
let scale = 1.3;
if (screen.width < 600) scale = 1;

// Render the page
const renderPage = num => {
  pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    // Output current page
    pageNumInput.value = num;
  });
};

// Check for pages rendering
const queueRenderPage = num => {
  if (pageIsRendering) pageNumIsPending = num;
  else renderPage(num);
};

// Show previous page
const prevPage = () => {
  if (pageNum <= 1) return;
  pageNum--;
  queueRenderPage(pageNum);
};
document.querySelector('#prev-page').addEventListener('click', prevPage);

// Show next page
const nextPage = () => {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  queueRenderPage(pageNum);
};
document.querySelector('#next-page').addEventListener('click', nextPage);

// Change page with arrows
document.addEventListener('keyup', evt => {
  if (evt.key === 'ArrowRight') nextPage();
  if (evt.key === 'ArrowLeft') prevPage();
});

// Jump to page
pageNumInput.addEventListener('keyup', evt => {
  if (evt.key === 'Enter') {
    if (pageNumInput.value === '') {
      pageNumInput.value = pageNum;
      return;
    }
    let num = parseInt(pageNumInput.value),
      max = parseInt(pageNumInput.getAttribute('max'));
    if (num <= 0 || num > max) return;
    pageNum = num;
    queueRenderPage(pageNum);
  } else return;
});

// Get document
const url = ['http://localhost:3000', 'https://starrynightlegends.onrender.com'];
const fileId = document.querySelector('#file-id').textContent;

fetch(`${url[0]}/files/getfile/${fileId}`)
  .then(res => res.blob())
  .then(blob => {
    let fileURL = URL.createObjectURL(blob);

    pdfjsLib.getDocument(fileURL).promise.then(doc => {
      pdfDoc = doc;

      document.querySelector('#page-count').textContent = pdfDoc.numPages;
      pageNumInput.setAttribute('max', pdfDoc.numPages);
      renderPage(pageNum);
    });
  })
  .catch(e => console.error(e));