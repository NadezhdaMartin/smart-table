import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
        .forEach((elementName) => {                        // Перебираем по именам
            elements[elementName].append(                    // в каждый элемент добавляем опции
                ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                        .map(name => {                        // используйте name как значение и текстовое содержимое
                            // Создаем элемент option
                            const option = document.createElement('option');

                            // Устанавливаем значение атрибута value
                            option.value = name;

                            // Устанавливаем текст внутри тега option
                            option.textContent = name;       // @todo: создать и вернуть тег опции
                        
                            return option;
                        })
            )
    })
    return (data, state, action) => {
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
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}