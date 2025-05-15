import React from "react";

type PaymentInfo = {
  name: string,
  card_number: string,
  expiration_date: string,
  security_code: string
};

interface IProps {
  paymentInfo: PaymentInfo
};

const BackSvg = (props: IProps) => {
  const { paymentInfo } = props;
  return (
    <svg version="1.1" id="cardback" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 750 471" xmlSpace="preserve">
      <g id="Front">
        <line className="st0" x1="35.3" y1="10.4" x2="36.7" y2="11" />
      </g>
      <g id="Back">
        <g id="Page-1_2_">
          <g id="amex_2_">
            <path id="Rectangle-1_2_" className="darkcolor cyandark" d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                    C0,17.9,17.9,0,40,0z" />
          </g>
        </g>
        <rect y="61.6" className="st2" width="750" height="78" />
        <g>
          <path className="st3" d="M701.1,249.1H48.9c-3.3,0-6-2.7-6-6v-52.5c0-3.3,2.7-6,6-6h652.1c3.3,0,6,2.7,6,6v52.5
                C707.1,246.4,704.4,249.1,701.1,249.1z" />
          <rect x="42.9" y="198.6" className="st4" width="664.1" height="10.5" />
          <rect x="42.9" y="224.5" className="st4" width="664.1" height="10.5" />
          <path className="st5" d="M701.1,184.6H618h-8h-10v64.5h10h8h83.1c3.3,0,6-2.7,6-6v-52.5C707.1,187.3,704.4,184.6,701.1,184.6z" />
        </g>
        <text transform="matrix(1 0 0 1 621.999 227.2734)" id="svgsecurity" className="st6 st7">{paymentInfo.security_code}</text>
        <g className="st8">
          <text transform="matrix(1 0 0 1 518.083 280.0879)" className="st9 st6 st10">security code</text>
        </g>
        <rect x="58.1" y="378.6" className="st11" width="375.5" height="13.5" />
        <rect x="58.1" y="405.6" className="st11" width="421.7" height="13.5" />
        <text transform="matrix(1 0 0 1 59.5073 228.6099)" id="svgnameback" className="st12 st13">{paymentInfo.name}</text>
      </g>
    </svg>
  )
};

export default BackSvg;
