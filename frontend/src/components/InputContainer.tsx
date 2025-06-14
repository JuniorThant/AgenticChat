import React from 'react'

export default function InputContainer() {
  return (
    <div className="border-t px-4 py-3 flex items-center gap-2">
        <input type="text" placeholder="Type a message...." className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <button className="bg-blue-500 text-white p-4 rounded-md">
            Send
        </button>
    </div>
  )
}
