import React from "react";

import { logo } from "../assets";

const Main = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
      <nav className='flex justify-between items-center w-full mb-10 pt-3'>
        <img src={logo} alt='sumz_logo' className='w-20 object-contain' />
        <span className='text-4xl blue_gradient'>Commune Summizer</span>

      </nav>

      <h1 className='head_text'>
        Summarize Websites with <br className='max-md:hidden' />
        <span className='orange_gradient '>Commune AI</span>
      </h1>
      <h2 className='desc'>
        Simplify your website with Commune Summize, an open-source website summarizer
        that describe website concisely and clearly
      </h2>
    </header>
  );
};

export default Main;