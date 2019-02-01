import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IEmoji} from './models/emoji.model';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {SESSION_STORAGE, StorageService} from 'angular-webstorage-service';

@Injectable()
export class DataEmojisService {
    activateRoute: string = ''; // текщий роут
    baseUrl: string = 'https://api.github.com/emojis'; // путь до данных
    dataEmojis: IEmoji = {}; // данные всех эмоджи
    fetching: boolean = false; // индикатор загрузки
    searchValue: string = ''; // поисковая строка
    visibleEmojis = new BehaviorSubject<IEmoji[]>([]); // массив видимых эмоджи
    STORAGE_KEY_FAVORITE: string = 'local_favorite_emojis'; // имя хранилища избранных
    favoriteEmojis = []; // список избранных
    STORAGE_KEY_DELETED: string = 'local_deleted_emojis'; // имя удаленных
    deletedEmojis = []; // список удаленных

    constructor(private http: HttpClient, @Inject(SESSION_STORAGE) private storage: StorageService) {
        this.fetching = true;
        this.http.get(this.baseUrl).subscribe((emojisFromApi: IEmoji) => {
            this.fetching = false;
            this.dataEmojis = emojisFromApi;
            this.getLocalStorageFavorited();
            this.getLocalStorageDeleted();
            this.updateVisibleEmojis();
        });
    }

    /*
    * Возвращает заголовок странцы
    * */
    getTitle(): string {
        if (this.activateRoute === '') return 'Все';
        if (this.activateRoute === 'favorite') return 'Любимые';
        if (this.activateRoute === 'deleted') return 'Удаленные';
        return '';
    }

    /*
    * Меняет значение роута
    * route - новое значение роута
    * */
    changePage(route: string) {
        this.activateRoute = route;
        this.updateVisibleEmojis();
    }

    /*
    * Меняет значение строки поиска
    * searchValue - текущая строка поиска
    * */
    changeSearchValue(searchValue: string) {
        this.searchValue = searchValue;
        this.updateVisibleEmojis();
    }

    /*
    * Получает данные об избранных из хранилища
    * */
    getLocalStorageFavorited() {
        this.favoriteEmojis = this.storage.get(this.STORAGE_KEY_FAVORITE) || [];
    }


    /*
    * Поулчает данные об удаленных из хранилища
    * */
    getLocalStorageDeleted() {
        this.deletedEmojis = this.storage.get(this.STORAGE_KEY_DELETED) || [];
    }

    /*
    * Обновляет список видимых эмоджи
    * */
    updateVisibleEmojis() {
        const visibleEmojis = [];
        Object.keys(this.dataEmojis).forEach(key => {
            if ((this.activateRoute === '') && (this.deletedEmojis.indexOf(key) === -1)) {
                visibleEmojis[key] = this.dataEmojis[key];
            } else if ((this.activateRoute === 'favorite') && (this.favoriteEmojis.indexOf(key) !== -1) && (this.deletedEmojis.indexOf(key) === -1)) {
                visibleEmojis[key] = this.dataEmojis[key];
            } else if ((this.activateRoute === 'deleted') && (this.deletedEmojis.indexOf(key) !== -1)) {
                visibleEmojis[key] = this.dataEmojis[key];
            }
        });
        this.visibleEmojis.next(visibleEmojis);
    }

    /*
    * Добавляет/удаляет в/из избранного
    * emojiKey - название эмоджи
    * */
    setFavorite(emojiKey: string) {
        let currentStorageOfFavorite = this.favoriteEmojis;
        const indexInStorage = currentStorageOfFavorite.indexOf(emojiKey);
        if (indexInStorage !== -1) {
            delete currentStorageOfFavorite[indexInStorage];
        } else {
            currentStorageOfFavorite = [...currentStorageOfFavorite, emojiKey];
        }
        this.storage.set(this.STORAGE_KEY_FAVORITE, currentStorageOfFavorite);
        this.getLocalStorageFavorited();
        this.updateVisibleEmojis();
    }

    /*
    * Удаляет/восстанавливает эмоджи
    * emojiKey - название эмоджи
    * */
    setDeleted(emojiKey: string) {
        let currentStorageOfDeleted = this.deletedEmojis;
        const indexInStorage = currentStorageOfDeleted.indexOf(emojiKey);
        if (indexInStorage !== -1) {
            delete currentStorageOfDeleted[indexInStorage];
        } else {
            currentStorageOfDeleted = [...currentStorageOfDeleted, emojiKey];
        }
        this.storage.set(this.STORAGE_KEY_DELETED, currentStorageOfDeleted);
        this.getLocalStorageDeleted();
        this.updateVisibleEmojis();
    }
}
