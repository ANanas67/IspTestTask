import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {DataEmojisService} from '../data-emojis.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit, OnDestroy {
    emojis = {}; // объект всех эмоджи
    title: string = ''; // заголовок
    fetching: boolean = false; // индикатор загрузки
    subscription: Subscription; // подписка на данные
    searchValue: string = ''; // пзначение строки поиска
    favoriteEmojis = []; // список избранных эмоджи
    routeValue: string = ''; // текущий роут
    showBigPicFlag: boolean = false; // флаг на показ полноразмерной картинки
    bigEmojiName: string = ''; // имя полноразмерной картинки

    constructor(private dataEmojisService: DataEmojisService, private activateRoute: ActivatedRoute, private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.subscription = this.dataEmojisService.visibleEmojis.subscribe((visibleEmojis: object) => {
            this.emojis = visibleEmojis;
            this.favoriteEmojis = this.dataEmojisService.favoriteEmojis;
            this.fetching = this.dataEmojisService.fetching;
        });
        this.routeValue = this.activateRoute.snapshot.routeConfig.path;
        this.dataEmojisService.changePage(this.routeValue);
        this.dataEmojisService.changeSearchValue(this.searchValue);
        this.title = this.dataEmojisService.getTitle();
        this.ref.markForCheck();
        this.ref.detectChanges();
    }

    /*
    * Получает название стиля для картинки в зависимости от того, является ли она избранной.
    * emojiName - название эмоджи
    * */
    getStyle(emojiName: string): string {
        if (this.favoriteEmojis.indexOf(emojiName) !== -1) return 'img-style';
        return 'img-favorite-style';
    }

    /*
    * Обработчик добавления/удаления эмоджи из избранного
    * emojiKey - название эмоджи
    * */
    handlerFavorite(emojiKey: string) {
        this.dataEmojisService.setFavorite(emojiKey);
    }

    /*
    * Указывает, что надо отобразить большую картинку
    * emojiName - название эмоджи
    * event - событие наведения
    * flag - флаг на отображение
    * */
    showBigPic(emojiName: string, event: Event, flag: boolean) {
        this.showBigPicFlag = flag;
        this.bigEmojiName = emojiName;
    }

    /*
     * Обработчик удалния и восстановления (обычного и из избранного)
     * emojiKey - название эмоджи
     * */
    handlerDelete(emojiKey: string) {
        if (this.routeValue === 'favorite') {
            this.handlerFavorite(emojiKey);
        } else {
            this.dataEmojisService.setDeleted(emojiKey);
        }
    }

    /*
    * Возвращает отступ
    * */
    getMarginDelete() {
        if (this.routeValue === 'favorite') return '-70%';
    }

    ngOnDestroy() {
        this.ref.detach();
        this.subscription.unsubscribe();
    }
}
