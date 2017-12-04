import React, { Component } from 'react'
import Responsive from 'react-responsive'

const Mobile = props => <Responsive {...props} minWidth={768} />

export default Mobile
