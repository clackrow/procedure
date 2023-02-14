import './NewProcedure.css'
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react';
import axios from 'axios';


type room = {
    name: string,
    id: string, 
}



function NewProcedure(){

    const [rooms, setRooms] = useState<room[]>([])
    const [procedureName, setProcedureName] = useState('')
    const [procedureDate, setProcedureDate] = useState('')
    const [initTime, setInitTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [roomName, setRoomName] = useState('1')
    const [csrfToken, setCsrfToken] = useState('')

    function fetchRooms() {
        axios.get('http://127.0.0.1:8000/api/room_list/', {headers:{'Authorization': 'Token ' + window.localStorage.token}})
        .then((response) => {
            setRooms(response.data)})
    }

    function fecthCsrf(){
        console.log('called')
        axios.get('http://127.0.0.1:8000/api/get_csrf_token/')
        .then((response) => setCsrfToken(response.data.csrf_token))
    }


    function handleForm(action: any){
        action.preventDefault()
        console.log(csrfToken)
        axios.post('http://127.0.0.1:8000/api/procedure_post/', {'name': procedureName, 'date': procedureDate, 'init_time': initTime, 'end_time': endTime, 'room_name': roomName}, {headers:{"Content-Type": "multipart/form-data", 'Authorization': 'Token ' + window.localStorage.token, "X-CSRFTOKEN": csrfToken}})
        .then((response) => console.log(response))
    }

    
    useEffect(() => {
        fecthCsrf()
        fetchRooms()
    }, [])

    

    return(
        <div className="popoverContent">
            <Popover.Root>
            <Popover.Trigger className="PopoverTrigger">
                <motion.div className="addButton" whileHover={{scale: 1.3}} whileTap={{scale: 0.95}}>+</motion.div>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="PopoverContent">
                    <motion.div className="addProcedure" initial={{x:100, y:100, scale:0}} animate={{ x:0, y:-50, scale:1}} transition={{ duration: 0.5 }}>
                        <h3>Adicionar procedimento</h3>
                        <hr />
                        <form action="" onSubmit={handleForm}>
                            <input type="text" placeholder='Nome do procedimento' onChange={(e) => setProcedureName(e.target.value)}/>
                            <input type="date" onChange={(e) => setProcedureDate(e.target.value)}/>
                            <br />
                            <input type="time" onChange={(e) => setInitTime(e.target.value)}/> até <input type="time" onChange={(e) => setEndTime(e.target.value)}/>
                            <br />
                            <select name="" id="" onChange={(e) => setRoomName(e.target.value)} value={roomName}>
                            {rooms.map((room) => {return(
                                    <option key={room.id} value={room.name}>Sala {room.name}</option>
                                )})}
                            </select>
                            <br />
                            <br />
                            <motion.button type='submit' whileHover={{scale:1.5}} whileTap={{scale:1.1}}>💾</motion.button>
                        </form>
                    </motion.div>
                <Popover.Arrow className="PopoverArrow" />
                </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            </div>
    )
}


export default NewProcedure