interface UserProfile {
    username: string;
    bio: string;
    birth_year: number | null;
    avatar_url: string;
}

class ProfileManager {
    private viewMode!: HTMLElement;
    private editMode!: HTMLElement;
    private usernameDisplay!: HTMLElement;
    private bioDisplay!: HTMLElement;
    private yearDisplay!: HTMLElement;
    private avatarCircle!: HTMLElement;

    constructor() {
        if (document.readyState === 'complete') {
            this.init();
        } else {
            window.addEventListener('load', () => this.init());
        }
    }

    private init() {
        try {
            this.viewMode = document.getElementById('view-mode') as HTMLElement;
            this.editMode = document.getElementById('edit-mode') as HTMLElement;
            this.usernameDisplay = document.getElementById('username') as HTMLElement;
            this.bioDisplay = document.getElementById('bio') as HTMLElement;
            this.yearDisplay = document.getElementById('user-year') as HTMLElement;
            this.avatarCircle = document.getElementById('avatar') as HTMLElement;

            (window as any).toggleEdit = (s: boolean) => this.toggleEdit(s);
            (window as any).saveProfile = () => this.saveProfile();
            (window as any).previewImage = (e: any) => this.previewImage(e);

            console.log("SpaceProf System: Online");
        } catch (err) {
            console.error("SpaceProf System: Initialization failed. Check HTML IDs.");
        }
    }

    public toggleEdit(isEditing: boolean): void {
        if (!this.viewMode || !this.editMode) return;

        if (isEditing) {
            const inputName = document.getElementById('input-username') as HTMLInputElement;
            const inputYear = document.getElementById('input-year') as HTMLInputElement;
            const inputBio = document.getElementById('input-bio') as HTMLTextAreaElement;

            if (inputName) inputName.value = this.usernameDisplay.innerText;
            if (inputBio) inputBio.value = this.bioDisplay.innerText;
            if (inputYear) {
                const yearVal = this.yearDisplay.innerText.replace('Birth Year: ', '').replace('---', '');
                inputYear.value = yearVal.trim();
            }
            
            this.viewMode.style.display = 'none';
            this.editMode.style.display = 'flex';
        } else {
            this.viewMode.style.display = 'block';
            this.editMode.style.display = 'none';
        }
    }

    public previewImage(event: any): void {
        const file = event.target.files[0];
        if (file && this.avatarCircle) {
            const reader = new FileReader();
            reader.onload = () => {
                this.avatarCircle.style.backgroundImage = `url(${reader.result})`;
            };
            reader.readAsDataURL(file);
        }
    }

    public async saveProfile(): Promise<void> {
        const inputName = document.getElementById('input-username') as HTMLInputElement;
        const inputYear = document.getElementById('input-year') as HTMLInputElement;
        const inputBio = document.getElementById('input-bio') as HTMLTextAreaElement;

        const newName = inputName.value || "Anonymous Pilot";
        const newYear = inputYear.value || "---";
        const newBio = inputBio.value || "No transmission data...";

        this.usernameDisplay.innerText = newName;
        this.yearDisplay.innerText = `Birth Year: ${newYear}`;
        this.bioDisplay.innerText = newBio;

        console.log("Profile Synced Locally:", { newName, newYear, newBio });

        this.toggleEdit(false);
    }
}

new ProfileManager();
