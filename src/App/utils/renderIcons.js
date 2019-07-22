import React from 'react'

export default function(name, style) {
    const fill = style === 'dark' ? '#ffffff' : '#000000';
    switch(name) {
    case 'Start':
      return (
        <svg x="0px" y="0px" width="16px" height="14.9px" viewBox="0 0 306.773 306.773">
          <path 
          fill={fill} 
          d="M302.93,149.794c5.561-6.116,5.024-15.49-1.199-20.932L164.63,8.898
          c-6.223-5.442-16.2-5.328-22.292,0.257L4.771,135.258c-6.092,5.585-6.391,14.947-0.662,20.902l3.449,3.592
          c5.722,5.955,14.971,6.665,20.645,1.581l10.281-9.207v134.792c0,8.27,6.701,14.965,14.965,14.965h53.624
          c8.264,0,14.965-6.695,14.965-14.965v-94.3h68.398v94.3c-0.119,8.264,5.794,14.959,14.058,14.959h56.828
          c8.264,0,14.965-6.695,14.965-14.965V154.024c0,0,2.84,2.488,6.343,5.567c3.497,3.073,10.842,0.609,16.403-5.513L302.93,149.794z"
		      />
        </svg>
      );
    case 'Settings':
      return (
        <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 54 54"  >
          <path 
          fill={fill} 
          d="M1,9h3v4c0,0.553,0.447,1,1,1h12c0.553,0,1-0.447,1-1V9h35c0.553,0,1-0.447,1-1s-0.447-1-1-1H18V3c0-0.553-0.447-1-1-1H5
		      C4.447,2,4,2.447,4,3v4H1C0.447,7,0,7.447,0,8S0.447,9,1,9z M6,4h10v8H6V4z"/>
          <path 
          fill={fill} 
          d="M53,26H34v-4c0-0.553-0.447-1-1-1H21c-0.553,0-1,0.447-1,1v4H1c-0.553,0-1,0.447-1,1s0.447,1,1,1h19v4c0,0.553,0.447,1,1,1
            h12c0.553,0,1-0.447,1-1v-4h19c0.553,0,1-0.447,1-1S53.553,26,53,26z M32,31H22v-8h10V31z"/>
          <path 
          fill={fill} 
          d="M53,45h-3v-4c0-0.553-0.447-1-1-1H37c-0.553,0-1,0.447-1,1v4H1c-0.553,0-1,0.447-1,1s0.447,1,1,1h35v4c0,0.553,0.447,1,1,1
            h12c0.553,0,1-0.447,1-1v-4h3c0.553,0,1-0.447,1-1S53.553,45,53,45z M48,50H38v-8h10V50z"/>
        </svg>
      );
    case 'Matchs':
      return (
        <svg x="0px" y="0px" width="16px" height="15.6px" viewBox="0 0 512 512">
          <path 
          fill={fill} 
          d="M256,0C114.617,0,0,114.615,0,256s114.617,256,256,256s256-114.615,256-256S397.383,0,256,0z M344.48,269.57l-128,80
          c-2.59,1.617-5.535,2.43-8.48,2.43c-2.668,0-5.34-0.664-7.758-2.008C195.156,347.172,192,341.82,192,336V176
          c0-5.82,3.156-11.172,8.242-13.992c5.086-2.836,11.305-2.664,16.238,0.422l128,80c4.676,2.93,7.52,8.055,7.52,13.57
          S349.156,266.641,344.48,269.57z"/>
        </svg>
      );
    case 'Back':
      return (
        <svg x="0px" y="0px" width="16px" height="15.6px" viewBox="0 0 129 129">
            <g>
              <path 
              fill={fill}
              d="m88.6,121.3c0.8,0.8 1.8,1.2 2.9,1.2s2.1-0.4 2.9-1.2c1.6-1.6 1.6-4.2 0-5.8l-51-51 51-51c1.6-1.6 1.6-4.2 0-5.8s-4.2-1.6-5.8,0l-54,53.9c-1.6,1.6-1.6,4.2 0,5.8l54,53.9z"/>
       </g>
        </svg>
      );
    case 'Play':
      return (
        <svg x="0px" y="0px" width="16px" height="15.6px" viewBox="0 0 41.999 41.999">

          <path 
          fill={fill}
          d="M36.068,20.176l-29-20C6.761-0.035,6.363-0.057,6.035,0.114C5.706,0.287,5.5,0.627,5.5,0.999v40
            c0,0.372,0.206,0.713,0.535,0.886c0.146,0.076,0.306,0.114,0.465,0.114c0.199,0,0.397-0.06,0.568-0.177l29-20
            c0.271-0.187,0.432-0.494,0.432-0.823S36.338,20.363,36.068,20.176z"/>

        </svg>
      );
    case 'Download':
      return (
        <svg x="0px" y="0px" width="16px" height="15.6px" viewBox="0 0 433.5 433.5">

          <path 
          fill={fill}
          d="M395.25,153h-102V0h-153v153h-102l178.5,178.5L395.25,153z M38.25,382.5v51h357v-51H38.25z"/>

        </svg>
      );
    case 'Search':
      return (
        <svg x="0px" y="0px" width="16px" height="15.6px" viewBox="0 0 56.966 56.966">

          <path 
          fill={fill}
          d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23
            s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92
            c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17
            s-17-7.626-17-17S14.61,6,23.984,6z"/>

        </svg>
      );
    case 'Music':
      return (
        <svg x="0px" y="0px" width="17px" height="17px" viewBox="0 0 512 512">

<g>
	<g>
    <path 
    fill={fill}
    d="M332.978,110.056l-133.567,26.713c-15.554,3.111-26.844,16.882-26.844,32.744c0,3.823,0,133.145,0,139.447
			c-5.226-1.853-10.843-2.872-16.696-2.872c-27.618,0-50.088,22.469-50.088,50.088s22.469,50.087,50.088,50.087
			s49.976-22.469,49.976-50.087V236.296l133.678-26.713v65.985c-5.226-1.853-10.843-2.872-16.696-2.872
			c-27.618,0-50.087,22.469-50.087,50.088c0,27.618,22.469,50.087,50.087,50.087c27.618,0,49.976-22.469,49.976-50.087
			c0-1.449,0-175.296,0-179.984C372.806,121.709,353.624,105.93,332.978,110.056z M155.872,372.871
			c-9.206,0-16.696-7.49-16.696-16.696c0-9.206,7.49-16.696,16.696-16.696c9.206,0,16.696,7.49,16.696,16.696
			C172.568,365.382,165.078,372.871,155.872,372.871z M322.83,339.48c-9.206,0-16.696-7.49-16.696-16.696s7.49-16.696,16.696-16.696
			c9.206,0,16.696,7.49,16.696,16.696S332.036,339.48,322.83,339.48z M339.527,175.53l-133.678,26.713v-32.731l133.678-26.713
			V175.53z"/>
	</g>
</g>
<g>
	<g>
    <path 
    fill={fill}
    d="M453.023,92.472C404.186,33.704,332.391,0,256.05,0C127.521,0,25.163,92.142,4.21,209.43
			c-10.169,56.914-1.743,113.413,24.356,163.824L0.641,491.323c-2.857,12.074,8.034,22.95,20.091,20.09l118.071-27.933
			C174.985,502.157,215.363,512,256.01,512c0.01,0,0.023,0,0.035,0c126.875,0,229.778-90.628,251.444-206.992
			C521.694,228.681,501.842,151.214,453.023,92.472z M474.661,298.898c-18.782,100.871-108.006,179.711-218.619,179.711
			c-0.011,0-0.019,0-0.03,0c-37.211,0-74.174-9.495-106.89-27.461c-3.594-1.973-7.831-2.572-11.88-1.612l-97.883,23.157
			l23.153-97.889c0.952-4.025,0.376-8.26-1.616-11.885c-24.78-45.081-33.015-96.126-23.815-147.616
			C55.08,114.551,142.916,33.392,256.05,33.392c66.385,0,128.818,29.312,171.293,80.422
			C469.797,164.898,487.044,232.36,474.661,298.898z"/>
	</g>
</g>

        </svg>
      );
    case 'Pause':
      return (
        <svg x="0px" y="0px" width="17px" height="17px" viewBox="0 0 357 357">

        <g>
          <path 
          fill={fill}
          d="M25.5,357h102V0h-102V357z M229.5,0v357h102V0H229.5z"/>
        </g>

        </svg>
      );
    case 'Checked':
      return (
        <svg x="0px" y="0px" width="17px" height="17px" viewBox="0 0 26 26">
          <path 
          fill={fill}
          d="m.3,14c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1v-8.88178e-16c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.4 0.4,1 0,1.4l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.5-0.1-0.7-0.3l-7.8-8.4-.2-.3z"/>
        </svg>
      );
    }
  }