import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {IEmoji} from './models/emoji.model';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {ActivatedRoute} from '@angular/router';
import {DataEmojisService} from './data-emojis.service';
import {Observable} from 'rxjs/internal/Observable';
import {debounceTime} from 'rxjs/operators';

@Pipe({
    name: 'emojiFilter'
})
export class EmojiFilterPipe implements PipeTransform, OnDestroy {
    constructor(private ref: ChangeDetectorRef) {
    }

    /*
    * Фильтр эмоджи по строке поиска
    * */
    transform(emojiList: any, searchString: any) {
        if (emojiList.length === 0 || searchString === '') return emojiList;
        return emojiList.filter(emoji => emoji.key.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
    }

    ngOnDestroy() {
        this.ref.detach();
    }
}
