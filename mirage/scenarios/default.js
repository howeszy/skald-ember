export default function(server) {
  let document = server.create('document', {
    src: '/assets/images/testform.png',
    height: 2200,
    width: 1700
  });

  let signer = server.create('signer', {
    order: 0,
    name: 'John Doe',
    document: document
  });

  server.create('field', {
    name: 'Full Name',
    signer: signer,
    document: document,
    value: 'Dr. Terry Michael Smith III',
    type: 'single',
    fontFamily: 'times',
    fontSize: 15,
    height: 2,
    width: 71.82353,
    x: 17.17647,
    y: 30.72727
  });
}
