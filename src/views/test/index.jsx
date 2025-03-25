import React, { Component } from "react";
import Cookies from 'js-cookie';
class Test extends Component {
    constructor(props){
        super(props)
        this.state={
            value:""
        }
    }
    componentDidMount(){
        
    }
    goTest=()=>{
        Cookies.remove('token');
        this.props.navigate('/login')
        
    }
    render(){
        return <>
            <span onClick={()=>this.goTest()}>点击</span>
        </>
    }
}

export default Test