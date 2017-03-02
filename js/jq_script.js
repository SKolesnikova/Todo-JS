function setFocus() {
    document.getElementById("new").focus();
}

var allTodos = [];                                   //отобразить все задачи в массиве

$('#todo input').on('keydown', function (e) {

    if (e.keyCode != 13)
        return;                                     //по нажатию клавиши enter отправка

    var str = e.target.value;
    e.target.value = "";
    if (str.length > 0) {

        if (localStorage.length == 0) {
            localStorage.setItem('lastId', 0);
        }

        // var id = localStorage.length;                              // задаем id
        // id++;

        var id = localStorage.getItem('lastId');                              // задаем id
        id++;
        localStorage.setItem('lastId', id);

        var obj = {
            str: str,
            checked: false
        };

        localStorage.setItem(id, JSON.stringify(obj));
        var newTask = $('li.hidden').clone();       //копируем пустой html

        newTask.removeClass('hidden')
            .appendTo('.todo-list')
            .children('label')
            .text(str);                             // удаление стиля, добавление значения в label

        allTodos.push(str);                         // добавление элементов в массив
        console.log(allTodos);

        rerenderCount();
    }

});

// отрисовываем список

function showTasks(mode) {
        $('li.todo-element:not(.hidden)').remove(); //очистка значений

        var lsLng = localStorage.length; //присоваивание идентификатора

        if (lsLng > 0) {

            for (var i = 0; i < lsLng; i++) {

                var key = localStorage.key(i);
                var text = JSON.parse(localStorage.getItem(key));

                if(mode == 'all') {                             // список всех задач
                    if (key != 'lastId') {
                        var todo = $('li.hidden').clone();
                        todo.attr({id: key});
                        todo.removeClass('hidden')
                            .appendTo('.todo-list')
                            .children('label')
                            .text(text.str);
                    }

                    if (text.checked){                          //чекбокс
                        todo.addClass('checked');
                        $(todo).find('input[type="checkbox"]').prop('checked', true);
                    }
                }

                if (mode == 'completed') {                      // список выполненых задач
                    if (key != 'lastId' && text.checked ) {
                        var todo = $('li.hidden').clone();
                        todo.attr({id: key});
                        todo.removeClass('hidden')
                            .appendTo('.todo-list')
                            .children('label')
                            .text(text.str);
                        todo.addClass('checked');
                        $(todo).find('input[type="checkbox"]').prop('checked', true);
                    }
                }

                if (mode == 'active') {                         // список активных задач
                    if (key != 'lastId' && !text.checked ) {
                        var todo = $('li.hidden').clone();
                        todo.attr({id: key});
                        todo.removeClass('hidden')
                            .appendTo('.todo-list')
                            .children('label')
                            .text(text.str);
                    }
                }

            }
        }
    rerenderCount();
    }

$(document).ready(function () {
    showTasks('all');
});

// установка флажка чекбокса
$(document).on('click', 'input[type="checkbox"]', function (e){
    var element = $(e.target);
    var obj = JSON.parse(localStorage.getItem(element.parent().attr('id')));
    obj.checked = !obj.checked;
    $(element).parent().toggleClass('checked');
    localStorage.setItem(element.parent().attr('id'), JSON.stringify(obj));

    rerenderCount();
});

// двойной клик для изменения строки
$(document).on('dblclick', 'label', function (e){
   // $(this).hide();
    var element = $(e.target).parent().children('input[type="text"]');
    element.removeClass('hidden').focus();
    var id = element.parent().attr('id');
    var obj = JSON.parse(localStorage.getItem(element.parent().attr('id')));
    element.val(obj.str);
});

// запись измененных данных в хранилище
$(document).on('keydown', 'input.edit', function (e){

    if (e.keyCode != 13)
        return;

        var element = $(e.target);
        element.addClass('hidden');
        var string = element.val();
        var id = element.parent().attr('id');
        var obj = JSON.parse(localStorage.getItem(id));
        obj.str = string;
        localStorage.setItem(id, JSON.stringify(obj));
        showTasks('all');


});


$(document).on('blur', 'input.edit', function (e){
    var element = $(e.target);
    element.addClass('hidden');
});

// удаление задачи
$(document).on('click', 'button.destroy', function (e){
    var jet = $(e.target);
    localStorage.removeItem(jet.parent().parent().attr('id'));
    jet.parent().parent().remove();
debugger;
    rerenderCount();
});


//удаление всех выполненых задач
$(document).on('click', 'button.clear', function (){

    // $('li.checked').remove();
    deleteChecked();
    showTasks('all');

});


// количество активных задач
function rerenderCount() {
var numItems = $('li.todo-element:not(.hidden)').length - $('li.checked').length;
$("span.count").text( numItems + " items left");
}


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




