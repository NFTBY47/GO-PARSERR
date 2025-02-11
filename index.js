document.addEventListener('DOMContentLoaded', () => {
    const expressionInput = document.getElementById('expressionInput');
    const parseButton = document.getElementById('parseButton');
    const resultArea = document.getElementById('resultArea');
    const historyButton = document.getElementById('historyButton');
    const historyMenu = document.getElementById('historyMenu');
    const closeHistoryMenu = document.getElementById('closeHistoryMenu');
    const historyList = document.getElementById('historyList');
    const clearHistoryButton = document.getElementById('clearHistoryButton');

    // Функция для отображения истории из localStorage
    function displayHistory() {
        historyList.innerHTML = ''; // Очищаем список

        let history = JSON.parse(localStorage.getItem('calculationHistory')) || [];

        history.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${item.expression} = ${item.result}`;
            historyList.appendChild(listItem);
        });
    }

    // Отображаем историю при загрузке страницы
    displayHistory();


    parseButton.addEventListener('click', async () => {
        const expression = expressionInput.value;

        try {
            const response = await fetch('http://localhost:8080/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ expression: expression })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            resultArea.textContent = `Результат: ${data.result}`;

            // Сохраняем выражение и результат в историю
            let history = JSON.parse(localStorage.getItem('calculationHistory')) || [];
            history.push({ expression: expression, result: data.result });
            localStorage.setItem('calculationHistory', JSON.stringify(history));

            // Обновляем отображение истории
            displayHistory();

        } catch (error) {
            console.error('Ошибка:', error);
            resultArea.textContent = `Ошибка: ${error.message}`;
        }
    });


    // Открытие меню истории
    historyButton.addEventListener('click', () => {
        historyMenu.classList.add('active');
    });

    // Закрытие меню истории
    closeHistoryMenu.addEventListener('click', () => {
        historyMenu.classList.remove('active');
    });

    // Очистка истории
    clearHistoryButton.addEventListener('click', () => {
        localStorage.removeItem('calculationHistory');
        displayHistory(); // Обновляем отображение
    });


});