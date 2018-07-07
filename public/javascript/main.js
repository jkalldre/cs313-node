console.log('main.js included.');

function getTopics() {
    document.querySelector('#contents').innerHTML = '';
    fetch(`/getTopics`)
        .then( res => {
            return res.json();
        })
        .then(json => {
            console.log(json);
            renderTopics(json);
        })
        .catch(err => console.log(err));
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
    h2.appendChild(title);
    p.appendChild(user);
    div.appendChild(h2);
    div.appendChild(p);
    div.addEventListener('click',openTopic);
    div.setAttributeNode(attr_id);
    h2 .setAttributeNode(attr_id1);
    p  .setAttributeNode(attr_id2);

    div.setAttributeNode(attr_class);

    return div;
}

function openTopic(e) {
    var id = e.target.getAttribute('data-topic_id');
    var div = document.querySelector('#contents');
    // div.innerHTML = '';
    fetch(`/getComments?id=${id}`)
        .then(results => {
            return results.json();
        })
        .then(json => {
            console.log(json);
            // div.innerHTML = '';
            listComments(json,id);
            // listTopics(json);
        })
        .catch(err => console.log(err));
}

function listComments(json,id) {
    var objs = json.map(comment => {
        return listComment(comment);
    });
    var div = document.querySelector(`#contents`);
    div.innerHTML = '';
    var button = document.createElement('button');
    var title = document.createTextNode('Return to Topics');
    button.appendChild(title);
    button.addEventListener('click',getTopics);
    div.appendChild(button);
    objs.forEach(obj => {
        div.appendChild(obj);
    })
}

function listComment(json) {
    var div = document.createElement('div');
    var title = document.createTextNode(json.Content+" - "+json.cCreator);
    var attr_class = document.createAttribute('class');
    attr_class.value = 'topic';
    div.setAttributeNode(attr_class);
    div.appendChild(title);
    return div;
}

function getfirst(json) {
    var len = Object.keys(json).length;
    if (len > 1) return json[0];
    // else if (len == 0)
    else json;
}

getTopics();