import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'
const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-112.5' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>StyleHUB is a modern clothing brand dedicated to bringing style, comfort, and confidence into your everyday life. We create trend-forward designs using high-quality fabrics that feel as good as they look. Our mission is to make fashion accessible, versatile, and expressive for everyone. Whether you are dressing for casual moments or special occasions, StyleHUB helps you stand out effortlessly with pieces crafted for your unique lifestyle.</p>
          <p>Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>At StyleHUB, our mission is to empower individuals through fashion by offering stylish, affordable, and high-quality clothing. We aim to make modern trends accessible while promoting confidence, self-expression, and comfort, ensuring every customer finds pieces that truly reflect their personality and lifestyle.</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We ensure top-notch quality through premium materials, careful craftsmanship, and strict checks to deliver lasting comfort and durability.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Enjoy seamless shopping with easy navigation, secure payments, fast delivery, and hassle-free returns, making your fashion experience smooth, quick, and enjoyable.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>We prioritize your satisfaction with fast support, easy returns, and a seamless shopping experience, ensuring every customer feels valued and confident in every purchase.</p>
        </div>      
      </div>
    <NewsletterBox/>
    </div>
  )
}

export default About
