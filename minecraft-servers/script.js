document.addEventListener('DOMContentLoaded', () => {
    const createButton = document.getElementById('create-server-button');
    const modal = document.getElementById('create-server-modal');
    const closeButton = document.querySelector('.close-button');
    const submitButton = document.getElementById('submit-server-button');
    const serverList = document.getElementById('server-list');

    // Обработка открытия модального окна
    createButton.addEventListener('click', () => {
        modal.style.display = "block";
    });

    // Обработка закрытия модального окна
    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Обработка вкладок в модальном окне
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Обработка отправки формы создания сервера
    submitButton.addEventListener('click', () => {
        const activeTab = document.querySelector('.tab-button.active').dataset.tab;
        let configData = {};

        if (activeTab === 'settings') {
            const settingsForm = document.getElementById('settings-form');
            configData = {
                name: settingsForm.elements['server-name'].value,
                image: settingsForm.elements['docker-image'].value,
                port: settingsForm.elements['server-port'].value,
                // Соберите другие параметры
            };
        } else if (activeTab === 'docker') {
            configData = {
                dockerCompose: document.getElementById('docker-compose-yaml').value
            };
        }

        // Отправка данных на бэкенд для создания сервера
        createServer(configData);
        modal.style.display = "none";
    });

    // Функция для отправки запроса на бэкенд
    function createServer(config) {
        // Здесь нужно реализовать отправку данных на бэкенд
        // Можно использовать Cockpit.spawn() или fetch API
        console.log("Creating server with config:", config);

        // Пример с использованием Cockpit.spawn (требует настройки бэкенда)
        Cockpit.spawn(["/path/to/your/backend/script.py", JSON.stringify(config)])
            .then(data => {
                console.log("Server created successfully:", data);
                loadServerList(); // Обновить список серверов
            })
            .catch(error => {
                console.error("Error creating server:", error);
            });
    }

    // Функция для загрузки списка серверов (нужно реализовать)
    function loadServerList() {
        // Здесь нужно получить список запущенных контейнеров или серверов
        // и отобразить их в serverList
        serverList.innerHTML = '<li>Сервер 1</li><li>Сервер 2</li>'; // Пример
    }

    // Загрузка списка серверов при загрузке страницы
    loadServerList();
});