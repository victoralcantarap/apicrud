import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Component } from 'react';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const urlBooks="https://fakerestapi.azurewebsites.net/api/v1/Books";

class App extends Component {
  state={
    data:[],
    modalAgregar: false,
    modalEliminar: false,
    form:{
        title: '',
        description: '',
        pageCount:'',
        excerpt: '',
        publishDate:'',
        tipoModal: ''
    }
  }

  metodoGet=()=>{
  axios.get(urlBooks).then(response=>{
    //console.log(response.data);
    this.setState({data: response.data});
  }).catch(error =>{
    console.log(error.message);
})
  }

  metodoPost=async()=>{
      delete this.state.form.id;
      await axios.post(urlBooks, this.state.form).then(response =>{
          this.modalAgregar();
          this.metodoGet();
      }).catch(error =>{
          console.log(error.message);
      })
  }

  metodoPut=()=>{
      axios.put(urlBooks+this.state.form.id, this.state.form).then(response=>{
          this.modalAgregar();
          this.metodoGet();
      }).catch(error =>{
        console.log(error.message);
    })
  }

  metodoDelete=()=>{
      axios.delete(urlBooks+this.state.form.id).then(response=>{
          this.setState({modalEliminar: false});
          this.metodoGet();
      }).catch(error =>{
        console.log(error.message);
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

  modalAgregar=()=>{
      this.setState({modalAgregar: ! this.state.modalAgregar});
  }

  selBooks =(books)=>{
      this.setState({
          tipoModal: 'actulizar',
          form:{
              id: books.id,
              title: books.title,
              description: books.description,
              pageCount: books.pageCount,
              excerpt: books.excerpt,
              publishDate: books.publishDate,
          }
      })
  }

  componentDidMount(){
      this.metodoGet();
  }

  render(){
      const {form} = this.state;

    return (
      <div className="App">
          <h1>Prueba Técnica Remota </h1>
        <br/>
        <button className="btn btn-success" onClick={() => {this.setState({form: null, tipoModal: 'editar'}); this.modalAgregar()}}>Agregar Libros</button>
        <br/> <br/>
        
         <table className="table">
          <thead>
            <tr>
             <th>ID</th>
             <th>Title</th>
             <th>Description</th>
             <th>Page Count</th>
             <th>Excerpt</th>
             <th>Publish Date</th>
             <th>Action</th>
            </tr>
          </thead>
            <tbody>
                {this.state.data.map(Books=>{
                    return(
                        <tr>
                        <td key={Books.id}>{Books.id}</td>
                        <td>{Books.title}</td>
                        <td>{Books.description}</td>
                        <td>{Books.pageCount}</td>
                        <td>{Books.excerpt}</td>
                        <td>{Books.publishDate}</td>
                        <td>
                            <button className="btn btn-primary" onClick={() => {this.selBooks(Books); this.modalAgregar()}}><FontAwesomeIcon icon={faEdit} /></button>
                            {""}
                            <button className="btn btn-danger" onClick={() => {this.selBooks(Books); this.setState ({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt} /></button>
                        </td>
                        </tr>
                    )
                })}
            </tbody>
          </table>

          <Modal isOpen={this.state.modalAgregar}>
              <ModalHeader style={{display: 'block'}}>
                  <h3>Agregar Libros</h3>
                  <span style={{float: 'right'}}>x</span>
              </ModalHeader>
              <ModalBody>
              <div className="form-group">
                      <label>ID</label>
                      <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form? form.id: this.state.data.lenght+1}/>
                      <br/>
                      <label>Title</label>
                      <input className="form-control" type="text" name="title" id="title" onChange={this.handleChange} value={form? form.title: ''}/>
                      <br/>
                      <label>Description</label>
                      <input className="form-control" type="text" name="description" id="description" onChange={this.handleChange} value={form? form.description: ''}/>
                      <br/>
                      <label>Page Count</label>
                      <input className="form-control" type="text" name="pageCount" id="pageCount" onChange={this.handleChange} value={form? form.pageCount: ''}/>
                      <br/>
                      <label>Excerpt</label>
                      <input className="form-control" type="text" name="excerpt" id="excerpt" onChange={this.handleChange} value={form? form.excerpt: ''}/>
                      <br/>
                      <label>Publish Date</label>
                      <input className="form-control" type="text" name="publishDate" id="publishDate" onChange={this.handleChange} value={form? form.publishDate: ''}/>
                      <br/>
                    </div>
              </ModalBody>
              <ModalFooter>
                  {this.state.tipoModal === 'editar'?
                    <button className="btn btn-success" onClick={() => this.metodoPost()}>Agregar</button>
                    :<button className="btn  btn-primary" onClick={() => this.metodoPut()}>Actualizar</button>
                  }                 
                  <button className="btn btn-danger" onClick={() => this.modalAgregar()}>Cancelar</button>
              </ModalFooter>
          </Modal>

          <Modal isOpen= {this.state.modalEliminar}>
              <ModalBody>
                  Esta seguro que quiere eliminar un libro? 🤔 {form && form.id}
                  <ModalFooter>
                    <button className="btn btn-danger" onClick={() => this.metodoDelete()}>Si</button>
                    <button className="btn btn-secondary" onClick={() => this.setState({modalEliminar: false})}>No</button>
                  </ModalFooter>
              </ModalBody>
          </Modal>
      </div>
    );
  }
}

export default App;
