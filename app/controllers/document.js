import Controller from '@ember/controller';

export default class DocumentController extends Controller {
  queryParams = ['docuemnt'];

  document = null;

  fields = [
    {
      height: 2,
      width: 5,
      top: 0,
      left: 0,
      value: 'this is a field'
    }
  ];
}
