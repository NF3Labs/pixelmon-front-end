import { useColorModeValue } from "@chakra-ui/react";

export const PolyP2P = ({ width, ...rest }) => (
  <svg
    width={width ? width : "24"}
    height={width ? width : "24"}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="12" fill={useColorModeValue("#ffffff", "#1A1429")} fillOpacity="0.7" />
    <path
      d="M15.6005 9.76501C15.3446 9.6188 15.0157 9.6188 14.7232 9.76501L12.6762 10.9713L11.2872 11.7389L9.27676 12.9452C9.02089 13.0914 8.69191 13.0914 8.39948 12.9452L6.82768 11.9948C6.5718 11.8486 6.38903 11.5561 6.38903 11.2272V9.39948C6.38903 9.10705 6.53525 8.81462 6.82768 8.63185L8.39948 7.71802C8.65535 7.5718 8.98433 7.5718 9.27676 7.71802L10.8486 8.66841C11.1044 8.81462 11.2872 9.10705 11.2872 9.43603V10.6423L12.6762 9.83812V8.5953C12.6762 8.30287 12.53 8.01044 12.2376 7.82768L9.31332 6.10966C9.05744 5.96345 8.72846 5.96345 8.43603 6.10966L5.43864 7.86423C5.14621 8.01044 5 8.30287 5 8.5953V12.0313C5 12.3238 5.14621 12.6162 5.43864 12.799L8.39948 14.517C8.65535 14.6632 8.98433 14.6632 9.27676 14.517L11.2872 13.3473L12.6762 12.5431L14.6867 11.3734C14.9426 11.2272 15.2715 11.2272 15.564 11.3734L17.1358 12.2872C17.3916 12.4334 17.5744 12.7258 17.5744 13.0548V14.8825C17.5744 15.1749 17.4282 15.4674 17.1358 15.6501L15.6005 16.564C15.3446 16.7102 15.0157 16.7102 14.7232 16.564L13.1514 15.6501C12.8956 15.5039 12.7128 15.2115 12.7128 14.8825V13.7128L11.3238 14.517V15.7232C11.3238 16.0157 11.47 16.3081 11.7624 16.4909L14.7232 18.2089C14.9791 18.3551 15.3081 18.3551 15.6005 18.2089L18.5614 16.4909C18.8172 16.3446 19 16.0522 19 15.7232V12.2507C19 11.9582 18.8538 11.6658 18.5614 11.483L15.6005 9.76501Z"
      fill="#8247E5"
    />
  </svg>
);