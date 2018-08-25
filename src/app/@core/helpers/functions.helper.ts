import * as _ from 'lodash';

export function findByProp(o, prop, val, retprop = '') {
  if (o == null) { return false; }
  if ( o[prop] === val ) {
    return (retprop) ? o[retprop] : o;
  }
  let result, p;
  for (p in o) {
    if ( o.hasOwnProperty(p) && typeof o[p] === 'object' ) {
      result = findByProp(o[p], prop, val);
      if (result) {
        return (retprop) ? result[retprop] : result;
      }
    }
  }
  return (retprop) ? result[retprop] : result;
}

export function AlertTimeout(callback, delay) {

  let timerId, start, remaining: number = delay;

  this.clear = function () {
    timerId = window.clearTimeout(timerId);
  };

  this.pause = function() {
    this.clear();
    remaining -= new Date().getTime() - start;
  };

  this.resume = function() {
    start = new Date();
    this.clear();
    timerId = window.setTimeout(callback, remaining);
  };

  this.resume();

}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function isSame(arrayOne, arrayTwo) {
  let a = arrayOne,
      b = arrayTwo;

  if (arrayOne.length <= arrayTwo.length) {
    a = arrayTwo;
    b = arrayOne;
  }
  return _.isEmpty(_.difference(a.sort(), b.sort()));
}
