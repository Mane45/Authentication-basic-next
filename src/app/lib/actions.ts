"use server"

import { OptionalUser } from "./types"
import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'
import { addUser, getAllUsers, getUserByLogin } from "./api"
import { redirect } from "next/navigation"

export const handleSignup = async (prev: unknown, data: FormData) => {
    if (!data.get('name') || !data.get('surname')) {
        return {
            message: "Please fill all the fields."
        }
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{6,15}$/
    if (regex.test(data.get('password') as string)) {
        console.log(data.get('password'))
        return {
            message: "Your password must be at least 6 characters long and include a number, a symbol, and a letter"
        }
    }
    const users = getAllUsers()
    if (users.find(user => user.login == data.get('login'))) {
        return {
            message: "This login is already in use. Please choose another."
        }
    }

    const user: OptionalUser = {
        id: nanoid(),
        name: data.get('name') as string,
        surname: data.get('surname') as string,
        login: data.get('login') as string
    }

    user.password = await bcrypt.hash(data.get('password') as string, 10)
    addUser(user)
    redirect('./login')
}

export const handleLogin = async (prev: unknown, data: FormData) => {

    const user = getUserByLogin(data.get('login') as string)

    const storedHashedPassword = user.password
    const userInputPassword = data.get('password') as string
    const isValidPassword = bcrypt.compareSync(userInputPassword, storedHashedPassword)
    console.log(isValidPassword)
    if(!isValidPassword){    
        return{
             message: 'Authentication failed.'
        } 
    } 
    redirect('./profile')
    
}