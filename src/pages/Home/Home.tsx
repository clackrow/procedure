import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Procedures from "../../components/Procedures/Procedures";
import Rooms from "../../components/Rooms/Rooms";
import NewProcedure from "../../components/NewProcedure/NewProcedure";
import './Home.css'
import { motion } from 'framer-motion'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import * as Popover from '@radix-ui/react-popover';


function Homepage() {
    const todays_date = new Date();
    todays_date.setHours(0,0,0,0);
    const navigate = useNavigate()
    const [logged, setLogged] = useState(false)
    const [date, setDate] = useState(todays_date);
    
    

    return(
        <>
        <div className="mainApp">
            <div className="headerBox">
                <h1>Bem vindo!</h1>
                <Popover.Root>
                    <Popover.Trigger className="PopoverTrigger"><motion.div className="todayButton" whileHover={{scale: 1.2}} whileTap={{scale: 0.8}}>{date.toLocaleDateString()}</motion.div></Popover.Trigger>
                    <Popover.Portal>
                    <Popover.Content className="PopoverContent">
                        <Calendar onChange={setDate} value={date}/>
                        <Popover.Arrow className="PopoverArrow" />
                    </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            </div>
            <br />
            <hr />
            <Rooms argument={date.toISOString().slice(0, 10)}/>
            <Procedures argument={date.toISOString().slice(0, 10)}/>
            <NewProcedure />
            <div className="waterMark"><a href="https://www.linkedin.com/in/rodrigo-azzolini-647350252" target="_blank">ⓘ Sobre o app </a></div>
        </div>
        </>
    )
}

export default Homepage