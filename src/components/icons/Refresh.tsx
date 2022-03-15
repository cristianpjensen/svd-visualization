interface RefreshIconProps {
  color?: string;
}

export const RefreshIcon = ({ color = "white" }: RefreshIconProps) => (
  <svg
    version="1.1"
    viewBox="0 0 24 24"
    width={32}
    height={32}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <path d="M19.488,4.639v3.536h-3.535h3.535"></path>
      <path d="M19.027,8.175c-1.357,-2.487 -3.995,-4.175 -7.027,-4.175c-4.418,0 -8,3.582 -8,8c0,4.418 3.582,8 8,8c4.418,0 8,-3.582 8,-8"></path>
    </g>
    <path fill="none" d="M0,0h24v24h-24Z"></path>
  </svg>
);
