import React from 'react'
import { UserContext } from '../context/user.context'
import { useContext } from 'react'

const Home = () => {
    const {user} = useContext(UserContext)
  return (
    <main className='p-4'>
      <div className="projects">
        <div className="project">
          
        </div>
      </div>
    </main>
  )
}

export default Home
