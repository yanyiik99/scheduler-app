import images from '../../assets';


function Navbar() {


  return (
    <nav className="w-full bg-white">
      <div className="max-w-xl sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-[1440px] px-6 py-4 mx-auto flex justify-between">
        {/* Logo */}
        <div>
          <img src="https://www.w3schools.com/images/lamp.jpg" alt="logo movio" className="block w-12 h-12"/>
        </div>

        {/* Right Nav */}
        <div className='flex items-center'>
          <img src={images.search} alt="notification" className='block w-7 h-7 mx-4 text-white' />
          <img src={images.bell} alt="notification" className='block w-7 h-7 mx-4 text-white' />
          <img src={images.user} alt="notification" className='block w-7 h-7 mx-4 text-white' />
        </div>
      </div>  
    </nav>
  )
}

export default Navbar