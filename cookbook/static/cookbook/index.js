document.addEventListener('DOMContentLoaded', function() {

loadpost();


load_cookbook_tab();

});


function loadpost(page = 1, scroll = 1) {
  const user_id = JSON.parse(document.getElementById('user_id').textContent);
  const view = document.querySelector('#index-view');
  const firstrow = document.querySelector('#index-firstrow');

  // profile indicates which posts to load
  const profile = view.dataset.profile;
  view.innerHTML= '';
  fetch(`/viewrecipes/${page}/${profile}`)
  .then(response => response.json())
  .then(posts => {
    posts['page_objects'].forEach(function(post){

      //populates the post accordingly
      const column = document.createElement('div');
      column.className = 'col-4';
      const item = document.createElement('div');
      item.className = 'card';
      item.dataset.postid = post.id;
      item.id = `itemdiv${post.id}`;

      let contents = `<img src="${post.picture}" class="card-img-top" alt="...">`
      contents += `<div class="post">`;
      contents += `<a href="/profile/${post.username}"><h5 class = "card-title"> @${post.username} </h5></a>`;
      contents += `<h5 class = "card-title"> ${post.name}</h5>`;
      contents += `<p  class = "class-text"> ${post.description}</p>`;
      contents += `<p  class = "class-text"> ${post.date_created}</p>`;
      contents += `<div class="likearea">`;
      contents += `<div class="row">`;
      contents += `<div class="col-4">`;
      if(post.liked == 'True'){
        contents += `<img src="/static/cookbook/liked.png" style="width:20px;height:20px;"/>${post.number_of_likes}`
      } else {
        contents += `<img src="/static/cookbook/notliked.png" style="width:20px;height:20px;"/>${post.number_of_likes}`
      }

      item.innerHTML = contents;

      //div element for the like and view button
      let interact_div = document.createElement('div');
      //like button
      let likebutton = document.createElement('button');
      likebutton.className = 'btn btn-outline-primary';
      likebutton.id = `likebtn-${post.id}`;


      likebutton.dataset.post_id = `${post.id}`;
      if(post.liked == 'True'){
        likebutton.innerText = 'Unlike';
      } else {
        likebutton.innerText = 'Like';
      }
      likebutton.addEventListener('click', function () {
        scroll = window.pageYOffset;
        toggle_like(post.id, scroll);
      });
      interact_div.append(likebutton);

      link = document.createElement('a');
      link.href = `getrecipe/${post.id}`
      //View button
      let viewbutton = document.createElement('button');
      viewbutton.className = 'btn btn-outline-primary';
      viewbutton.dataset.postid = post.id;
      viewbutton.id = `enterview-${post.id}`;
      viewbutton.dataset.post_id = `${post.id}`;
      viewbutton.innerText = 'View';
      viewbutton.addEventListener('click', function () {

      });
      link.append(viewbutton)
      interact_div.append(link);

      item.append(interact_div);
      column.append(item);
      firstrow.append(column)

      view.append(firstrow)
      //view.append(secondrow)
      //view.append(view);

    });
  paginator(parseInt(posts['page']),parseInt(posts['totalpages']));
  window.scrollTo(0, scroll);
  });
  return false;
}

function load_cookbook_tab(page = 1 ,scroll = 1) {
  const cookbook_view = document.querySelector('#profile-cookbook-view');
  const profile = cookbook_view.dataset.profile;
  const view = document.querySelector('#profile-cookbook-view');
  const row = document.querySelector('#cookbook-firstrow');
  fetch(`/viewcookbooks/${page}/${profile}`)
  .then(response => response.json())
  .then(cookbooks => {
    cookbooks['page_objects'].forEach(function(cookbook){
      const column = document.createElement('div');
      column.className = 'col-4';
      const item = document.createElement('div');
      item.className = 'card';
      item.dataset.postid = cookbook.id;
      item.id = `itemdiv${cookbook.id}`;

      let contents = `<img src="${cookbook.picture}" class="card-img-top" alt="...">`
      contents += `<a href="/profile/${cookbook.username}"><h5 class = "card-title"> @${cookbook.username} </h5></a>`;
      contents += `<div class="post">`;
      contents += `<h5 class = "card-title"> ${cookbook.name} </h5>`;
      contents += `<p  class = "class-text"> ${cookbook.description}</p>`;
      contents += `<p  class = "class-text"> ${cookbook.date_created}</p>`;
      contents += `<div class="likearea">`;
      contents += `<div class="row">`;
      contents += `<div class="col-4">`;

      item.innerHTML = contents;

      //div element for the like and view button
      let interact_div = document.createElement('div');

      link = document.createElement('a');
      link.href = `/cookbook/${cookbook.id}`
      //View button
      let viewbutton = document.createElement('button');
      viewbutton.className = 'btn btn-outline-primary';
      viewbutton.dataset.postid = cookbook.id;
      viewbutton.id = `enterview-${cookbook.id}`;
      viewbutton.dataset.recipe_id = `${cookbook.id}`;
      viewbutton.innerText = 'View';
      link.append(viewbutton)
      interact_div.append(link);
      item.append(interact_div);
      column.append(item);

      row.append(column)
      view.append(row);
    });
  paginator_cookbook(parseInt(cookbooks['page']),parseInt(cookbooks['totalpages']));
  window.scrollTo(0, scroll);
  });
}

//Creates the paginator element to divide all post into pages with 10 post per page
function paginator(page, totalpages) {
  const paginator = document.querySelector('#paginate');

  //Store the current page in the element
  paginator.dataset.currentpage = page;
  paginator.innerHTML='';

  //Previous button
  if (page > 1) {
    previouspage = page - 1;
    previtem = document.createElement('li');
    previtem.className = 'page-item';
    prevlink = document.createElement('a');
    prevlink.href = '#';
    prevlink.className = 'page-link';
    prevlink.innerText = 'Previous';

    prevlink.addEventListener('click', function() {
      const cookbookrow = document.querySelector('#index-firstrow');
      cookbookrow.innerHTML = '';
      loadpost(previouspage);
    });
    previtem.append(prevlink);
    paginator.append(previtem);
  }

  //All the number button
  for (let i = 0; i < totalpages; i++) {
    current_item = document.createElement('li');
    current_item.className = 'page-item';
    if (page == i + 1){
      current_item.className = 'page-item active';
    }
    link = document.createElement('a');
    link.innerHTML = i + 1;
    link.className = 'page-link';
    link.innerText = `${i + 1}`;

    link.addEventListener('click', function() {
      const cookbookrow = document.querySelector('#index-firstrow');
      cookbookrow.innerHTML = '';
      loadpost(i + 1);
    })
    current_item.append(link);
    paginator.append(current_item);
  }

  //Next button
  if (page < totalpages) {
    nextpage = page + 1;
    nextitem = document.createElement('li');
    nextitem.className = 'page-item';
    nextlink = document.createElement('a');
    nextlink.href = '#';
    nextlink.className = 'page-link';
    nextlink.innerText = 'Next';

    nextlink.addEventListener('click', function() {
      const cookbookrow = document.querySelector('#index-firstrow');
      cookbookrow.innerHTML = '';
      loadpost(nextpage);
    });
    nextitem.append(nextlink);
    paginator.append(nextitem);
  }
}

function paginator_cookbook(page, totalpages) {
  const paginator_cookbook = document.querySelector('#paginate-cookbook');

  //Store the current page in the element
  paginator_cookbook.dataset.currentpage = page;
  paginator_cookbook.innerHTML='';

  //Previous button
  if (page > 1) {
    previouspage = page - 1;
    previtem = document.createElement('li');
    previtem.className = 'page-item';
    prevlink = document.createElement('a');
    prevlink.href = '#';
    prevlink.className = 'page-link';
    prevlink.innerText = 'Previous';

    prevlink.addEventListener('click', function() {
      const firstrow = document.querySelector('#cookbook-firstrow');
      firstrow.innerHTML = '';
      load_cookbook_tab(previouspage);
    });
    previtem.append(prevlink);
    paginator_cookbook.append(previtem);
  }

  //All the number button
  for (let i = 0; i < totalpages; i++) {
    current_item = document.createElement('li');
    current_item.className = 'page-item';
    if (page == i + 1){
      current_item.className = 'page-item active';
    }
    link = document.createElement('a');
    link.innerHTML = i + 1;
    link.className = 'page-link';
    link.innerText = `${i + 1}`;

    link.addEventListener('click', function() {
      const firstrow = document.querySelector('#cookbook-firstrow');
      firstrow.innerHTML = '';
      load_cookbook_tab(i + 1);
    })
    current_item.append(link);
    paginator_cookbook.append(current_item);
  }

  //Next button
  if (page < totalpages) {
    nextpage = page + 1;
    nextitem = document.createElement('li');
    nextitem.className = 'page-item';
    nextlink = document.createElement('a');
    nextlink.href = '#';
    nextlink.className = 'page-link';
    nextlink.innerText = 'Next';

    nextlink.addEventListener('click', function() {
      const firstrow = document.querySelector('#cookbook-firstrow');
      firstrow.innerHTML = '';
      load_cookbook_tab(nextpage);
    });
    nextitem.append(nextlink);
    paginator_cookbook.append(nextitem);
  }
}

function toggle_like(post_id, scroll){
  const token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

  fetch('/likepost', {
      method: 'PUT',
      headers: {
          'X-CSRFToken': token,
      },
      body: JSON.stringify({
          id: post_id
      })
  }).then(response => {
    const paginator = document.querySelector('#paginate');
    const firstrow = document.querySelector('#index-firstrow');
    firstrow.innerHTML = ''
    loadpost(paginator.dataset.current_page, scroll)
  });

}
