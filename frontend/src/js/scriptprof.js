var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ProfileManager {
    constructor() {
        // Ждем полной загрузки DOM, чтобы элементы гарантированно были на месте
        if (document.readyState === 'complete') {
            this.init();
        }
        else {
            window.addEventListener('load', () => this.init());
        }
    }
    init() {
        try {
            // Находим все элементы по ID из твоего HTML
            this.viewMode = document.getElementById('view-mode');
            this.editMode = document.getElementById('edit-mode');
            this.usernameDisplay = document.getElementById('username');
            this.bioDisplay = document.getElementById('bio');
            this.yearDisplay = document.getElementById('user-year');
            this.avatarCircle = document.getElementById('avatar');
            // Привязываем функции к глобальному объекту window, чтобы HTML их видел
            window.toggleEdit = (s) => this.toggleEdit(s);
            window.saveProfile = () => this.saveProfile();
            window.previewImage = (e) => this.previewImage(e);
            console.log("SpaceProf System: Online");
        }
        catch (err) {
            console.error("SpaceProf System: Initialization failed. Check HTML IDs.");
        }
    }
    toggleEdit(isEditing) {
        if (!this.viewMode || !this.editMode)
            return;
        if (isEditing) {
            const inputName = document.getElementById('input-username');
            const inputYear = document.getElementById('input-year');
            const inputBio = document.getElementById('input-bio');
            // Подставляем текущие значения в поля ввода
            if (inputName)
                inputName.value = this.usernameDisplay.innerText;
            if (inputBio)
                inputBio.value = this.bioDisplay.innerText;
            if (inputYear) {
                const yearVal = this.yearDisplay.innerText.replace('Birth Year: ', '').replace('---', '');
                inputYear.value = yearVal.trim();
            }
            this.viewMode.style.display = 'none';
            this.editMode.style.display = 'flex';
        }
        else {
            this.viewMode.style.display = 'block';
            this.editMode.style.display = 'none';
        }
    }
    previewImage(event) {
        const file = event.target.files[0]; // Исправлено: берем ПЕРВЫЙ файл
        if (file && this.avatarCircle) {
            const reader = new FileReader();
            reader.onload = () => {
                this.avatarCircle.style.backgroundImage = `url(${reader.result})`;
            };
            reader.readAsDataURL(file);
        }
    }
    saveProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const inputName = document.getElementById('input-username');
            const inputYear = document.getElementById('input-year');
            const inputBio = document.getElementById('input-bio');
            const newName = inputName.value || "Anonymous Pilot";
            const newYear = inputYear.value || "---";
            const newBio = inputBio.value || "No transmission data...";
            // Мгновенно обновляем интерфейс
            this.usernameDisplay.innerText = newName;
            this.yearDisplay.innerText = `Birth Year: ${newYear}`;
            this.bioDisplay.innerText = newBio;
            // Здесь в будущем будет fetch() к Rust
            console.log("Profile Synced Locally:", { newName, newYear, newBio });
            this.toggleEdit(false);
        });
    }
}
// Запуск
new ProfileManager();
