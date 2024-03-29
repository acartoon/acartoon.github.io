var HIDE_CLASS = 'hide';
var totalData = [];

var buttonToPrint = document.querySelectorAll('.js-print');
var buttonToSave = document.querySelectorAll('.js-save');
var buttonForm = document.querySelector('.js-form button[type="submit"]');

// сохранить документ
buttonToSave.forEach(function (item) {
    item.addEventListener('click', function () {
        downloadFile();
    })
})

function downloadFile__() {
    var elHtml = document.getElementById('total').innerHTML;
    var link = document.createElement('a');
    link.setAttribute('download', 'test.doc');
    link.setAttribute('href', 'data:' + 'text/doc' + ';charset=utf-8,' + encodeURIComponent(createDocumentContent()));
    link.click();
}

function downloadFile() {
    console.log(createDocumentContent().innerHTML);
    //var htmlDoc = document.getElementById('total').innerHTML;
    // console.log(htmlDoc)
    var converted = htmlDocx.asBlob(createDocumentContent().innerHTML);
    saveAs(converted, 'Выбранные позиции.docx');
}

function downloadFile_() {
    console.log(createDocumentContent());
    var htmlDoc = document.getElementById('total').innerHTML;
    var converted = htmlDocx.asBlob(htmlDoc);
    saveAs(converted, 'test.docx');
}

// распечатка документа
function changeStateButton(button, state) {
    if (state) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', 'true');
    }
}
function updateState(totalBlock) {
    totalData = totalBlock;
    buttonToPrint.forEach(function (item) {
        changeStateButton(item, totalBlock.length > 0)
    })

    buttonToSave.forEach(function (item) {
        changeStateButton(item, totalBlock.length > 0)
    })

    buttonToSave.forEach(function (item) {
        changeStateButton(item, totalBlock.length > 0)
    })

    changeStateButton(buttonForm, totalBlock.length > 0)
}


function createDocumentContent() {
    var parent = createElement({tag: 'div', className: ''})
    var title = createElement({tag: 'div', text: 'Выбранные позиции:'})
    //  name: 'Аппарат для непрерывной, пассивной разработки локтевого сустава (30 минут)', price: 350, checked: true, count: 1
    parent.append(title)
    totalData.forEach(function (item) {
        var element = createElement({tag: 'div', className: '', text: item.name + ' по цене ' + item.price + '₽, количество: ' + item.count})
        parent.append(element)
    })
    return parent;
}

function createDocumentContentForSend() {
    return totalData.reduce(function (acc, item) {
        acc = acc + item.name + ' по цене ' + item.price + '₽, количество: ' + item.count + '\\n';
        return acc;
    }, '')
}

function createTable(data) {
    var table =  createElement({tag: 'table', className: 'table'});
    var total = 0;
    data.forEach(function (el) {
        total += el.count * el.price;
        var tr =  createElement({tag: 'td', className: 'tr'});
        [el.name, el.count, el.price, (el.count * el.price)].forEach(function (i) {
            var td =  createElement({tag: 'td', className: 'td', text: i});
            tr.append(td)
        });
        table.append(tr);
    })

    var tr2 =  createElement({tag: 'td', className: 'tr'});
    var td =  createElement({tag: 'td', className: 'tr', text: 'Итого:'});
    td.setAttribute('colspan', 3);
    var td2 =  createElement({tag: 'td', className: 'tr', text: total});

    tr2.append(td);
    tr2.append(td2);
    table.append(tr2);
    console.log(table);
    return table;
}

axios.defaults.withCredentials = true;
var form = document.querySelector('.js-form');
var formForSend = form.querySelector('.js-form button');
formForSend.addEventListener('click', function (evt) {
    evt.preventDefault();
    if(totalData.length < 1) {
        return;
    }

    var fio = form.querySelector('input[name="fio"]').value;
    var phone = form.querySelector('input[name="phone"]').value;
    var email = form.querySelector('input[name="email"]').value;

    var error = document.querySelector('.js-error')
    if(!fio || !phone || !email) {
        error.classList.remove('hidden');
        return;
    } else {
        error.classList.add('hidden');
    }

    axios.post('https://rehabmir.ru/calc/send.php', {
        'fio': fio,
        'phone': phone,
        'email': email,
        'hdn': createTable(totalData).innerHTML,
    }).then((response) => {
        console.log(response.data);
    })

})


function CallPrint(strid) {
    var prtContent = document.getElementById(strid);
    var prtCSS = '<link rel="stylesheet" href="/style.css" type="text/css" />';
    var WinPrint = window.open('','','left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0');
    WinPrint.document.write('<div id="print" class="contentpane">');
    WinPrint.document.write(prtCSS);
    WinPrint.document.write(prtContent.innerHTML);
    WinPrint.document.write('</div>');
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
}


buttonToPrint.forEach(function (item) {
    item.addEventListener('click', function () {
        CallPrint('total')
    })
})

// распечатка документа

function createWrapper(node, className) {
    var wrapper = createElement({tag: 'div', className: className});
    wrapper.append(node);
    return wrapper;
}

function addWrapper(node) {
    return createWrapper(node, 'price-column');
}

function renderPriceElement(data) {
    return {
        price: function () {
            var node = createElement({tag: 'p', className: 'js-price-price', text: data.price});
            node.classList.add('price-price')
            return addWrapper(node);
        },
        wrapper: function () {
            return createElement({tag: 'div', className: 'price-row'})
        },
        total: function () {
            var total = createElement({tag: 'p', className: 'js-price-total', text: data.price});
            total.classList.add('price-total');
            return total;
        },

        name: function () {
            var node = createElement({tag: 'p', className: 'price-name', text: data.name});
            return addWrapper(node);
        },

        count: function () {
            var count = createElement({tag: 'input', className: 'js-count'});
            count.classList.add('count')
            count.setAttribute('type', 'number');
            count.setAttribute('min', '0');
            count.placeholder = 1;
            count.value = 1;
            return count;
        },

        checkbox: function () {
            var checkbox = createElement({tag: 'input', className: 'js-checkbox'});
            checkbox.setAttribute('type', 'checkbox');
            checkbox.checked = data.checked
            return checkbox;
        },

        render() {
            const wrapper = this.wrapper();
            const checkbox = this.checkbox();
            const name = this.name();
            const price = this.price();
            const total = this.total();
            const count = this.count();

            wrapper.append(addWrapper(checkbox));
            wrapper.append(name);
            wrapper.append(addWrapper(count));
            wrapper.append(price);
            wrapper.append(addWrapper(total));
            return {
                wrapper, checkbox, count
            }
        },
    }
}

function createElement({tag, className, text}) {
    var node = document.createElement(tag);
    if(className && className !== '') {
        node.classList.add(className);
    }
    if(text) {
        node.innerText = text
    }
    return node;
}

function renderAccordion(title, stop) {
    return {
        createWrapper: function () {
            var head = createElement({tag: 'div', className: 'accordion'});
            head.classList.add('hide')
            return head;
        },

        createHead: function () {
            var head = createElement({tag: 'div', className: 'accordion-head'});
            head.classList.add('js-accordion-head');
            var arrow = createElement({tag: 'span', className: 'accordion-arrow'});
            var headLine = createElement({tag: 'h4', className: 'accordion-title', text: title});
            head.append(arrow);
            head.append(headLine);
            return head;
        },

        init: function () {
            var accordion = this.createWrapper();
            var head = this.createHead(title)
            var body = createElement({tag: 'div', className: 'accordion-body'});


            head.addEventListener('click', function (evt) {
                var target = evt.target;
                if(stop(target)) return;
                accordion.classList.toggle(HIDE_CLASS);
            })

            accordion.append(head);
            accordion.append(body);

            return {accordion: accordion, head: head, body: body}
        }
    }
}

function renderItem(title, data, updateChecked) {
    // var ADD_TEXT = 'Добавить все';
    var values = data;
    var dom = {};

    return {
        updateDom(element, reset) {
            var id = element.id;
            dom[id].count.value = reset ? 1 : element.count;
            dom[id].checkbox.checked = element.checked;
        },

        updateData(index, count) {
            values[index].count = count;
            values[index].checked = count > 0;
        },


        update(count, value, reset) {
            var index = values.findIndex(i => i.id === value.id);
            this.updateData(index, count);
            this.updateDom(values[index], reset);
            this.updateButtonName();
            var checked = values.filter((i) => i.checked);
            updateChecked(checked);
        },

        stop: function (target) {
            return target.classList.contains('js-add-all')
        },

        renderAccordion: function () {
            var accordion = renderAccordion(title, this.stop);
            return accordion.init();
        },
        renderHeader() {
            var wrapper = createElement({tag: 'div', className: 'price-row'});
            var checkbox = createElement({tag: 'div', className: 'price-column'});
            var title = createElement({tag: 'div', className: 'price-column', text: 'Услуга' });
            var count = createElement({tag: 'div', className: 'price-column', text: 'Кол-во'});
            var price = createElement({tag: 'div', className: 'price-column', text: 'Цена за ед., ₽'});
            var total = createElement({tag: 'div', className: 'price-column', text: 'Итого'});

            wrapper.append(checkbox);
            wrapper.append(title);
            wrapper.append(count);
            wrapper.append(price);
            wrapper.append(total);
            return wrapper;

        },
        renderItem(value, table) {
            var element = renderPriceElement(value);
            var {wrapper, checkbox, count} = element.render();
            var _this = this;
            dom[value.id] = {checkbox: checkbox, count: count};
            table.append(wrapper);

            count.addEventListener('change', function (evt) {
                var count = evt.target.value;
                _this.update(count, value)
            })

            checkbox.addEventListener('change', function (evt) {
                var checked = evt.target.checked;
                var count = checked ? 1 : 0;
                _this.update(count, value);
            })

            wrapper.addEventListener('click', function (e) {
                var target = e.target;
                if(target.classList.contains('js-count')) return;
                if(target.classList.contains('js-checkbox')) return;
                var count = value.count  === 0 ? 1 : 0;
                _this.update(count, value);
            })
        },

        createTable() {
            var table = createElement({tag: 'div', className: 'price-table'});
            table.classList.add('hide-last');
            var _this = this;
            table.append(this.renderHeader())
            values.forEach(function (value) {
                _this.renderItem(value, table);
            })
            return table;
        },
        checkedAll: function () {
            return values.every(item => item.checked);
        },

        updateButtonName: function () {
            // this.button.innerText = this.checkedAll() ? 'Удалить все' : ADD_TEXT;
        },

        resetAll: function () {
            var _this = this;
            values.forEach(function (value) {
                _this.update(0, value, true);
            })
        },

        // initButton: function () {
        //     var button = createElement({tag: 'button', className: 'js-add-all', text: ADD_TEXT});
        //     button.classList.add('add-all')
        //     var _this = this;
        //
        //     button.addEventListener('click', function () {
        //         var checked = _this.checkedAll();
        //         values.forEach(function (value) {
        //             var currentCount = value.count !== 0 ? value.count : 1
        //             var count = checked ? 0 : currentCount;
        //             _this.update(count, value);
        //         })
        //     });
        //     return button;
        // },

        init: function () {
            var { accordion, head, body } = this.renderAccordion();
            var table = this.createTable()
            body.append(table);
            // this.button = this.initButton(body);
            // head.append(this.button);
            return accordion;
        }
    }
}


function fetchPrice() {
    return axios.get('./data.json').then((response) => {
        return response.data
    })
}

function renderPrice(price, cb) {
    var selectedPrice = {};
    var resetAll = []

    return {
        stop: function (target) {
            target.classList.contains('js-add-all');
        },

        updateChecked: function(values, id) {
            selectedPrice[id] = values;
            this.renderTotalBlock();

        },

        createTotalElement: function (item) {
            var wrapper = createElement({tag: 'div', className: 'price-total'});
            wrapper.classList.add('price-row');

            var title = createElement({tag: 'div', className: 'price-total-name'});
            title.classList.add('price-column');
            title.innerText = item.name;
            var count = createElement({tag: 'div', className: 'price-total-count'});
            count.classList.add('price-column');
            count.innerText = item.count;
            var total = createElement({tag: 'div', className: 'price-total-total'});
            total.classList.add('price-column');
            total.innerText = (item.total ?? item.count * item.price) + ' ₽';

            wrapper.append(title)
            wrapper.append(count)
            wrapper.append(total)
            return wrapper;
        },

        formattedList: function () {
            return Object.values(selectedPrice).reduce(function (acc, i) {
                acc = [...acc, ...i];
                return acc;
            }, [])
        },

        renderTotalBlock: function() {
            var selectedList = this.formattedList();
            var _this = this;
            var parent = document.querySelector('#total');
            parent.innerHTML = '';
            var count = 0;
            var total = 0;
            // выполняются обработчики при обновлении блока
            cb(selectedList);
            if(selectedList.length === 0) return;
            var table = createElement({tag: 'div', className: 'price-total'});
            table.classList.add('price-table');


            var title = createElement({tag: 'p', className: 'price-total-title', text: 'Выбранные позиции'});
            var wrapper = createElement({tag: 'p', className: 'price-total-wrapper'});

            var head = this.createTotalElement({name: 'Услуга', count: 'Выбрано услуг', total: 'Итого'});
            table.append(head);

            selectedList.forEach(function (item) {
                count += Number(item.count);
                total += Number(item.count) * Number(item.price);

                var i = _this.createTotalElement(item);
                table.append(i);
            })
            var footer = this.createTotalElement({name: 'ИТОГО', count: count, total: total});
            table.append(footer);

            parent.append(title);
            parent.append(wrapper);
            wrapper.append(table);
            parent.append(wrapper);
        },
        reset: function () {
            if(resetAll.length < 1) return;
            resetAll.forEach(function (reset) {
                reset();
            })
        },

        init: function (app) {
            var priceList = Object.entries(price);
            var updateChecked = this.updateChecked.bind(this);

            priceList.forEach(function ([key, values], idx) {
                function update(values) {
                    updateChecked(values, idx)
                }
                var item = renderItem(key, values, update);
                var accordion = item.init();
                resetAll.push(item.resetAll.bind(item))
                app.append(createWrapper(accordion, 'accordion-wrapper'));
            })
        }
    }
}

// инициализация
document.addEventListener('DOMContentLoaded', function () {
    var buttonOpen = document.querySelector('.js-open');
    var buttonClose = document.querySelector('.js-close');
    var buttonReset = document.querySelector('.js-removeAll');

    changeStateAccordion(buttonOpen, function (item) {
        item.classList.remove(HIDE_CLASS)
    })
    changeStateAccordion(buttonClose, function (item) {
        item.classList.add(HIDE_CLASS)
    })

    fetchPrice().then((response) => {
        var formatted = formattedPrice(response);
        var app = document.querySelector('#table');
        var initPrice = renderPrice(formatted, updateState);
        initPrice.init(app);

        buttonReset.addEventListener('click', function () {
            initPrice.reset()
        })

    })
})


function changeStateAccordion(button, cb) {
    button.addEventListener('click', function () {
        var acc = document.querySelectorAll('.accordion');
        acc.forEach(cb)
    })
}

function formattedPrice(response) {
    var values = Object.values(response);

    return values.reduce(function (acc, item, idx) {
        var values = Object.keys(acc);

        if(!values.includes(item.parent)) {
            acc[item.parent] = []
        }
        acc[item.parent].push({id: idx, name: item.children, price: item.price, checked: false, count: 0, })
        return acc;

    }, {})
}

