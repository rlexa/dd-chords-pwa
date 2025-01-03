import {Provider, Type} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {MockedComponent} from 'ng-mocks';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {Mock} from 'ts-mockery';

/**
 *  @example
 * TestBed
 * .configureTestingModule()
 * .overrideComponent(TestComponent, overrideForChangeDetection)
 * .compileComponents();
 */
export const overrideForChangeDetection = {set: {host: {'(click)': 'dummy'}}};

/**
 * Kickstart change detection for `onPush` components, needs `overrideForChangeDetection` pre-configuring.
 * @example
 * ... overrideForChangeDetection ...
 * detectChanges(fixture);
 */
export const detectChanges = <T>(fixture: ComponentFixture<T>) => {
  fixture.debugElement.triggerEventHandler('click', null);
  fixture.detectChanges();
};

/**
 * Builds a getter of existing mocked component by type.
 */
export const getterMockedComponent =
  <T>(type: Type<T>) =>
  (fixture: ComponentFixture<any>): MockedComponent<T> =>
    fixture.debugElement.query(By.directive(type))?.componentInstance;

/**
 * Converts the given Observable<T> to a Promise<T> using the rxjs operator take.
 */
export function takePromise<T>(observable: Observable<T>, count = 1): Promise<T> {
  return observable.pipe(take(count)).toPromise();
}

/**
 * Mocks via factory.
 */
export const mockWith = <T>(provide: Type<T>, mock: T) => ({provide, useFactory: () => mock}) as Provider;

export const mockAll = <T>(provide: Type<T>) => mockWith(provide, Mock.all<T>());
