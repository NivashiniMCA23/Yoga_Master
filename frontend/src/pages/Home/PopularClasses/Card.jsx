import React from 'react'
import {Link} from "react-router-dom"

const Card = ({item}) => {
    // console.log(item)
    const {_id, name, image, availableSeats, price, totalEnrolled, } = item;
    // console.log(_id)
  return (
    <div className='shadow-lg rounded-lg p-3 flex flex-col justify-between border border-secondary overflow-hidden
    m-4'>
        <img src={image} alt=""/>
        <div className='p-4'>
            <h2 className='text-xl font-semibold mb-2 dark:text-white'>{name}</h2>
            <p className='text-gray-600 mb-2'>Available Seats: {availableSeats}</p>
            <p className='text-gray-600 mb-2'>Price: {price}</p>
            <p className='text-gray-600 mb-2'>Total students: {totalEnrolled}</p>
        </div>
    </div>
  )
}

export default Card