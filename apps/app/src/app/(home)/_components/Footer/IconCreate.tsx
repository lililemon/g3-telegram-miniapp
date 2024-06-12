import { type SVGProps } from "react";
const SvgComponent = ({
  isActive,
  ...props
}: SVGProps<SVGSVGElement> & {
  isActive?: boolean;
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.9065 7.24033V9.02699C14.4132 9.30699 12.4265 11.547 12.4265 15.2403V21.3337H7.23984C4.1865 21.3337 2.6665 19.8137 2.6665 16.7603V7.24033C2.6665 4.18699 4.1865 2.66699 7.23984 2.66699H13.3332C16.3865 2.66699 17.9065 4.18699 17.9065 7.24033Z"
      fill={isActive ? "#28335A" : "#959DB2"}
    />
    <path
      d="M24.7599 10.667H18.6666C15.6133 10.667 14.0933 12.187 14.0933 15.2403V24.7603C14.0933 27.8137 15.6133 29.3337 18.6666 29.3337H24.7599C27.8133 29.3337 29.3333 27.8137 29.3333 24.7603V15.2403C29.3333 12.187 27.8133 10.667 24.7599 10.667ZM24.1733 21.0003H22.9999V22.1737C22.9999 22.7203 22.5466 23.1737 21.9999 23.1737C21.4533 23.1737 20.9999 22.7203 20.9999 22.1737V21.0003H19.8266C19.2799 21.0003 18.8266 20.547 18.8266 20.0003C18.8266 19.4537 19.2799 19.0003 19.8266 19.0003H20.9999V17.827C20.9999 17.2803 21.4533 16.827 21.9999 16.827C22.5466 16.827 22.9999 17.2803 22.9999 17.827V19.0003H24.1733C24.7199 19.0003 25.1733 19.4537 25.1733 20.0003C25.1733 20.547 24.7199 21.0003 24.1733 21.0003Z"
      fill={isActive ? "#14DB60" : "#959DB2"}
    />
  </svg>
);
export { SvgComponent as IconCreate };
