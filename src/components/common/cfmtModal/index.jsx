
import React,{useEffect,useState} from "react";
import { Modal,Button } from "antd";
import style from './index.module.scss'

const ConfirmationModal = (props)=>{
    const [conent,setConent] = useState("")
    const submit = (type)=>{
        props.onSubmit(type)
    }
    useEffect(()=>{
        if(props.conent) setConent(props.conent)
    },[])

    return (
        <Modal
            open={props.show}
            title ="确认提示"
            footer={null}
            onCancel={props.onHandleCancle}
        >   
            <div className={style.conent}>
                {conent}
            </div>
            <div className={style.modalBtn}>
                <Button type="primary" className={style.searchConfirm} onClick={()=>submit('yes')}>确定</Button>
                <Button  className={style.searchReset} onClick={()=>submit('no')}>取消</Button>
            </div>
        </Modal>
    )
}

export default ConfirmationModal