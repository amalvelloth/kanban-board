import React from 'react'
import DesktopMenu from '../components/DesktopMenu'

function WorkoutPrograms() {
  return (
    <section className='flex'>
      <DesktopMenu />
      <div className='h-screen w-full pt-32 ps-10 bg-neutral-900'>
        <div className="flex-col">
          <h1 className='text-transparent font-extrabold text-6xl text-stroke'>Workouts</h1>
          <h1 className='text-white text-xl mt-4'>... something here ...</h1> 
        </div>
      </div>
    </section>
  )
}

export default WorkoutPrograms