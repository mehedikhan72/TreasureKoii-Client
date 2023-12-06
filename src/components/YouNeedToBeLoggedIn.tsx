import React from 'react'
import { Link } from 'react-router-dom'

const YouNeedToBeLoggedIn: React.FC<{message: string | null | undefined}> = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
        <p className="text-3">{message}</p>
        <Link to={{ pathname: `/login` }}>
            <button className="my-btn-1">Login</button>
        </Link>
    </div>
  )
}

export default YouNeedToBeLoggedIn