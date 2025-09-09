export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
            // @todo: #4.2 — обработать очистку поля
            const buttons = document.querySelectorAll('button');
            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                const name = button.getAttribute('name');
                if (name && name.includes('clear')) {
                    const input = button.closest('.filter-wrapper').querySelector('input'); // замените '.parent-class' на класс родительского элемента
                    if (input) {
                        input.value = ''; // Сброс значения input
                        
                        // Получаем имя поля из атрибута data-field
                        const fieldName = button.dataset.field;
                        // Обновляем соответствующее поле в state
                        state[fieldName] = '';
                    }
                }
            }

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}