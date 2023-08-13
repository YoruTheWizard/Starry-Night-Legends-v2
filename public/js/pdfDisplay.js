let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.3,
  pageNumInput = document.querySelector('#page-num'),
  canvas = document.querySelector('#pdf-render'),
  ctx = canvas.getContext('2d');

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
document.querySelector('#prev-page').addEventListener('click', () => {
  if (pageNum <= 1) return;
  pageNum--;
  queueRenderPage(pageNum);
});

// Show next page
document.querySelector('#next-page').addEventListener('click', () => {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  queueRenderPage(pageNum);
});

// Jump to page
pageNumInput.addEventListener('keyup', evt => {
  if (evt.key === 'Enter') queueRenderPage(parseInt(pageNumInput.value));
  else return;
});

// Get document
const url = ['http://localhost:3000'];
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