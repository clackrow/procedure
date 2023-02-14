import axios from "axios"
import { useEffect, useState } from "react"
import './Procedures.css'
import * as ContextMenu from '@radix-ui/react-context-menu';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Progress } from 'antd';

type procedures = {
    name: string,
    start_time: string,
    is_finished: boolean,
    surgery_room: {
        name: string,
        id: string
    },
    id: string,
    end_time: string
    completion_percentage: string,
}

type date = {
    argument: string
}

function Procedures(date: date) {
    const [procedures, setProcedures] = useState<procedures[]>([])


    function fetchProcedures() {
        axios.get('http://127.0.0.1:8000/api/procedures/' + date.argument + '/', { headers: { 'Authorization': 'Token ' + window.localStorage.token } })
            .then((response) => {
                setProcedures(response.data)
            })
            .catch((error) => console.log(error))
    }

    function endProcedure(id:any) {
        axios.get('http://127.0.0.1:8000/api/finish_procedure/' + id)
    }


    useEffect(() => fetchProcedures, [procedures])

    return (
        <>
            <ScrollArea.Root className="ScrollAreaRoot">
                <ScrollArea.Viewport className="ScrollAreaViewport">
                    {procedures.length > 0 ? (
                        <div className="myProcedures">
                            {procedures.map((p, i) => {
                                return (
                                    <ContextMenu.Root>
                                        <ContextMenu.Trigger>
                                            <div className={"singleProcedure"} key={p.id} style={p.is_finished == true ? ({color: "gray"}):({color: "black"})}>
                                                <div className="procedureName">
                                                    <p>{p.name}</p>
                                                </div>
                                                <div className="procedureRoom">
                                                    <p>Sala {p.surgery_room.name}</p>
                                                </div>
                                                <div className="procedureTime">
                                                    <p>{p.start_time} / {p.end_time}</p>
                                                </div>
                                                <div className="procedureProgress">
                                                    {parseInt(p.completion_percentage) == 100 ? <Progress percent={100} /> : <Progress percent={parseInt(p.completion_percentage)} status="exception" />}
                                                </div>
                                                <hr />
                                            </div>
                                        </ContextMenu.Trigger>
                                        <ContextMenu.Portal>
                                            <ContextMenu.Content className="contextMenu">
                                                <ContextMenu.Item className="contextItem">
                                                    Excluir procedimento
                                                </ContextMenu.Item>
                                                <ContextMenu.Item className="contextItem">
                                                    Informações
                                                </ContextMenu.Item>
                                                <ContextMenu.Item className="contextItem" onSelect={() => {endProcedure(p.id)}}>
                                                    Marcar como finalizado
                                                </ContextMenu.Item>
                                                <ContextMenu.Item className="contextItem" onSelect={() => {console.log('clicado')}}>
                                                    Consultar materiais
                                                </ContextMenu.Item>
                                            </ContextMenu.Content>
                                        </ContextMenu.Portal>
                                    </ContextMenu.Root>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="greetings" style={{ width: '80%', margin: 'auto', marginTop: '15vh', textAlign: 'center' }}>
                            <p>Os procedimentos aparecerão aqui!</p>
                        </div>
                    )}
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner className="ScrollAreaCorner" />
            </ScrollArea.Root>
        </>
    )

}

export default Procedures