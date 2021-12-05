function sw() {
    window.open(`http://localhost:12870/todolist-frontend/app.html?_ijt=nb7h1sml88dtobbue7evj78fms&_ij_reload=RELOAD_ON_SAVE`,
        '', 'width=411,height=823');
}

getTodo();

document.getElementById('catTodo').onclick = function () {
    selectCat('Todo');
}
document.getElementById('catDoing').onclick = function () {
    selectCat('Doing');
}
document.getElementById('catDone').onclick = function () {
    selectCat('Done');
}

let selected = 'Todo';

function selectCat(switchTo) {
    if (selected === switchTo) {
        return;
    }
    removeClass(document.getElementById('cat' + selected), 'catSelected');
    addClass(document.getElementById('scrollWrapper'), 'page' + switchTo);
    addClass(document.getElementById(switchTo.toLowerCase() + 'Wrapper'), 'activeSection');
    removeClass(document.getElementById('scrollWrapper'), 'page' + selected);
    removeClass(document.getElementById(selected.toLowerCase() + 'Wrapper'), 'activeSection');
    addClass(document.getElementById('cat' + switchTo), 'catSelected');
    selected = switchTo;
}

function getTodo() {
    let token = getLS('token');
    if (token === null) {
        location.href = './signin.html';
    } else {
        fetch(`http://todoapi.mjclouds.com/v1/todo/list`, {
            headers: {
                'token': token,
            }
        })
            .then(response => {
                if (response.status >= 400 && response.status < 500) {
                    location.href = './signin.html';
                } else {
                    return response.json();
                }
            }).catch(e => {
            showNotification('Fail', e);
            throw new Error(e);
        }).then(json => {
            parseTodo(json['data']);
        })
    }
}

function parseTodo(data) {
    for (let i in data) {
        switch (data[i]['status']) {
            case 0: {
                document.getElementById('todoWrapper').innerHTML += todoTemplate(data[i]);
                break;
            }
            case 1: {
                document.getElementById('doingWrapper').innerHTML += todoTemplate(data[i]);
                break;
            }
            case 2: {
                document.getElementById('doneWrapper').innerHTML += todoTemplate(data[i]);
                break;
            }
        }
        funcShow(document.getElementById(`func-${data[i]['ID']}`));
    }
}

function todoTemplate(data) {
    return `<div class="eachWrapper" id="todo-${data['ID']}">
                        <div class="todoWrapper">
                            <div class="todoTitle">${data['todo_name']}</div>
                            <div class="todoTime">${new Date(Date.parse(data['end_time'])).toLocaleTimeString()}</div>
                            <div class="todoDesp">${data['description']}</div>
                        </div>
                        <div class="funcWrapper" todo-status="${data['status']}" todo-id="${data['ID']}" id="func-${data['ID']}">
                            <div class="todoFunc funcMove"><span>移动到</span></div>
                            <div class="todoFunc funcEdit"><span>编辑</span></div>
                            <div class="todoFunc funcDelete"><span>删除</span></div>
                        </div>
                    </div>`
}

function funcShow(parent) {
    parent.children[0].onclick = function () {
        funcMove(this);
    }
    parent.children[1].onclick = function () {
        funcEdit(this);
    }
    parent.children[2].onclick = function () {
        funcDelete(this);
    }
    parent.children[0].innerHTML = '<span>移动到</span>';
    parent.children[1].innerHTML = '<span>编辑</span>';
    parent.children[2].innerHTML = '<span>删除</span>'
}

let moveAlias = {
    0: '未开始',
    1: '进行中',
    2: '已完成',
}

function funcMove(ele) {
    let parent = ele.parentNode;
    let status = parent.getAttribute('todo-status');
    parent.children[0].innerText = '返回';
    parent.children[0].onclick = function () {
        funcShow(parent);
    }
    let pos = 1;
    for (let i in moveAlias) {
        if (i === status) {
        } else {
            let node = parent.children[pos];
            node.innerText = moveAlias[i];
            node.setAttribute('move-to', i);
            node.onclick = function () {
                moveTodo(this)
            }
            pos++;
        }
    }
}

function funcEdit(ele) {

}

function funcDelete(ele) {

}

function moveTodo(ele) {
    let parent = ele.parentNode;
    let moveTo = ele.getAttribute('move-to');
    let todoID = parent.getAttribute('todo-id');
    console.log(`ID为${todoID}的节点${parent}将被移动到"${moveAlias[moveTo]}"`);
}