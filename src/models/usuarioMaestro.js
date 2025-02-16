class usuarioMaestro {
    constructor(id, nombre, apellidos, fechaN, direccion, telefono, usuario, password, estado, tipo, horario ={}) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos  = apellidos;
        this.fechaN = fechaN;
        this.direccion = direccion;
        this.telefono = telefono;
        this.usuario = usuario;
        this.password = password;
        this.estado = estado;
        this.tipo = tipo;
        this.horario = horario;
    }
    
    // Método para transformar un documento de Firestore en un objeto de la clase
    toFirestore(){
        return {
            id: this.id,
            nombre: this.nombre,    
            apellidos: this.apellidos,
            fechaN: this.fechaN,
            direccion: this.direccion,
            telefono: this.telefono,
            usuario: this.usuario,
            password: this.password,
            estado: this.estado,
            tipo: this.tipo,
            horario: this.horario
        }
    }

    static fromFirestore(doc){
        const data = doc.data();
        return new usuarioAlumno(doc.id, data.nombre, data.apellidos, 
            data.fechaN, data.direccion, data.telefono, 
         data.usuario, data.password, data.estado, data.tipo,data.horario);
    }
}

module.exports = usuarioMaestro;