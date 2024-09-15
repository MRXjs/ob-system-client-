'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Homepage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // check cookie is exits
        const cookie = document.cookie.split('; ').find((row) => row.startsWith('accessToken='))
        console.log(cookie)
        if (cookie) {
            router.push('/dashboard')
        }
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)
        const username = e.target[0].value
        const password = e.target[1].value

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/login`,
                {
                    username,
                    password,
                },
                { withCredentials: true },
            )
            if (res.data.success) {
                toast.success('Login successfully!', {})
                // setTimeout(() => {
                //     router.push('/dashboard')
                // }, 2000)
            }
        } catch (error: any) {
            error?.response?.data.message && toast.error(error?.response?.data.message)
        }
        setIsLoading(false)
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form className="w-96 p-6 shadow-lg bg-white rounded-md" onSubmit={handleSubmit}>
                <h1 className="text-3xl block text-center font-semibold">Login</h1>
                <hr className="mt-3" />
                <div className="mt-3">
                    <label htmlFor="username" className="black text-base mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        required
                        className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                        placeholder="Enter username"
                    />
                </div>
                <div className="mt-3">
                    <label htmlFor="password" className="black text-base mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        required
                        className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                        placeholder="Enter password"
                    />
                </div>
                <div className="mt-5">
                    <button
                        type="submit"
                        className="bg-indigo-500 w-20 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <FaSpinner className="animate-spin h-6 w-6 mr-3 text-white" />
                        ) : (
                            'Login'
                        )}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Homepage
