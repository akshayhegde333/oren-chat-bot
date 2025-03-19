import Image from 'next/image'
import React from 'react'

const Message = ({ message, user }) => {
  return (
    <div className={`max-w-[70%] flex ${user ? 'flex-row-reverse' : 'flex-row'} ${user ? 'ml-auto' : 'mr-auto'} items-center gap-[8px] my-[8px] `}>
      <Image alt={'bot'} src={'/bot.webp'} width={32} height={32} className='rounded-full' />
      <div className={`p-[10px] rounded-[8px] ${user ? 'bg-[#1E2B56] text-[#ffffff]' : 'border border-[#1E2B56] bg-[#ffffff] text-[#1e2b56]'}`}
        dangerouslySetInnerHTML={{ __html: message }}>
      </div>
    </div>
  )
}

export default Message
