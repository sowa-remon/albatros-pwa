class usuarioAdmin {
    constructor(id, usuario, password, tipo, activo) {
        this.id = id;
        this.usuario = usuario;
        this.password = password;
        this.tipo = tipo;
        this.activo = activo;
    }
    
    // Método para transformar un documento de Firestore en un objeto de la clase
    toFirestore(){
        return {
            id: this.id,
            usuario: this.usuario,
            password: this.password,
            tipo: this.tipo,
            activo: this.activo
        }
    }

    static fromFirestore(doc){
        const data = doc.data();
        return new usuarioAdmin(doc.id, data.usuario, data.password, data.tipo, data.activo);
    }
}

module.exports = usuarioAdmin;