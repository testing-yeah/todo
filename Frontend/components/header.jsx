import React from 'react'

function Header() {
    return (
        <div className='bg-stone-300 w-full h-16'>
            <div className='max-w-[1500px] mx-auto  flex justify-between p-5 text-black'>
                <div className='text-xl font-semibold'>TODO</div>

                <div>
                    User
                </div>
            </div>
        </div>
    )
}

export default Header