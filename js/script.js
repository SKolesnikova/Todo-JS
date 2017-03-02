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


            if(mode == 'all') {                                                                                         // список всех задач
                if (key != 'lastId') {
                    var todo = document.querySelector('li.hidden').cloneNode(true);
                    todo.setAttribute('id', key);
                    todo.classList.remove('hidden');
                    todo.querySelector('label').textContent = text.str;

                    var tasksList = document.querySelector('ul.todo-list');
                    tasksList.appendChild(todo);

                }

                if (text.checked){                                                                                      //чекбокс
                    todo.classList.add('checked');
                    todo.querySelector('input[type="checkbox"]').setAttribute('checked', 'true');
                }
            }

            if (mode == 'completed') {                                                                                  // список выполненых задач
                if (key != 'lastId' && text.checked ) {
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
                if (key != 'lastId' && !text.checked ) {
                    var todo = document.querySelector('li.hidden').cloneNode(true);
                    todo.setAttribute('id', key);
                    todo.classList.remove('hidden');
                    todo.querySelector('label').textContent = text.str;
                    var tasksList = document.querySelector('ul.todo-list');
                    tasksList.appendChild(todo);

                }
            }

        }
    }
    rerenderCount();

    // установка флажка чекбокса
    for (var j = 0; j < document.querySelectorAll('input[type="checkbox"]').length; j++) {
        document.querySelectorAll('input[type="checkbox"]')[j].addEventListener('click', function (e){
            var element = e.target;
            var obj = JSON.parse(localStorage.getItem(element.parentNode.getAttribute('id')));
            obj.checked = !obj.checked;
            document.querySelector('input[type="checkbox"]').parentNode.classList.toggle('checked');                    // не переключается класс, только после обновления страницы
            localStorage.setItem(element.parentNode.getAttribute('id'), JSON.stringify(obj));
            rerenderCount();
        });
    }

    // двойной клик для изменения строки
    for (var k = 0; k < document.querySelectorAll('label').length; k++) {
        document.querySelectorAll('label')[k].addEventListener('dblclick', function (e) {
            var element = e.target.parentElement.querySelector('input[type="text"]');
            element.classList.remove('hidden');
            element.focus();
            var id = element.parentNode.getAttribute('id');
            var obj = JSON.parse(localStorage.getItem(element.parentElement.getAttribute('id')));
            element.value = obj.str;
        });
    }

// запись измененных данных в хранилище

    for (var l = 0; l < document.querySelectorAll('input.edit').length; l++) {
        document.querySelectorAll('input.edit')[l].addEventListener('keydown', function (e) {
            if (e.keyCode != 13)
                return;
            var element = e.target.parentElement.querySelector('input.edit');
            element.classList.add('hidden');
            var string = element.value;
            var id = element.parentElement.getAttribute('id');
            var obj = JSON.parse(localStorage.getItem(id));
            obj.str = string;
            localStorage.setItem(id, JSON.stringify(obj));
            showTasks('all');
        });
    }

// blur
    for (var m = 0; m < document.querySelectorAll('input.edit').length; m++) {
        document.querySelectorAll('input.edit')[m].addEventListener('blur', function (e) {
            var element = e.target.parentElement.querySelector('input.edit');
            element.classList.add('hidden');
        });
    }

// удаление задачи
    for (var n = 0; n < document.querySelectorAll('button.destroy').length; n++) {
        document.querySelectorAll('button.destroy')[n].addEventListener('click', function (e) {
            var jet = e.target.parentElement.querySelector('i');
            localStorage.removeItem(jet.parentElement.parentElement.getAttribute('id'));
            jet.parentElement.parentElement.parentElement.removeChild(jet.parentElement.parentElement);
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

//удаление всех выполненых задач
    for (var p = 0; p < document.querySelectorAll('button.clear').length; p++) {
        document.querySelectorAll('button.clear')[p].addEventListener('click', function (e) {
            deleteChecked();
            showTasks('all');
        });
    }

}

showTasks('all');






// количество активных задач
function rerenderCount() {
    var numItems = document.querySelectorAll('li.todo-element:not(.hidden)').length - document.querySelectorAll('li.checked').length;
    document.querySelector("span.count").textContent = numItems + " items left";
}