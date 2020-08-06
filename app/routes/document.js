import Route from '@ember/routing/route';

export default class DocumentRoute extends Route {
    model(params) {
        return this.store.findRecord('document', params.id, {
            include: 'signers,fields,fields.signer'
        });
    }
}
