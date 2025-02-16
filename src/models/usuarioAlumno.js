class usuarioAlumno {
    constructor(id, nombre, apellidos, fechaN, antecedentes, restricciones, direccion, telefono, nivel, usuario, password, estado, tipo, evaluacion ={}) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos  = apellidos;
        this.fechaN = fechaN;
        this.antecedentes = antecedentes;   
        this.restricciones = restricciones;
        this.direccion = direccion;
        this.telefono = telefono;
        this.nivel = nivel;
        this.usuario = usuario;
        this.password = password;
        this.estado = estado;
        this.tipo = tipo;
        this.evaluacion = evaluacion;
    }
    
    // Método para transformar un documento de Firestore en un objeto de la clase
    toFirestore(){
        return {
            id: this.id,
            nombre: this.nombre,    
            apellidos: this.apellidos,
            fechaN: this.fechaN,
            antecedentes: this.antecedentes,
            restricciones: this.restricciones,
            direccion: this.direccion,
            telefono: this.telefono,
            nivel: this.nivel,
            usuario: this.usuario,
            password: this.password,
            estado: this.estado,
            tipo: this.tipo,
            evaluacion: this.evaluacion
        }
    }

    static fromFirestore(doc){
        const data = doc.data();
        return new usuarioAlumno(doc.id, data.nombre, data.apellidos, 
            data.fechaN, data.antecedentes, data.direccion, data.telefono, 
            data.nivel, data.usuario, data.password, data.estado, data.tipo,data.evaluacion);
    }
}

module.exports = usuarioAlumno;