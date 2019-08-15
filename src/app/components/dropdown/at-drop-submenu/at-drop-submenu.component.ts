import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  OnInit,
  Optional,
  QueryList,
  Renderer2,
  SkipSelf
} from '@angular/core';
import { DropMenuListComponent } from '../../menu/drop-menu-list/drop-menu-list.component';
import { SubMenuComponent } from '../../menu/sub-menu/sub-menu.component';
import { DropdownComponent } from '../dropdown.component';

@Component({
  selector: '[at-drop-submenu]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="at-dropdown-menu__submenu-title"
         #trigger
         (click)="setActive()" (mouseenter)="onMouseEnterEvent($event)"
         (mouseleave)="onMouseLeaveEvent($event)"
         [style.paddingLeft.px]="levelPaddingLeft"
         [ngClass]="onHoverClass"
         cdkOverlayOrigin
         #origin="cdkOverlayOrigin"
    >
      <ng-content select="[title]"></ng-content>
      <i *ngIf="subMenuType == 'vertical' || (subMenuType == 'horizontal' && isInSubMenu )"
         class="icon icon-chevron-right right-arrow"></i>

    </div>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayPositions]="overlayPositions"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayWidth]="triggerWidth"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayOpen]="isOpen && parent.atType != 'inline'"
    >
      <div
        [@expandAnimation]="expandState"
        class="overlay-menu "
        (mouseenter)="onMouseEnterEvent($event)"
        (mouseleave)="onMouseLeaveEvent($event)">
        <div class="at-menu-dropdown__popover">
          <div class="at-dropdown-menu">
            <ng-template [ngTemplateOutlet]="subMenuTemplate"></ng-template>
          </div>
        </div>
      </div>
    </ng-template>
    <ng-template #subMenuTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  animations: [
    trigger('expandAnimation', [
      state('expand', style({height: '*'})),
      state('hidden', style({height: 0, overflow: 'hidden'})),
      transition('expand => hidden', animate(150)),
      transition('hidden => expand', animate(150)),
      state('fade', style({opacity: 1})),
      transition('fade => void', [
        animate(150, style({opacity: 0}))
      ]),
      transition('void => fade', [
        style({opacity: '0'}),
        animate(150)
      ]),
      state('bottom', style({
        opacity: 1,
        transform: 'scaleY(1)',
        transformOrigin: '0% 0%'
      })),
      transition('void => bottom', [
        style({
          opacity: 0,
          transform: 'scaleY(0.8)',
          transformOrigin: '0% 0%'
        }),
        animate('150ms cubic-bezier(0.23, 1, 0.32, 1)')
      ]),
      transition('bottom => void', [
        animate('150ms cubic-bezier(0.23, 1, 0.32, 1)', style({
          opacity: 0,
          transform: 'scaleY(0.8)',
          transformOrigin: '0% 0%'
        }))
      ])
    ])
  ]
})
export class AtDropSubmenuComponent extends SubMenuComponent implements OnInit {

  constructor(public _elementRef: ElementRef, public cd: ChangeDetectorRef,
              @SkipSelf() @Optional() public subMenuComponent: AtDropSubmenuComponent,
              public dropdown: DropdownComponent,
              public drop_down_menu_list: DropMenuListComponent,
              public _renderer: Renderer2) {
    super(_elementRef, cd, subMenuComponent as any, drop_down_menu_list as any, _renderer);
    this._el           = this._elementRef.nativeElement;
    this.nativeElement = this._elementRef.nativeElement;
  }

  @ContentChildren(AtDropSubmenuComponent, {descendants: true}) subMenus: QueryList<SubMenuComponent> | QueryList<AtDropSubmenuComponent>;

  handleOpenEvent = (data: boolean) => {
    if (this.isOpen !== data) {
      this.isOpen = data;
    }
    if (this.subMenuComponent) {
      this.subMenuComponent.$subOpen.next(this.isOpen);
    }
    if (this.drop_down_menu_list && !this.subMenuComponent) {
      this.dropdown.$subOpen.next(data);
    }
    this.hoverOn = this.isOpen;
    this.cd.detectChanges();
  }

}
