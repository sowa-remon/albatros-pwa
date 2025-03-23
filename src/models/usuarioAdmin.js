class usuarioAdmin {
    constructor(id, usuario, password, tipo) {
        this.id = id;
        this.usuario = usuario;
        this.password = password;
        this.tipo = tipo;
    }
    
    // Método para transformar un documento de Firestore en un objeto de la clase
    toFirestore(){
        return {
            id: this.id,
            usuario: this.usuario,
            password: this.password,
            tipo: this.tipo
        }
    }

    static fromFirestore(doc){
        const data = doc.data();
        return new usuarioAdmin(doc.id, data.usuario, data.password, data.tipo);
    }
}

module.exports = usuarioAdmin;