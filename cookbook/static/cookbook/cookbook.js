document.addEventListener('DOMContentLoaded', function() {
  const cookbook_id = JSON.parse(document.getElementById('cookbook_id').textContent);
  const comments = JSON.parse(document.getElementById('comments').textContent);
  const comment_view = document.querySelector('#v-pills-comments');
  comment_view.innerHTML ='';
  comment_area = load_comments(comments, cookbook_id);
  comment_view.append(comment_area);
});

function load_comments(comments, cookbook_id) {

  const comment_div = document.createElement('div');
  comment_div.className = 'container-fluid';
  comment_div.id = `commentdiv`;
  create_comment = `Enter a new comment here:` + `<textarea class="form-control" id="comment_area"></textarea>`;
  comment_div.innerHTML = create_comment;

  let button = document.createElement('button');
  button.className = 'btn btn-outline-primary';
  button.id = `new_comment`;
  button.dataset.cookbook_id = `${cookbook_id}`;
  button.innerText = 'Comment';
  button.addEventListener('click', function () {
    update_comments(cookbook_id);
  });
  comment_div.append(button);

  comments.forEach(function(comment){

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

function update_comments(cookbook_id){
  const token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
  const new_comment_div = document.querySelector('#newcomments');
  const body = document.querySelector('#comment_area').value;
  console.log(body);
  console.log(cookbook_id);
  fetch('/createcomment', {
    method: 'POST',
    headers: {
        'X-CSRFToken': token,
    },
    body: JSON.stringify({
        cookbook_id: cookbook_id,
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
