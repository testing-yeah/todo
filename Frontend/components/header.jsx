

import { gql, useQuery } from '@apollo/client';
import React from 'react'

function Header() {

    // const LOGIN_USER = gql`
    //   mutation loginUser($email: String!, $password: String!) {
    //     loginUser(email: $email, password: $password) {
    //       user {
    //         id
    //         username
    //         email
    //       }
    //     }
    //   }
    // `;
    // const { data, loading, error } = useQuery(LOGIN_USER);
    // console.log(data)
    return (
        <div className='bg-stone-300 w-full h-16'>
            <div className='max-w-[1500px] mx-auto flex justify-between p-5 text-black'>
                <div className='text-xl font-semibold'>TODO</div>
                <div>
                    User
                </div>
            </div>
        </div>
    )
}

export default Header