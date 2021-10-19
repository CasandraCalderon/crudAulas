import React, { Component } from "react";
import './IAulas.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const url = "http://localhost:3002/aulas";

class IAulas extends Component {
  //Almacenar estado
  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      id: '',
      Nombre: '',
      Piso: '',
      Capacidad: '',
      TipoSala: '',
      tipoModal: ''
    }
  }
  
  peticionGet=()=>{
  axios.get(url).then(response=>{
    this.setState({data: response.data});
  }).catch(error=>{
    console.log(error.message);
  })
  }
  
  peticionPost=async()=>{
    delete this.state.form.id;
   await axios.post(url,this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }
  
  //PROBLEMAS CON LAS PETICIONES PUT
  peticionPut=()=>{
    axios.put(url,this.state.form.id, this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })

  }
  
  //PROBLEMAS CON LAS PETICIONES GET
  peticionDelete=()=>{
    axios.delete(url,this.state.form.id).then(response=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    })
  }
  
  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }
  
  seleccionarAula=(aulas)=>{
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: aulas.id,
        Nombre: aulas.Nombre,
        Piso: aulas.Piso,
        Capacidad: aulas.Capacidad,
        TipoSala: aulas.TipoSala
      }
    })
  }
  
  handleChange=async e=>{
  e.persist();
  await this.setState({
    form:{
      ...this.state.form,
      [e.target.name]: e.target.value
    }
  });
  console.log(this.state.form);
  }
  
    componentDidMount() {
      this.peticionGet();
    }
    
  
    render(){
      const {form}=this.state;
    return (
      <div>
      <br /><br />
    <div className="text-center"><button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Aula</button></div>
    <br /><br />
      <table className="table table-fixed text-center container">
        <thead className="row">
          <tr className="Primero">
            <th className="Segundo">ID</th>
            <th className="Segundo">Nombre</th>
            <th className="Segundo">Piso</th>
            <th className="Segundo">Capacidad de Alumnos</th>
            <th className="Segundo">Tipo de Sala</th>
            <th className="Segundo">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map(aulas=>{
            return(
              <tr key={aulas.id} className="Primero">
            <td className="Segundo">{aulas.id}</td>
            <td className="Segundo">{aulas.Nombre}</td>
            <td className="Segundo">{aulas.Piso}</td>
            <td className="Segundo">{aulas.Capacidad}</td>
            <td className="Segundo">{aulas.TipoSala}</td>
            <td>
                  <button className="btn btn-primary" onClick={()=>{this.seleccionarAula(aulas); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                  {"   "}
                  <button className="btn btn-danger" onClick={()=>{this.seleccionarAula(aulas); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                  </td>
            </tr>
            )
          })}
        </tbody>
      </table>
  
  
  
      <Modal isOpen={this.state.modalInsertar}>
                  <ModalHeader style={{display: 'block'}}>
                    <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                  </ModalHeader>
                  <ModalBody>
                    <div className="form-group">
                      <label htmlFor="id">ID</label>
                      <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
                      <br />
                      <label htmlFor="Nombre">Nombre</label>
                      <input className="form-control" type="text" name="Nombre" id="Nombre" onChange={this.handleChange} value={form?form.Nombre: ''}/>
                      <br />
                      <label htmlFor="Piso">Piso</label>
                      <input className="form-control" type="text" name="Piso" id="Piso" onChange={this.handleChange} value={form?form.Piso: ''}/>
                      <br />
                      <label htmlFor="Capacidad">Capacidad de alumnos</label>
                        <input className="form-control" type="number" name="Capacidad" id="Capacidad" onChange={this.handleChange} value={form? form.Capacidad: ''}/>
                        <br />
                        <label htmlFor="TipoSala">Sala</label>
                        <input className="form-control" type="text" name="TipoSala" id="Sala" onChange={this.handleChange} value={form? form.TipoSala: ''}/>
                        <br />
                    </div>
                  </ModalBody>
  
                  <ModalFooter>
                    {this.state.tipoModal==='insertar'?
                      <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                      Insertar
                    </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                      Actualizar
                    </button>
    }
                      <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                  </ModalFooter>
            </Modal>
  
  
            <Modal isOpen={this.state.modalEliminar}>
              <ModalBody>
                 Estás seguro que deseas eliminar esta Aula? {form && form.Nombre}
              </ModalBody>
              <ModalFooter>
                <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
                <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
              </ModalFooter>
            </Modal>
    </div>
  
  
  
    );
  }
}
export default IAulas;
