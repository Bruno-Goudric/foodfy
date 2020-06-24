const currentPage = location.pathname;
let adminSpace = currentPage.includes('admin');

if (adminSpace)
{
  const header = document.querySelector('header.header');

  if (header)
  {
    header.classList.add('admin');

    const search = header.querySelector('.container div.search');
    const logo = document.querySelector('#logo');
  
    if (search)
      search.parentNode.removeChild(search);
    
    if (logo)
      logo.setAttribute('src', '/assets/admin-logo.png');
  }

  const menuLis = document.querySelector('header.header .container nav ul');

  for (const a of menuLis.querySelectorAll('li a')) 
  {
    if (currentPage.includes('admin') && a.href.includes('home'))
      a.setAttribute('href', a.getAttribute('href').replace('home', 'admin'));

    if (a.href.includes('about'))
      a.parentNode.removeChild(a);
  }

  const userLi = document.createElement('li');
  const userA = document.createElement('a');
  userA.appendChild(document.createTextNode('Usuários'));
  userA.setAttribute('href', '/admin/users');

  userLi.appendChild(userA);
  menuLis.appendChild(userLi);

  const pFooter = document.querySelector('footer#footer p.footer');
  
  if (pFooter)
    pFooter.remove();
  
}

const menuItems = document.querySelectorAll('.container nav ul a');

if (menuItems)
{
  for (item of menuItems) 
  {
    if (currentPage.includes(item.getAttribute('href')))
      item.classList.add('active');
  }
}

if (currentPage.includes('session'))
{
  const header = document.querySelector('header .container');
  let a = '';

  for (const item of header.children) 
  {
    if (item.classList.contains('logo'))
    {
      header.innerHTML = '';
      header.appendChild(item);
    }
  }

  const footer = document.querySelector('#footer');

  if (footer)
    footer.remove();
}