import { IDLE_NAVIGATION } from '@remix-run/router'
import axios from 'axios'
import { useEffect, useState } from 'react'
import './Rooms.css'
import { motion } from 'framer-motion'
import * as HoverCard from '@radix-ui/react-hover-card';
import { red, green } from '@ant-design/colors';
import { Progress } from 'antd';

type rooms = {
    room: {
        room_name: string
        status: string
        procedures: {
            percentage: string,
            name: string,
            end: string
        }[]
    }
}




type date = {
    argument: string
}

function Rooms(date:date){
    const [rooms, setRooms] = useState<rooms[]>([])

    function fetchRooms(){
        axios.get('http://127.0.0.1:8000/api/rooms/' + date.argument + '/')
        .then((response) => {
            setRooms(response.data.data)})
    }

    useEffect(fetchRooms, [rooms])


    return(
        <div className="roomContainer">
            {rooms.map(r => {return(
                <motion.div key={r.room.room_name} className={r.room.status} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                    <HoverCard.Root>
                        <HoverCard.Trigger asChild>
                            <div className="roomName" style={{padding: '5px', width: '100px', margin: 'auto'}}>
                                <h3>{r.room.room_name}</h3>
                            </div>
                        </HoverCard.Trigger>
                        <HoverCard.Portal>
                            {r.room.procedures.length > 0 ? (
                                <HoverCard.Content className="HoverCardContent" sideOffset={5}>
                                    <motion.div className='procedureHoverCard' initial={{y: -200, opacity:0, scale:0}} animate={{y:0, opacity:100, scale:1}} transition={{duration:0.1}}>
                                        {r.room.procedures.map((x, i) => {return(
                                            <>
                                            <div style={{margin: 'auto'}}>{x.percentage=='100' ? <p>{x.name} <br></br>finalizada às {x.end}</p>: <p> {x.name} <Progress percent={parseInt(x.percentage)} status="exception" size='small'/></p> }</div>
                                            {i+1 != r.room.procedures.length && <hr></hr>}
                                            </>
                                        )})}
                                    </motion.div>
                                    <HoverCard.Arrow className="HoverCardArrow" />
                                </HoverCard.Content>
                            ):(
                                <HoverCard.Content className="HoverCardContent" sideOffset={5}>
                                    <motion.div className='procedureHoverCard' initial={{y: -200, opacity:0, scale:0}} animate={{y:0, opacity:100, scale:1}} transition={{duration:0.1}} style={{color: 'gray'}}>
                                        <p>Nada aconteceu aqui ainda</p>
                                    </motion.div>
                                </HoverCard.Content>
                            )}
                        </HoverCard.Portal>
                    </HoverCard.Root>
                    
                    {r.room.procedures.map(x => {return(
                        <div style={{width: '70%', margin: 'auto'}}>{parseInt(x.percentage) >= 0 && parseInt(x.percentage) < 100 ? <Progress percent={parseInt(x.percentage)} status="active" showInfo={false}/>: <></> }</div>
                        )})}
                </motion.div>
            )})}
        </div>
    )
}



export default Rooms