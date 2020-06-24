function paginate(selectedPage, totalPages)
{
  const pages = [];
  let oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) 
  {
    const firstAndLast = currentPage == 1 || currentPage == totalPages;
    const pagesAfter = currentPage <= selectedPage + 2;
    const pagesBefore = currentPage >= selectedPage - 2;

    if (firstAndLast || pagesBefore && pagesAfter)
    {
      if (oldPage && currentPage - oldPage > 2)
        pages.push('...'); 

      if (oldPage && currentPage - oldPage == 2)
        pages.push(oldPage + 1);

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }

  return pages;
}

function createPagination(pagination)
{
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const search = pagination.dataset.search;

  const pages = paginate(page, total);

  let elements = '';

  for (let page of pages) 
  {
    if (String(page).includes('...'))
    {
      elements += `<span>${page}</span>`;
    }
    else
    {
      if (search)
        elements += `<a href="?page=${page}&search=${search}">${page}</a>`;
      else
        elements += `<a href="?page=${page}">${page}</a>`;
    }
  }

  pagination.innerHTML = elements;
}

const pagination = document.querySelector('.pagination');

if (pagination)
  createPagination(pagination);