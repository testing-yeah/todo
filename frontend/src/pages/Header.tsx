import React from 'react'
import LogoutButton from './LogoutButton'

const Header = () => {
    return (
        <div className="flex justify-between items-center px-10 py-4 bg-gray-700">
            <div className="text-3xl text-white font-bold">
                <h1>Todo App</h1>
            </div>
            <div className="">
                <LogoutButton />
            </div>
        </div>
    )
}

export default Header
