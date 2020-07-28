document.addEventListener('DOMContentLoaded', function() {

load_recipe();

});

function load_recipe(page=1, scroll = 1){
  //Populate the ingredients and instructions list
  const recipe_instructions = JSON.parse(document.getElementById('recipe_instructions').textContent);
  const recipe_ingredients = JSON.parse(document.getElementById('recipe_ingredients').textContent);
  const comments = JSON.parse(document.getElementById('comments').textContent);
  const recipe_id = JSON.parse(document.getElementById('recipe_id').textContent);
  const ul_instruct = document.createElement('ol');
  const ul_igdnt = document.createElement('ol');

  const view_instruct = document.querySelector('#v-pills-instructions');
  recipe_instructions.forEach(function (item, index){
    instruct = document.createElement('li');
    instruct.innerHTML = item;
    ul_instruct.append(instruct);
  })

  view_instruct.append(ul_instruct);

  const view_ingredient = document.querySelector('#v-pills-ingredients');
  recipe_ingredients.forEach(function (item, index){
    ingredient = document.createElement('li');
    ingredient.innerHTML = item;
    ul_igdnt.append(ingredient);
  })

  view_ingredient.append(ul_igdnt);

  //Comments
  const comment_view = document.querySelector('#v-pills-comments');
  comment_view.innerHTML ='';
  comment_area = load_comments(comments, recipe_id);
  comment_view.append(comment_area);

  //edit tab
  const editview = document.querySelector('#v-pills-edit');
  editarea = load_edit(recipe_id);
  editview.append(editarea);

  //profile tab
  const view = document.querySelector('#index-view');
  const profile = view.dataset.profile;
  load_profile_tab(page, profile, recipe_id);
}

function load_profile_tab(page, profile, recipe_id) {
  const view = document.querySelector('#index-view');
  const row = document.querySelector('#recipe-firstrow');
  fetch(`/viewrecipes/${page}/${profile}`)
  .then(response => response.json())
  .then(posts => {
    posts['page_objects'].forEach(function(post){
      const column = document.createElement('div');
      column.className = 'col-4';
      const item = document.createElement('div');
      item.className = 'card';
      item.dataset.postid = post.id;
      item.id = `itemdiv${post.id}`;

      let contents = `<img src="${post.picture}" class="card-img-top" alt="...">`
      contents += `<div class="post">`;
      contents += `<a href="/profile/${post.username}"><h5 class = "card-title"> ${post.username} </h5></a>`;
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
      likebutton.dataset.recipe_id = `${post.id}`;
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
      link.href = `${post.id}`
      //View button
      let viewbutton = document.createElement('button');
      viewbutton.className = 'btn btn-outline-primary';
      viewbutton.dataset.postid = post.id;
      viewbutton.id = `enterview-${post.id}`;
      viewbutton.dataset.recipe_id = `${post.id}`;
      viewbutton.innerText = 'View';
      link.append(viewbutton)
      interact_div.append(link);
      item.append(interact_div);
      column.append(item);
      //Make sure that the user sees something new instead of the current recipe
      if(post.id != recipe_id){
        row.append(column)
        view.append(row);
      }

    });

  paginator(parseInt(posts['page']),parseInt(posts['totalpages']));
  window.scrollTo(0, scroll);
  });
}

function load_edit(recipe_id){
  const recipe_instructions = JSON.parse(document.getElementById('recipe_instructions').textContent);
  const recipe_ingredients = JSON.parse(document.getElementById('recipe_ingredients').textContent);
  const editdiv = document.createElement('div');
  editdiv.style.display = 'block';
  editdiv.className = 'card-body';
  editdiv.id = `editdiv${recipe_id}`;
  let editingredients = `Edit your ingredients here:` + `<textarea class="form-control" label="Edit your ingredients here" id="editingredients${recipe_id}">${recipe_instructions}</textarea>`;
  let editinstructions = `Edit your instructions here:` + `<textarea class="form-control" label="Edit your instructions here" id="editinstructions${recipe_id}">${recipe_ingredients}</textarea>`;
  editdiv.innerHTML = editinstructions + editingredients ;
  link = document.createElement('a');
  link.href = `${recipe_id}`;
  let button = document.createElement('button');
  button.className = 'btn btn-outline-primary';
  button.id = `editbtn-${recipe_id}`;
  button.dataset.recipe_id = `${recipe_id}`;
  button.innerText = 'Edit';
  button.addEventListener('click', function() {
    update_recipe(recipe_id);
  });
  //link.append(button);
  editdiv.append(button);
  return editdiv;
}

function load_comments(comments, recipe_id) {

  const comment_div = document.createElement('div');
  comment_div.className = 'container-fluid';
  comment_div.id = `commentdiv`;
  create_comment = `Enter a new comment here:` + `<textarea class="form-control" id="comment_area"></textarea>`;
  comment_div.innerHTML = create_comment;

  let button = document.createElement('button');
  button.className = 'btn btn-outline-primary';
  button.id = `new_comment`;
  button.dataset.recipe_id = `${recipe_id}`;
  button.innerText = 'Comment';
  button.addEventListener('click', function () {
    update_comments(recipe_id);
  });
  comment_div.append(button);

  comments.forEach(function(comment){
    console.log(comment.body);
    let contents = document.createElement('div');
    contents.className = 'row';
    comment_column = document.createElement('div');
    comment_column.className = 'col';
    comment_column.append(comment.body);
    contents.append(comment_column);

    meta_column = document.createElement('div');
    meta_column.className = 'col';
    meta_column.append(`From ` + comment.username + `, ` +  comment.date_created);
    contents.append(meta_column);
    if (comment.private == 'False') {
      comment_div.append(contents);

    }

  });
  return comment_div
}

function update_comments(recipe_id){
  const token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
  const new_comment_div = document.querySelector('#newcomments');
  const body = document.querySelector('#comment_area').value;
  console.log(body);
  console.log(recipe_id);
  fetch('/createcomment', {
    method: 'POST',
    headers: {
        'X-CSRFToken': token,
    },
    body: JSON.stringify({
        recipe_id: recipe_id,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    window.location.hash = '#v-pills-comments';
    window.location.reload(false);
    return false;
  });

}

function update_recipe(recipe_id){
  const token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
  const new_instructions = document.querySelector('#editingredients' + recipe_id).value;
  const new_ingredients = document.querySelector('#editinstructions' + recipe_id).value;
  fetch('/updaterecipe', {
      method: 'PUT',
      headers: {
          'X-CSRFToken': token,
      },
      body: JSON.stringify({
          new_instructions: new_instructions,
          new_ingredients: new_ingredients,
          id: recipe_id
      })
  }).then(response => {
    console.log("SUCCESS");
    window.location.reload(false);
    return false;
  });

}

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
      load_recipe(previouspage);
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
      load_recipe(i + 1);
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
      load_recipe(nextpage);
    });
    nextitem.append(nextlink);
    paginator.append(nextitem);
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
    const firstrow = document.querySelector('#recipe-firstrow');
    firstrow.innerHTML = ''
    load_recipe(paginator.dataset.current_page, scroll)
  });

}
