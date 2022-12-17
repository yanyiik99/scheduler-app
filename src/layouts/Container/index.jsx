import React from "react";


function Container({ children }) {
  return (
    <div className='max-w-xl sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-[1440px] bg-orange-300 px-6 mb-10 pb-2 mx-auto h-full'>
      {children}
    </div>
  )
}

export default Container;