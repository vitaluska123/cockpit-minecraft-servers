document.addEventListener('DOMContentLoaded', () => {
    const createButton = document.getElementById('create-server-button');
    const modal = document.getElementById('create-server-modal');
    const closeButton = document.querySelector('.close-button');
    const submitButton = document.getElementById('submit-server-button');
    const serverList = document.getElementById('server-list');

    const settingsForm = document.getElementById('settings-form');
    const environmentVariablesDiv = document.getElementById('environment-variables');
    const addEnvironmentButton = document.getElementById('add-environment-button');
    const volumesDiv = document.getElementById('volumes');
    const addVolumeButton = document.getElementById('add-volume-button');

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

    // Обработка добавления environment variable
    addEnvironmentButton.addEventListener('click', () => {
        const div = document.createElement('div');
        div.innerHTML = `
            <input type="text" class="env-key" placeholder="KEY">
            <input type="text" class="env-value" placeholder="VALUE">
            <button type="button" class="remove-env-button">Удалить</button>
        `;
        environmentVariablesDiv.appendChild(div);
        attachRemoveButtonListener(div);
    });

    // Обработка добавления volume
    addVolumeButton.addEventListener('click', () => {
        const div = document.createElement('div');
        div.innerHTML = `
            <input type="text" class="volume-source" placeholder="Source Path">
            <input type="text" class="volume-destination" placeholder="Destination Path">
            <button type="button" class="remove-volume-button">Удалить</button>
        `;
        volumesDiv.appendChild(div);
        attachRemoveButtonListener(div);
    });

    // Функция для прикрепления слушателя к кнопке удаления
    function attachRemoveButtonListener(element) {
        const removeButton = element.querySelector('button');
        removeButton.addEventListener('click', () => {
            element.remove();
        });
    }

    // Обработка отправки формы создания сервера
    submitButton.addEventListener('click', () => {
        const activeTab = document.querySelector('.tab-button.active').dataset.tab;
        let configData = {};

        if (activeTab === 'settings') {
            configData = {
                name: settingsForm.elements['server-name'].value,
                image: settingsForm.elements['docker-image'].value,
                port: settingsForm.elements['server-port'].value,
                restart: settingsForm.elements['restart-policy'].value,
                environment: Array.from(environmentVariablesDiv.children).map(envDiv => {
                    return {
                        key: envDiv.querySelector('.env-key').value,
                        value: envDiv.querySelector('.env-value').value
                    };
                }).filter(env => env.key && env.value),
                volumes: Array.from(volumesDiv.children).map(volDiv => {
                    return `${volDiv.querySelector('.volume-source').value}:${volDiv.querySelector('.volume-destination').value}`;
                }).filter(vol => vol.startsWith(':') === false && vol.endsWith(':') === false)
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
        console.log("Creating server with config:", config);
        Cockpit.spawn(["./backend_scripts/create_server.py", JSON.stringify(config)])
            .then(data => {
                console.log("Server creation response:", data);
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