import React from 'react'
import bgImg from "../../../assets/home/banner-2.jpg";
const Hero2 = () => {
  return (
<div className='min-h-screen bg-cover ' style={{backgroundImage:`url(${bgImg})`}}>
        <div className='min-h-screen flex justify-start pl-11 items-center text-white bg-black bg-opacity-60'>
            <div>
                <div className="space-y-4">
                    <p className="md:text-4xl text-2xl">Best Online</p>
                    <h1 className="md:text-7xl text-4xl font-blod">Course From Home </h1>
                    <div className="md:w-1/2">
                        <p>Engaging in yoga practice not only benefits the physical body but also 
                            nourishes the mind with peace and mindfulness, easing the stresses of daily life. 
                            To inspire and encourage all yoga enthusiasts.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero2