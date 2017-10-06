import React from 'react'
import SvgIcon from './SvgIcon'
import './style.scss'

export const Spinner = props => (
  <SvgIcon {...props}>
    <path
      opacity="0.2"
      d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
    />
    <path
      d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
      C22.32,8.481,24.301,9.057,26.013,10.047z"
    >
      <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite" />
    </path>
  </SvgIcon>
)

export const QuarterSpinner = props => (
  <SvgIcon {...props}>
    <path d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
      <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
    </path>
  </SvgIcon>
)

export const HalfSpinner = props => (
  <SvgIcon {...props}>
    <path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
      <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
    </path>
  </SvgIcon>
)

export const TopBar = props => (
  <SvgIcon {...props}>
    <rect x="0" y="0" width="4" height="7">
      <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0s" dur="0.6s" repeatCount="indefinite" />
    </rect>

    <rect x="10" y="0" width="4" height="7">
      <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.2s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="20" y="0" width="4" height="7">
      <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.4s" dur="0.6s" repeatCount="indefinite" />
    </rect>
  </SvgIcon>
)

export const ZigzagBar = props => (
  <SvgIcon {...props}>
    <rect x="0" y="0" width="4" height="10">
      <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="10" y="0" width="4" height="10">
      <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="20" y="0" width="4" height="10">
      <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite" />
    </rect>
  </SvgIcon>
)

export const AmplifierBar = props => (
  <SvgIcon {...props} >
    <rect x="0" y="13" width="4" height="5">
      <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="10" y="13" width="4" height="5">
      <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="20" y="13" width="4" height="5">
      <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
    </rect>
  </SvgIcon>
)

export const Bar = props => (
  <SvgIcon {...props}>
    <rect x="0" y="0" width="4" height="20">
      <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="7" y="0" width="4" height="20">
      <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.2s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="14" y="0" width="4" height="20">
      <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.4s" dur="0.6s" repeatCount="indefinite" />
    </rect>
  </SvgIcon>
)

export const AmplifyTransparentBar = props => (
  <SvgIcon {...props}>
    <rect x="0" y="10" width="4" height="10" opacity="0.2">
      <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="8" y="10" width="4" height="10" opacity="0.2">
      <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="16" y="10" width="4" height="10" opacity="0.2">
      <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
    </rect>
  </SvgIcon>
)
