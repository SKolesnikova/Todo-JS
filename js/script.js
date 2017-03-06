function setFocus() {
    document.getElementById("new").focus();
}

var allTodos = [];                                                                                                      //отобразить все задачи в массиве

document.querySelector("#new").addEventListener('keydown', function (e) {

    if (e.keyCode != 13)
        return;                                                                                                         //по нажатию клавиши enter отправка

    var str = e.target.value;
    e.target.value = "";
    if (str.length > 0) {

        if (localStorage.length == 0) {
            localStorage.setItem('lastId', 0);
        }


        var id = localStorage.getItem('lastId');                                                                        // задаем id
        id++;
        localStorage.setItem('lastId', id);

        var obj = {
            str: str,
            checked: false
        };

        localStorage.setItem(id, JSON.stringify(obj));
        var newTask = document.querySelector('li.hidden').cloneNode(true);                                              // копируем пустой html

        var tasksList = document.querySelector('ul.todo-list');

        newTask.classList.remove('hidden');
        newTask.querySelector('label').textContent = str;
        newTask.setAttribute('id', id);
        addEventsToTodo(newTask);
        tasksList.appendChild(newTask);                                                                                 // удаление стиля, добавление значения в label

        allTodos.push(str);                                                                                             // добавление элементов в массив
        console.log(allTodos);

        rerenderCount();
    }

});

// отрисовываем список

function showTasks(mode) {

    var tasksList = document.querySelector('ul.todo-list');
    var newTask = document.querySelectorAll('li.todo-element:not(.hidden)');

    if (newTask.length){
        for (var i = 0; i < newTask.length; i++){
            tasksList.removeChild(newTask[i]);
        }
    }                                                                                                                   //очистка значений


    var lsLng = localStorage.length;                                                                                    // присваивание идентификатора

    if (lsLng > 0) {

        for (var i = 0; i < lsLng; i++) {

            var key = localStorage.key(i);
            var text = JSON.parse(localStorage.getItem(key));


            if (mode == 'all') {                                                                                         // список всех задач
                if (key != 'lastId') {
                    var todo = document.querySelector('li.hidden').cloneNode(true);
                    todo.setAttribute('id', key);
                    todo.classList.remove('hidden');
                    todo.querySelector('label').textContent = text.str;

                    var tasksList = document.querySelector('ul.todo-list');
                    tasksList.appendChild(todo);

                }

                if (text.checked) {                                                                                      //чекбокс
                    todo.classList.add('checked');
                    todo.querySelector('input[type="checkbox"]').setAttribute('checked', 'true');
                }
                rerenderCount();
            }

            if (mode == 'completed') {                                                                                  // список выполненых задач
                if (key != 'lastId' && text.checked) {
                    var todo = document.querySelector('li.hidden').cloneNode(true);
                    todo.setAttribute('id', key);
                    todo.classList.remove('hidden');
                    todo.classList.add('checked');
                    todo.querySelector('input[type="checkbox"]').setAttribute('checked', 'true');
                    todo.querySelector('label').textContent = text.str;

                    var tasksList = document.querySelector('ul.todo-list');
                    tasksList.appendChild(todo);
                }
            }

            if (mode == 'active') {                         // список активных задач
                if (key != 'lastId' && !text.checked) {
                    var todo = document.querySelector('li.hidden').cloneNode(true);
                    todo.setAttribute('id', key);
                    todo.classList.remove('hidden');
                    todo.querySelector('label').textContent = text.str;
                    var tasksList = document.querySelector('ul.todo-list');
                    tasksList.appendChild(todo);
                    rerenderCount();

                }
            }

        }
    }



}

showTasks('all');


var arr = document.querySelectorAll("li.todo-element:not(.hidden)");

arr.forEach(function (todo) {
    addEventsToTodo(todo)
});

function addEventsToTodo(todo) {

    // установка флажка чекбокса
    todo.querySelector('input[type="checkbox"]').addEventListener('click', function (e) {
        var obj = JSON.parse(localStorage.getItem(todo.getAttribute('id')));
        obj.checked = !obj.checked;
        todo.classList.toggle('checked');
        localStorage.setItem(todo.getAttribute('id'), JSON.stringify(obj));
        rerenderCount();
    });

    // двойной клик для изменения строки
        todo.querySelector('label').addEventListener('dblclick', function (e) {
            var element = todo.querySelector('input[type="text"]');
            element.classList.remove('hidden');
            element.focus();
            var id = element.parentNode.getAttribute('id');
            var obj = JSON.parse(localStorage.getItem(element.parentElement.getAttribute('id')));
            element.value = obj.str;
        });

    // запись измененных данных в хранилище
        todo.querySelector('input.edit').addEventListener('keydown', function (e) {
            if (e.keyCode != 13)
                return;
            var element = todo.querySelector('input.edit');
            element.classList.add('hidden');
            var string = element.value;
            var id = todo.getAttribute('id');
            var obj = JSON.parse(localStorage.getItem(id));
            obj.str = string;
            localStorage.setItem(id, JSON.stringify(obj));
            showTasks('all');
        });

    //blur
    todo.querySelector('input.edit').addEventListener('blur', function (e) {
        var element = todo.querySelector('input.edit');
        element.classList.add('hidden');
    });

    // удаление задачи
        todo.querySelector('button.destroy').addEventListener('click', function (e) {
            localStorage.removeItem(todo.getAttribute('id'));
            todo.parentElement.removeChild(todo);
            rerenderCount();
        });
}

// удалить отмеченые
function deleteChecked() {
    var lsLng = localStorage.length;
    var lastId = parseInt(localStorage.getItem('lastId')) ;

    for (var i = lsLng -1; i >= 0 ; i--) {
        var key = localStorage.key(i);
        if (key != 'lastId') {
            if (JSON.parse(localStorage.getItem(key)).checked) {
                localStorage.removeItem(key);
            }
        }
        lsLng = localStorage.length;
    }
}

document.querySelector('button.clear').addEventListener('click', function (e) {
    deleteChecked();
    showTasks('all');
});


// количество активных задач
function rerenderCount() {
    var numItems = document.querySelectorAll('li.todo-element:not(.hidden)').length - document.querySelectorAll('li.checked').length;
    document.querySelector("span.count").textContent = numItems + " items left";
}