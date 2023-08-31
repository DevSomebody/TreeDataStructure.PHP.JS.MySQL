const app = (function ($) {
    const ajaxUrl = './app/php/db.php'

    function printTree(result){
        const root = $('<ul>').attr('class', 'list-group noselect');
        const data = JSON.parse(result)

        for( let key in data[0]){
            let li = $('<li>').attr('class', 'list-group-item ')
            let span = $('<span>')
            let arrow = $('<img>')
                .attr({
                    src: './app/style/svg/arrow-down-short.svg',
                    class:'float-start arrow',
                    alt: 'Указатель',
                })

            span.text(data[0][key].name)

            arrow
                .attr
                ({
                    'data-status': false,
                    'data-id': data[0][key].id,
                })
                .on('click', function (){
                    loadData(printBranches, this)
                })

            li.append(arrow)
            li.append(span)

            root.append(li)
        }

        $('.container').append(root)
    }

    function loadData(callback, option = null){
        $.ajax({
            url: ajaxUrl,
            method: 'GET',
            dataType: 'json',

            success: function(resp) {
                if (resp) {
                    if(!option)
                        callback(JSON.stringify(resp, null, 2));
                    else
                        callback(JSON.stringify(resp, null, 2), option)
                } else {
                    console.error('Ошибка получения данных с сервера');
                }
            },

            error: function(error) {
                console.error('Ошибка: ', error);
            }
        });
    }

    function printBranches(result, arrow){
        const data = JSON.parse(result)

        let status = arrow.dataset.status
        let id = parseInt(arrow.dataset.id)

        if(status === 'false'){
            swapArrow(arrow)
            arrow.setAttribute('data-status', true)
            const root = $('<ul>').attr('class', 'list-group');

            for ( let newKey in data[id]){
                let li = $('<li>').attr('class', 'list-group-item')
                let span = $('<span>')
                let arrow = $('<img>')
                    .attr({
                        src: './app/style/svg/arrow-down-short.svg',
                        class:'float-start arrow',
                        alt: 'Указатель',
                    })

                span.text(data[id][newKey].name)
                arrow
                    .attr
                    ({
                        'data-status': false,
                        'data-id': data[id][newKey].id
                    })
                    .on('click', function (){
                        loadData(printBranches, this)
                    })

                li.append(arrow)
                li.append(span);

                root.append(li);
            }
            root.appendTo(arrow.parentNode)
        }
        else {
            arrow.setAttribute('data-status', false)
            const elements = $(arrow.parentNode).children('ul');
            swapArrow(arrow)
            elements.remove()
        }
    }

    function swapArrow(arrow){
        if(arrow.getAttribute('src') === './app/style/svg/arrow-down-short.svg'){
            arrow.setAttribute('src', './app/style/svg/arrow-up-short.svg')
        } else
            arrow.setAttribute('src','./app/style/svg/arrow-down-short.svg')
    }

    function init(){
        loadData(printTree)
    }

    return {
        init: init
    }
})($);

$(document).ready(app.init);