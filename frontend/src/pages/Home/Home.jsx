import React from 'react'
import HeroContainer from './Hero/HeroContainer'
import Gallary from './Gallary/Gallary'
import PopularClasses from './PopularClasses/PopularClasses'
import useAuth from '../../hook/useAuth'
// import PopularTeacher from './PopularTeacher/PopularTeacher'

const Home = () => {
  // console.log(import.meta.env.VITE_APIKEY)
  return (
    <section>
      <HeroContainer/>
      <div className="max-w-screen-xl mx-auto">
        <Gallary/>
        <PopularClasses/>
        {/* <PopularTeacher/> */}
      </div>
    </section>
  )
}

export default Home