
import React, {Component} from 'react';
import ModalPage from './PageModal';
import { Container, Row, Button, Form, Table, Navbar, FormControl} from 'react-bootstrap';

class Body extends Component{
    constructor(props){
        super(props)
        this.state={
            dataTabel:[],
            valueSearch:'',
            inputNama:'',
            inputJabatan:'',
            inputJkelamin:'',
            inputTanggal:'',
            inputId:''
        }
        this.handleEdit=this.handleEdit.bind(this)
        this.handleSave=this.handleSave.bind(this)
        this.handleInput=this.handleInput.bind(this)
        this.closeModal=this.closeModal.bind(this)
        this.clearInput=this.clearInput.bind(this)
        this.handleDel=this.handleDel.bind(this)
        this.search=this.search.bind(this)        
        this.tampilData=this.tampilData.bind(this)
    }

    handleInput(value, e){
        this.setState({[value]: e.target.value})
    }

    closeModal(){
        this.props.setModalShow(false)
        this.clearInput()
    }

    clearInput(){
        this.setState(
            {
            inputNama:'',
            inputJabatan:'',
            inputKelamin:'',
            inputTanggal:'',
            inputId:'' 
            }
        )
    }

    handleEdit(id){
        fetch(`http://localhost:3000/data-karyawan/${id}`)
            .then((response)=>response.json())
            .then((hasil)=>{
                this.props.setModalShow(true)
                this.setState(
                    {
                        inputNama:hasil.nama_karyawan,
                        inputJabatan:hasil.jabatan,
                        inputKelamin:hasil.jenis_kelamin,
                        inputTanggal:hasil.tanggal_lahir,
                        inputId:hasil.id
                    }
                )
            })
    }

    handleSave(){
        if(this.state.inputNama === '' || this.state.inputJabatan === '' || 
        this.state.inputKelamin === '' || this.state.inputTanggal === ''){
            alert('Silahkan Isi Data')
        } else if(this.state.inputId === ''){
            fetch('http://localhost:3000/data-karyawan',{
                method:'POST',
                body:JSON.stringify({
                    nama_karyawan:this.state.inputNama,
                    jabatan:this.state.inputJabatan,
                    jenis_kelamin:this.state.inputKelamin,
                    tanggal_lahir:this.state.inputTanggal
                }),
                headers:{
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
            .then ((response)=>response.json())
            .then ((result)=>{
                console.log(result)
                this.closeModal()
                this.tampilData()
            })
        } else{
            fetch(`http://localhost:3000/data-karyawan/${this.state.inputId}`,{
                method:'PUT',
                body:JSON.stringify({
                    nama_karyawan:this.state.inputNama,
                    jabatan:this.state.inputJabatan,
                    jenis_kelamin:this.state.inputKelamin,
                    tanggal_lahir:this.state.inputTanggal
                }),
                headers:{
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
            .then ((response)=>response.json())
            .then ((hasil)=>{
                this.tampilData()
                this.props.setModalShow(false)
                this.clearInput()
            })

        }
    }

    handleDel(id){
        fetch(`http://localhost:3000/data-karyawan/${id}`,{
            method:'DELETE',
        })
        .then((response)=>{
            alert('Data Terhapus')
            this.tampilData()
        })
    }

    search(e){
        this.setState({valueSearch: e.target.value})
    }

    tampilData(){
        fetch('http://localhost:3000/data-karyawan')
            .then((response)=>response.json())
            .then((hasil)=>this.setState({dataTabel:hasil}))
    }

    componentDidMount(){
        this.tampilData()
    }

    render(){
        return(
            <div>
                <Navbar bg="secondary">
                    <Navbar.Brand style={{color:'white'}}><h2> <b>DATA KARYAWAN</b></h2></Navbar.Brand>
                        </Navbar>
                                            
                    <Form inline>                 
                        <FormControl style={{marginLeft:'500px', width:'500px'}} type="text" 
                            placeholder="Masukan Nama Karyawan" className="mr-sm-2" 
                            value={this.state.valueSearch} onChange={(e)=>this.search(e)}/>                                                                              
                        <Button onClick={()=>this.props.setModalShow(true)} 
                        variant="info">Tambah Data</Button>                                        
                    </Form>
                                       
                    <Container>
                    <ModalPage modalShow={this.props.modalShow} 
                            setModalShow={this.props.setModalShow} 
                            closeModal={this.closeModal} 
                            handleInput={this.handleInput} 
                            dataState={this.state} 
                            handleSave={this.handleSave} 
                            handleEdit={this.handleEdit}/>
                    <Row>
                        <Table striped bordered hover style={{marginTop:'40px', textAlign:'center'}} >
                            <thead style={{fontWeight:'bolder', fontSize:'14px'}}>
                                <tr>
                                    <td>NO</td>
                                    <td>ID</td>
                                    <td>NAMA</td>
                                    <td>JABATAN</td>
                                    <td>JENIS KELAMIN</td>
                                    <td>TANGGAL LAHIR</td>
                                    <td></td>                               
                                </tr>
                            </thead>
                    <tbody >
                        {this.state.dataTabel.reverse().filter(valueFilter=>valueFilter.nama_karyawan.toLowerCase().includes(this.state.valueSearch)).map((value, index)=>{
                            return(
                                <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{value.id}</td>
                                            <td>{value.nama_karyawan}</td>
                                            <td>{value.jabatan}</td>
                                            <td>{value.jenis_kelamin}</td>
                                            <td>{value.tanggal_lahir}</td>
                                            <td><Button onClick={()=> this.handleDel(value.id)}  
                                                    variant='info' size='sm' style={{margin:'5%'}}>Delete</Button>
                                                <Button onClick={()=>this.handleEdit(value.id)} 
                                                    variant='info' size='sm'>Edit</Button></td>
                                    </tr>
                                    )
                                    })
                                }           
                            </tbody>
                        </Table>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Body