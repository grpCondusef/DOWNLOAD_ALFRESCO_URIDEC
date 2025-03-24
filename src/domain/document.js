class Document {
    constructor({ site_name, expediente, document_name, content_size, audit_creator, audit_created, path_, nodo, uuid }) {
        this.siteName = site_name;
        this.expediente = expediente;
        this.documentName = document_name;
        this.contentSize = content_size;
        this.auditCreator = audit_creator;
        this.auditCreated = audit_created;
        this.path = path_;
        this.nodo = nodo;
        this.uuid = uuid;
    }
}

export default Document;