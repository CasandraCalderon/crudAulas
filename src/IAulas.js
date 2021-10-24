import React, { Component } from "react";
import './IAulas.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Select from "react-select";

const url = "http://localhost:3002/aulas";
const options = [
  { value: "PLANTA BAJA", label: "PLANTA BAJA" },
  { value: "PRIMER PISO", label: "PRIMER PISO" },
  { value: "SEGUNDO PISO", label: "SEGUNDO PISO" },
  { value: "TERCER PISO", label: "TERCER PISO" },
  { value: "CUARTO PISO", label: "CUARTO PISO" }
];
class IAulas extends Component {
  //Almacenar estado
  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      id: '',
      Nombre: '',
      Piso: null,
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
  
  peticionPut=()=>{
    axios.put(`${url}/${this.state.form.id}`, this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })

  }
  
  peticionDelete=()=>{
    axios.delete(`${url}/${this.state.form.id}`).then(response=>{
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
  
  handlePiso = Piso => {
    this.setState ({Piso});
    this.setState({
      form:{
        ...this.state.form, Piso: (options.filter(P => P.value === Piso).map(Piso => {return Piso.value}))
      }
    })
    //console.log(`Option selected:`, Piso);
    console.log(this.state.form);
  };


    componentDidMount() {
      this.peticionGet();
    }
  
  
    render(){
      const {form}=this.state;
      const { Piso } = this.state;
    return (
      <div>
      <br /><br />
    <div className="text-center">
      <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Aula</button>
    </div>


    <br />
      <table className="table table-fixed text-center container">
        <thead className="row">
          <tr className="Pri">
            <th className="Seg">ID</th>
            <th className="Seg">Nombre</th>
            <th className="Seg">Piso</th>
            <th className="Seg">Capacidad de Alumnos</th>
            <th className="Seg">Tipo de Sala</th>
            <th className="Seg">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map(aulas=> {
            return(
              <tr key={aulas.id} className="Pri">
            <td className="Seg">{aulas.id}</td>
            <td className="Seg">{aulas.Nombre}</td>
            <td className="Seg">{aulas.Piso}</td>
            <td className="Seg">{aulas.Capacidad}</td>
            <td className="Seg">{aulas.TipoSala}</td>
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
                      <Select value={form? form.Piso: Piso} onChange={this.handlePiso} options={options} />
                      
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