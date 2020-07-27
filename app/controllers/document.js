import Controller from '@ember/controller';

export default class DocumentController extends Controller {
  queryParams = ['docuemnt'];

  document = null;

  fields = [
    {
      height: 10,
      width: 200,
      value: 'this is a field'
    }
  ];
}
