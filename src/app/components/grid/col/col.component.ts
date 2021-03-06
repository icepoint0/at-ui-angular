import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges
}                       from '@angular/core';
import { isNotNil }     from '../../utils/class-helper';
import { RowComponent } from '../row/row.component';

@Component({
  selector: '[at-col]',
  template: `
    <ng-content></ng-content>
  `
})
export class ColComponent implements OnInit, OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
    this.setClassMap();
  }

  constructor(public _elementRef: ElementRef, private _renderer: Renderer2,
              @Optional() private atRow: RowComponent) {
    this._el = this._elementRef.nativeElement;
  }

  @HostBinding('style.padding-left.px')
  get paddingLeft(): number {
    return this.atRow && this.atRow.atGutter / 2;
  }

  @HostBinding('style.padding-right.px')
  get paddingRight(): number {
    return this.atRow && this.atRow.atGutter / 2;
  }

  private _span: number;
  private _offset: number;
  _el: HTMLElement;
  _classList: string[] = [];
  _col_type: 'md' | 'sm' | 'xs' | 'lg' = 'md';

  @Input() atXs: number;
  @Input() atSm: number;
  @Input() atMd: number;
  @Input() atLg: number;

  @Input()
  set colType(value: 'md' | 'sm' | 'xs' | 'lg') {
    this._col_type = value;
  }

  get colType(): 'md' | 'sm' | 'xs' | 'lg' {
    return this._col_type;
  }

  get span(): number {
    return this._span;
  }

  @Input()
  set span(value: number) {
    this._span = value;
  }

  get offset(): number {
    return this._offset;
  }

  @Input()
  set offset(value: number) {
    this._offset = value;
  }

  ngOnInit(): void {
  }

  classMap = {};

  /** temp solution since no method add classMap to host https://github.com/angular/angular/issues/7289*/
  setClassMap(): void {

    const listOfSizeInputName = ['atXs', 'atSm', 'atMd', 'atLg'];
    const listClassMap = {};
    listOfSizeInputName.forEach(name => {
      const sizeName = name.replace('at', '').toLowerCase();
      if (isNotNil(this[name])) {
        if ((typeof(this[name]) === 'number') || (typeof (this[name]) === 'string')) {
          listClassMap[`col-${sizeName}`] = true;
          listClassMap[`col-${sizeName}-${this[name]}`] = true;
          listClassMap[`col-${sizeName}-${this[name]}-offset-${this.offset}`] = this.offset ? true : false;
          listClassMap[`col-${this[name]}`] = true;
        }
      }
    });

    const _classList = [
      this.span && `col-${this.span}`,
      this.offset && `col-offset-${this.offset}`
    ];
    _classList.forEach(item => {
      item ? listClassMap[item] = true : null;
    });

    this.removeClass(this._el, this.classMap, this._renderer);
    this.updateHostClass(this._el, listClassMap);
  }

  updateHostClass(el: HTMLElement, classMap: object): void {
    this.classMap = {...classMap};
    this.addClass(el, this.classMap, this._renderer);
  }

  private addClass(el: HTMLElement, classMap: object, renderer: Renderer2): void {
    for (const i in classMap) {
      if (classMap.hasOwnProperty(i)) {
        if (classMap[i]) {
          renderer.addClass(el, i);
        }
      }
    }
  }

  private removeClass(el: HTMLElement, classMap: object, renderer: Renderer2): void {
    for (const i in classMap) {
      if (classMap.hasOwnProperty(i)) {
        renderer.removeClass(el, i);
      }
    }
  }

}
