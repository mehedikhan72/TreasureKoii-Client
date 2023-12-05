import React from 'react'
import { Link } from 'react-router-dom'

const YouNeedToBeLoggedIn: React.FC = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
        <p className="text-3">You need to be logged in for this action.</p>
        <Link to={{ pathname: `/login` }}>
            <button className="my-btn-1">Login</button>
        </Link>
    </div>
  )
}

export default YouNeedToBeLoggedIn