import React, {Component} from 'react'
import {render} from 'react-dom'
import Axios from '../node_modules/axios';

const root = document.getElementById('root')

const DepartmentRow = ({department, selectDepartment}) =>{
    const {name, id} =department;
    return (
        <li onClick={()=> selectDepartment(id)}>
            {department.name}
        </li>
    )
}

const Department = ({department, selectDepartment}) =>{
    return (
        <div>
            <h2>{department.name}</h2>
            <ul>
                {
                    department.users.map(user => <li key={user.id}>{user.name}</li>)
                }
            </ul>
            <a href='#' onClick={()=> selectDepartment(-1)}>Back</a>
        </div>
    )
}

const Departments = ({ departments, selectDepartment}) =>{
    return (
        <div>
            <h2>Departments</h2>
            <ul>
                {
                    departments.map(department => <DepartmentRow key={department.id} department={department} selectDepartment={selectDepartment}/>)
                }
            </ul>
        </div>
    )
}

class App extends Component {
    constructor (){
        super();
        this.state = {
            departments: [],
            department: {}
        }
        this.selectDepartment = this.selectDepartment.bind(this)
    }
    async componentDidMount(){
        const response = await Axios.get('/api/departments')
        this.setState({ departments: response.data})
    }
    async selectDepartment(id){
        if(id === -1){
            this.setState({ department: {}})
            return
        }
        const response = await Axios.get(`/api/departments/${id}`)
        this.setState({ department: response.data})
    }
    render(){
        const { selectDepartment } = this;
        const {departments, department} =this.state;
        return (
            department.id ? (<Department department={department} selectDepartment={selectDepartment}/>) : (
            <Departments departments={departments} selectDepartment={selectDepartment} />
        )
    )
    }
}
render(<App />, root)
