
import './App.css'
import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from './api/api'
import PostList from './components/post-list'
import { useState } from 'react'

function App() {

  const [toggle, setToggle] = useState(false)

  return (
    <>
      <h2 className='title'>My post</h2>
      <button onClick={() => setToggle(!toggle)}>Toggle</button>
      {toggle && <PostList />}
    </>
  )
}

export default App
