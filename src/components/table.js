import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
     before.reverse().forEach(templateId => {//переворачивает массив.перебираем массив идентификаторов
        root[templateId] = cloneTemplate(templateId);//клонируем и получаем объект, сохраняем в таблице
        root.container.prepend(root[templateId].container); // добавляет каждый клонированный шаблон перед таблицей
    });

    after.forEach(templateId => {
        root[templateId] = cloneTemplate(templateId);
        root.container.append(root[templateId].container); //добавляет каждый клонированный шаблон из массива after после таблицы
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction();
        }, 0);
    });
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => { //создаём новый массив, применяя указанную функцию к каждому элементу item массива data
            const row = cloneTemplate(rowTemplate) //клонируем шаблон строк
            
            Object.keys(item).forEach(key => {//массив ключей объекта item
                // if (row.elements[key]) {
                //     row.elements[key].textContent = item[key];
                // } //Проверяется, существует ли ключ в row.elements. Если да, то значению textContent соответствующего элемента присваивается значение item[key].

                if (key in row.elements) {
                    const el = row.elements[key];
                    const tag = el.tagName.toLowerCase();
                    if (tag === "input" || tag === "select") {
                        el.value = item[key];
                    } else {
                        el.textContent = item[key];
                    }
                }
            });
            
        return row.container;

        })
        root.elements.rows.replaceChildren(...nextRows);
    }
        
    return {...root, render};
}