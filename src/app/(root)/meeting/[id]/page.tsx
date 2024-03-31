import React from 'react'

const Meeting = ({params}:any) => {
  const {id} = params;
  return (
    <div>
      Meeting {id}
    </div>
  )
}

export default Meeting
