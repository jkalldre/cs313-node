console.log('main.js included.');
let g_user = -1;
let g_topic_id;

function authenticate() {
    var username = document.querySelector('#usrname').value;
    var password = document.querySelector('#usrpwd').value;
    fetch(`/authenticate?username=${username}&password=${password}`)
        .then(result => result.json())
        .then(json => {
            var authenticated = json['?column?'];
            if (authenticated) {
                fetch(`/userID?username=${username}`)
                    .then(result => result.json())
                    .then(json => {
                        g_user = json.user_id;
                        do{
                            console.log(g_user);
                            if(g_user != -1)
                                getTopics();
                        
                        }while(g_user == -1);
                    })
                    .catch(err => console.log(`authenticate cs error: ${err}`));
            }
            else {
                var error = document.querySelector('#error')
                error.innerHTML = "Unable to authenticate. Username or password incorrect."
            }
        })
        .catch(err => console.log(`authenticate: ${err}`));
}

function getTopics() {
    document.querySelector('#contents').innerHTML = '';
    fetch(`/getTopics`)
        .then( res => {
            return res.json();
        })
        .then(json => {
            renderTopics(json);
        })
        .catch(err => console.log(err));
}

function addTopic() {
    var textbox = document.querySelector('#newTopic').value;
    fetch(`/addTopic?id=${g_user}&content=${textbox}`);
    getTopics();
}

function deleteTopic() {
    var id = g_topic_id;
    fetch(`/deleteTopic?id=${id}`);
    getTopics();
}

function renderTopics(results) {
    var objs = results.map(topic => {
        return renderTopic(topic);
    })
    var div = document.querySelector("#contents");
    div.innerHTML = '';
    objs.forEach(obj => {
        div.appendChild(obj);
    })
    var button = document.createElement('button');
    var title = document.createTextNode('Create Topic');
    var textarea = document.createElement('textarea');
    var attr_id = document.createAttribute('id');
    attr_id.value = 'newTopic';
    textarea.setAttributeNode(attr_id);
    button.appendChild(title);
    button.addEventListener('click',addTopic);
    div.appendChild(textarea);
    div.appendChild(document.createElement('br'));
    div.appendChild(button);
}

function renderTopic(topic) {
    var div = document.createElement('div');
    var h2  = document.createElement('h2');
    var p   = document.createElement('p');
    var title = document.createTextNode(topic.Title);
    var user = document.createTextNode('Creator: '+topic.User);
    var attr_class = document.createAttribute('class');
    attr_class.value = 'topic';
    var attr_id  = document.createAttribute('data-topic_id');
    var attr_id2 = document.createAttribute('data-topic_id');
    var attr_id1 = document.createAttribute('data-topic_id');
    attr_id1.value = attr_id2.value = attr_id.value = topic.ID;
    var attr_usr  = document.createAttribute('data-user_id');
    var attr_usr2 = document.createAttribute('data-user_id');
    var attr_usr1 = document.createAttribute('data-user_id');
    attr_usr1.value = attr_usr2.value = attr_usr.value = topic.tID;
    h2.appendChild(title);
    p.appendChild(user);
    div.appendChild(h2);
    div.appendChild(p);
    div.addEventListener('click',openTopic);
    div.setAttributeNode(attr_id);
    h2 .setAttributeNode(attr_id1);
    p  .setAttributeNode(attr_id2);
    div.setAttributeNode(attr_usr);
    h2 .setAttributeNode(attr_usr1);
    p  .setAttributeNode(attr_usr2);

    div.setAttributeNode(attr_class);

    return div;
}

function getComments(id,user) {
    fetch(`/getComments?id=${id}`)
        .then(results => {
            return results.json();
        })
        .then(json => {
            listComments(json,user,id);
        })
        .catch(err => console.log(err));
}

function openTopic(e) {
    var id = e.target.getAttribute('data-topic_id');
    var user = e.target.getAttribute('data-user_id');
    var div = document.querySelector('#contents');
    getComments(id,user);
}

function addComment(e) {
    var topic = e.target.getAttribute('data-topicID');
    var textbox = document.querySelector('#newComment').value;
    if (textbox != ''){
    fetch(`/addComment?id=${g_user}&topic=${topic}&content=${textbox}`);
    getComments(topic,g_user);
    }
}

function listComments(json,id,topicid) {
    var text = '';
    var objs = json.map(comment => {
        text = comment.Title;
        return listComment(comment,comment.cCreator_ID,comment.cID);

    });

    var div = document.querySelector(`#contents`);
    div.innerHTML = '';
    var topic = document.createElement('h2');
    var topic_title = document.createTextNode(text);
    var button = document.createElement('button');
    var title = document.createTextNode('Return to Topics');
    var button1 = document.createElement('button');
    var title1 = document.createTextNode('Delete Topic');
    button1.appendChild(title1);
    topic.appendChild(topic_title);
    button.appendChild(title);
    button.addEventListener('click',getTopics);
    button1.addEventListener('click',deleteTopic);
    div.appendChild(button);
    console.log(`g_user: ${g_user} + ${id}`);
    if (g_user == id)
        div.appendChild(button1);
    div.appendChild(topic);
    objs.forEach(obj => {
        div.appendChild(obj);
    });
    var textarea = document.createElement('textarea');
    var button2 = document.createElement('button');
    var title2  = document.createTextNode('Add Comment');
    var attr_class = document.createAttribute('id');
    var attr_data = document.createAttribute('data-topicID');
    attr_class.value = 'newComment';
    attr_data.value = topicid;
    button2.appendChild(title2);
    button2.addEventListener('click',addComment);
    button2.setAttributeNode(attr_data);
    textarea.setAttributeNode(attr_class);
    div.appendChild(textarea);
    div.appendChild(document.createElement('br'));
    div.appendChild(button2);
}

function deleteComment(e) {
    var id = e.target.getAttribute('data-commentID');
    var user = e.target.getAttribute('data-userID');
    var topic = e.target.getAttribute('data-topicID');
    fetch(`/deleteComment?id=${id}`);
    getComments(topic,user);
}

function listComment(json,id,cID) {
    var div = document.createElement('div');
    var title = document.createTextNode(json.Content+" - "+json.cCreator);
    var attr_class = document.createAttribute('class');
    attr_class.value = 'comment';
    var button = document.createElement('button');
    var title1 = document.createTextNode('X');
    var attr_class1 = document.createAttribute('class');
    var attr_data = document.createAttribute('data-commentID');
    var attr_data1 = document.createAttribute('data-userID');
    var attr_data2 = document.createAttribute('data-topicID');
    attr_data1.value = id;
    attr_data2.value = json.ID;
    attr_data.value = cID;
    attr_class1.value = 'deleteButton';
    button.appendChild(title1);
    button.setAttributeNode(attr_class1);
    button.setAttributeNode(attr_data);
    button.setAttributeNode(attr_data1);
    button.setAttributeNode(attr_data2);
    button.addEventListener('click',deleteComment);
    div.setAttributeNode(attr_class);
    div.appendChild(title);
    if(g_user == id)
        div.appendChild(button);
    return div;
}


// getTopics();