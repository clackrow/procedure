import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import './Login.css'
import { useNavigate } from "react-router-dom"
import axios from "axios"



function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [fail, setFail] = useState(false)
    const navigate = useNavigate()

    // if(window.localStorage.token.length > 4) {useEffect(() => navigate('/home'), [])}

    function handleForm(action: any){
        action.preventDefault()
        console.log(username, password)
        axios.post('http://127.0.0.1:8000/api-auth/', {'username': username, 'password': password})
        .then((response) => window.localStorage.setItem('token', response.data.token))
        .then(() => navigate('/home'))
        .catch((error) => {
            console.log('Falha na autenticação:', error)
            setFail(true)
        })
        
    }

    



    return(
        <motion.div className="mainPage" initial={{scale: 0 }} animate={{scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="titleBox">
                <h1>Seja bem vindo</h1>
                <h3>Faça login para continuar</h3>
            </div>
            <hr/>
            <div className="loginForm">
                <form action=""  onSubmit={handleForm}>
                    <motion.input type="text" onChange={(e) => setUsername(e.target.value)} placeholder='Usuário' whileTap={{scale: 1.1}}/>
                    <br />
                    <br />
                    <motion.input type="password" onChange={(e) => setPassword(e.target.value)} placeholder='Senha' whileTap={{scale: 1.1}}/>
                    <br />
                    <motion.button type="submit" whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>Entrar</motion.button>
                    {fail && <motion.p initial={{scale: 0}} animate={{scale: 1}} transition={{ duration: 0.3 }}>Usuário ou senha incorretos</motion.p>}
                </form>
            </div>
        </motion.div>
    )
}

export default Login