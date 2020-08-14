import Helper from '@ember/component/helper';

export default class Not extends Helper {
  compute([variable]) {
    return !variable;
  }
}
