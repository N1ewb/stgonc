import React from 'react';
import HeroBG from '../../../static/images/Landing.png';
import stgoncLogo from '../../../static/images/STGONC-Logo.png'
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate()
    const handleGetStarted = () => {
        navigate(`/auth/Login`)
    }
  return (
    <section
      className='w-full h-[90vh] p-10 flex flex-col items-center justify-center gap-5 '
      style={{
        backgroundImage: `url(${HeroBG})`,
        backgroundPosition: 'top',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="logot-wrapper"><img src={stgoncLogo} alt="stgonc-logo" width={62} /></div>
      <h1 className='text-center text-[5rem] font-normal md:text-[4rem] sm:text-[3rem]'>Connect, organize, and track <br/> <span className='text-[#36000099]'>all in <span className='font-bold'>one</span> place</span></h1>
      
      <p className='[&_span]:font-bold'><span>Streamline</span> your <span>consultations</span> and <span>maximize</span> your <span>potential</span>!</p>
      <button className='bg-[#360000] hover:bg-[#720000] px-16 py-4 rounded-2xl text-[20px]' onClick={handleGetStarted}>Get Started</button>
    </section>
  );
};

export default Hero;
