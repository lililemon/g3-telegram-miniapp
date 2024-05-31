import { type SVGProps } from "react";

const SvgComponent = ({
  isActive,
  ...props
}: SVGProps<SVGSVGElement> & {
  isActive?: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.5865 2.66699H10.4132C5.55984 2.66699 2.6665 5.56033 2.6665 10.4137V21.5737C2.6665 26.4403 5.55984 29.3337 10.4132 29.3337H21.5732C26.4265 29.3337 29.3198 26.4403 29.3198 21.587V10.4137C29.3332 5.56033 26.4398 2.66699 21.5865 2.66699Z"
        fill={isActive ? "#DAF200" : "#959DB2"}
      />
      <path
        d="M9.77332 20.32C9.55999 20.32 9.34665 20.2533 9.15999 20.1067C8.71999 19.7733 8.63999 19.1467 8.97332 18.7067L12.1467 14.5867C12.5333 14.0933 13.08 13.7733 13.7067 13.6933C14.32 13.6133 14.9467 13.7867 15.44 14.1733L17.88 16.0933C17.9733 16.1733 18.0667 16.1733 18.1333 16.16C18.1867 16.16 18.28 16.1333 18.36 16.0267L21.44 12.0533C21.7733 11.6133 22.4133 11.5333 22.84 11.88C23.28 12.2133 23.36 12.84 23.0133 13.28L19.9333 17.2533C19.5467 17.7467 19 18.0667 18.3733 18.1333C17.7467 18.2133 17.1333 18.04 16.64 17.6533L14.2 15.7333C14.1067 15.6533 14 15.6533 13.9467 15.6667C13.8933 15.6667 13.8 15.6933 13.72 15.8L10.5467 19.92C10.3733 20.1867 10.08 20.32 9.77332 20.32Z"
        fill={isActive ? "#28335A" : "white"}
      />
    </svg>
  );
};
export { SvgComponent as IconTrending };