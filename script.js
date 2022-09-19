var checkedList = [];

function fetchPrice() {
    return axios.get('./data.json').then((response) => {
        return response.data
    })
}

function formattedPrice(response) {
    var values = Object.values(response);

    return values.reduce(function (acc, item, idx) {
        var values = Object.keys(acc);

        if(!values.includes(item.parent)) {
            acc[item.parent] = []
        }
        acc[item.parent].push({id: idx, name: item.children, price: item.price})
        return acc;

    }, {})
}

function addWrapper(node) {
    var wrapper = createElement({tag: 'div', className: 'price-column'});
    wrapper.append(node);
    return wrapper;
}

function createElement({tag, className, text}) {
    var node = document.createElement(tag);
    node.classList.add(className);
    if(text) {
        node.innerText = text
    }
    return node;
}

function renderInput() {
    var count = createElement({tag: 'input', className: 'js-count'});
    count.classList.add('count')
    count.setAttribute('type', 'number');
    count.setAttribute('min', '0');
    count.placeholder = 1;
    return addWrapper(count);
}

function renderCheckbox() {
    var checkbox = createElement({tag: 'input', className: 'js-checkbox'});
    checkbox.setAttribute('type', 'checkbox');
    return checkbox;
}

function renderPriceItem(text) {
    var node = createElement({tag: 'p', className: 'js-price-price', text: text});
    node.classList.add('price-price')
    return addWrapper(node);
}

function renderName(text) {
    var node = createElement({tag: 'p', className: 'price-name', text: text});
    return addWrapper(node);
}

function renderPriceElement(node, data) {
    var wrapper = createElement({tag: 'div', className: 'price-row'});

    var price = renderPriceItem(data.price);
    var total = createElement({tag: 'p', className: 'js-price-total', text: data.price});
    total.classList.add('price-total');
    var count = renderInput(total);
    var checkbox = renderCheckbox();
    var name = renderName(data.name);

    checkbox.addEventListener('change', function (e) {
        onChangeCheckbox({event: e, total: total, data: data, count});
    });

    function onChange(e) {
        changeCount(e, total, checkbox, price, data);
    }

    count.addEventListener('change', function (e) {
        onChange(e);
    });

    wrapper.append(addWrapper(checkbox));
    wrapper.append(name);
    wrapper.append(count);
    wrapper.append(price);
    wrapper.append(addWrapper(total));

    node.append(wrapper);
}

function createHead(text) {
    var head = createElement({tag: 'div', className: 'accordion-head'});
    head.classList.add('js-accordion-head');
    var title = createElement({tag: 'h4', className: 'accordion-head', text: text});
    head.append(title);
    return head;
}

function createBody(values) {
    var body = createElement({tag: 'div', className: 'accordion-body'});
    var table = createElement({tag: 'div', className: 'price-table'});

    values.forEach(function (value) {
        renderPriceElement(table, value)
    })
    body.append(table);
    return body;
}

function createAccordion() {
    return createElement({tag: 'div', className: 'accordion'});
}

function renderPrice(price) {
    var parent = document.querySelector('#table');
    if(!parent) {
        console.log('нет родительского контейнера!')
        return;
    }

    var data = Object.entries(price);
    data.forEach(function ([key, values]) {
        var accordion = createAccordion();
        var head = createHead(key)
        var body = createBody(values)

        accordion.append(head);
        accordion.append(body);

        head.addEventListener('click', function () {
            body.classList.toggle('hide');
        })

        parent.append(accordion);
    })
}
function onChangeCheckbox({event, total, data, count}) {
    var checkbox = event.target;
    var checked = event.target.checked;
    total.innerHTML = data.price;
    count.value = 1;

    var index = checkedList.findIndex(i => i.id === data.id);

    if(!checked) {
        if(index === -1) return;
        checkbox.checked = false;

        checkedList = [...checkedList.slice(0, index), ...checkedList.slice(index + 1)];
        updateTotalBlock(checkedList);
    } else {
        checkbox.checked = true;
        checkedList.push({...data, count: 1});
        updateTotalBlock(checkedList);
    }
}

function changeCount(e, totalBlock, checkbox, price, data) {
    var target = e.target;
    var count = target.value;

    if(Number(count) < 0 && count !== '') {
        target.value = 0;
    }
    var index = checkedList.findIndex(i => i.id === data.id);

    if(Number(count) === 0) {
        checkbox.checked = false;
        if(index === -1) return;
        checkedList = [...checkedList.slice(0, index), ...checkedList.slice(index + 1)];
        updateTotalBlock(checkedList);
    } else {
        checkbox.checked = true;
        if(index === -1) {
            checkedList.push({...data, count: Number(count)});
            updateTotalBlock(checkedList);
        } else {
            checkedList[index].count = Number(count);
            updateTotalBlock(checkedList);
        }
    }

    var priceTotal = price.innerText;
    totalBlock.innerHTML = Number(priceTotal) * Number(count);
}

document.addEventListener('DOMContentLoaded', function () {
    fetchPrice().then((response) => {
        var formatted = formattedPrice(response)
        renderPrice(formatted);
    })
})


function createTotalElement(item) {
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
    total.innerText = item.total ?? item.count * item.price;

    wrapper.append(title)
    wrapper.append(count)
    wrapper.append(total)
    return wrapper;
}

function updateTotalBlock(checkedList) {
    var parent = document.querySelector('#total');
    parent.innerHTML = '';
    var count = 0;
    var total = 0;
    if(checkedList.length === 0) return;
    var head = createTotalElement({name: 'Услуга', count: 'Выбранное кол-во', total: 'Итого:'});
    parent.append(head);
    checkedList.forEach(function (item) {
        count += item.count;
        total += item.count * item.price;

        var i = createTotalElement(item);
        parent.append(i);
    })
    var footer = createTotalElement({name: 'ИТОГО', count: count, total: total});
    parent.append(footer);

}