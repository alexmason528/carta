import React from 'react'
import { browserHistory } from 'react-router'
import './style.scss'

const Logo = () => (
  <div className="logo">
    <img className="logo__img" onClick={() => { browserHistory.push('/') }} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/logo-100.png" role="presentation" />
  </div>
)

export default Logo
