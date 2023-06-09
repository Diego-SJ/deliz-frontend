import styled, { keyframes } from 'styled-components';

const move = keyframes`
  100% {
    transform: translate3d(0, 0, 1px) rotate(360deg);
  }
`;

export const ContainerRoot = styled.div`
  position: fixed;
  height: 100vh;
  width: 10vw;
  min-height: 100vh;
  max-height: 100vh;
  min-width: 100vw;
  max-width: 100vw;
  background-color: ${({ theme }) => theme.colors.primary};
  overflow: hidden;
  top: 0;
  left: 0;

  &.background span {
    width: 20vmin;
    height: 20vmin;
    border-radius: 20vmin;
    backface-visibility: hidden;
    position: absolute;
    animation: ${move};
    animation-duration: 45;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  &.background span:nth-child(0) {
    color: ${({ theme }) => theme.colors.tertiary};
    top: 11%;
    left: 77%;
    animation-duration: 33s;
    animation-delay: -9s;
    transform-origin: -1vw -4vh;
    box-shadow: 40vmin 0 5.08394709879508vmin currentColor;
  }
  &.background span:nth-child(1) {
    color: ${({ theme }) => theme.colors.secondary};
    top: 44%;
    left: 71%;
    animation-duration: 43s;
    animation-delay: -21s;
    transform-origin: -15vw -8vh;
    box-shadow: 40vmin 0 5.252825441822945vmin currentColor;
  }
  &.background span:nth-child(2) {
    color: ${({ theme }) => theme.colors.secondary};
    top: 9%;
    left: 61%;
    animation-duration: 28s;
    animation-delay: -8s;
    transform-origin: -19vw 19vh;
    box-shadow: -40vmin 0 5.9268073242367985vmin currentColor;
  }
  &.background span:nth-child(3) {
    color: ${({ theme }) => theme.colors.background.primary};
    top: 15%;
    left: 1%;
    animation-duration: 26s;
    animation-delay: -17s;
    transform-origin: 4vw 18vh;
    box-shadow: -40vmin 0 5.418010623011752vmin currentColor;
  }
  &.background span:nth-child(4) {
    color: ${({ theme }) => theme.colors.secondary};
    top: 72%;
    left: 86%;
    animation-duration: 13s;
    animation-delay: -13s;
    transform-origin: 7vw -9vh;
    box-shadow: -40vmin 0 5.281155939897943vmin currentColor;
  }
  &.background span:nth-child(5) {
    color: ${({ theme }) => theme.colors.secondary};
    top: 8%;
    left: 46%;
    animation-duration: 15s;
    animation-delay: -1s;
    transform-origin: 23vw 7vh;
    box-shadow: 40vmin 0 5.167148952246993vmin currentColor;
  }
  &.background span:nth-child(6) {
    color: ${({ theme }) => theme.colors.tertiary};
    top: 1%;
    left: 6%;
    animation-duration: 40s;
    animation-delay: -24s;
    transform-origin: 23vw 9vh;
    box-shadow: -40vmin 0 5.38041126395287vmin currentColor;
  }
  &.background span:nth-child(7) {
    color: ${({ theme }) => theme.colors.background.primary};
    top: 63%;
    left: 94%;
    animation-duration: 18s;
    animation-delay: -42s;
    transform-origin: -19vw -20vh;
    box-shadow: 40vmin 0 5.7698363868876426vmin currentColor;
  }
  &.background span:nth-child(8) {
    color: ${({ theme }) => theme.colors.tertiary};
    top: 60%;
    left: 91%;
    animation-duration: 53s;
    animation-delay: -7s;
    transform-origin: 25vw 24vh;
    box-shadow: -40vmin 0 5.118387937894773vmin currentColor;
  }
  &.background span:nth-child(9) {
    color: ${({ theme }) => theme.colors.secondary};
    top: 60%;
    left: 1%;
    animation-duration: 49s;
    animation-delay: -19s;
    transform-origin: 9vw 1vh;
    box-shadow: -40vmin 0 5.787398612795296vmin currentColor;
  }
  &.background span:nth-child(10) {
    color: ${({ theme }) => theme.colors.secondary};
    top: 77%;
    left: 95%;
    animation-duration: 22s;
    animation-delay: -20s;
    transform-origin: 7vw 17vh;
    box-shadow: -40vmin 0 5.538095736876284vmin currentColor;
  }
  &.background span:nth-child(11) {
    color: ${({ theme }) => theme.colors.secondary};
    top: 27%;
    left: 8%;
    animation-duration: 9s;
    animation-delay: -35s;
    transform-origin: 9vw 23vh;
    box-shadow: -40vmin 0 5.484122349880463vmin currentColor;
  }
  &.background span:nth-child(12) {
    color: ${({ theme }) => theme.colors.secondary};
    top: 81%;
    left: 54%;
    animation-duration: 45s;
    animation-delay: -39s;
    transform-origin: 24vw 22vh;
    box-shadow: -40vmin 0 5.135778750787203vmin currentColor;
  }
  &.background span:nth-child(13) {
    color: ${({ theme }) => theme.colors.secondary};
    top: 34%;
    left: 1%;
    animation-duration: 46s;
    animation-delay: -30s;
    transform-origin: -12vw 24vh;
    box-shadow: 40vmin 0 5.668067382842051vmin currentColor;
  }
  &.background span:nth-child(14) {
    color: ${({ theme }) => theme.colors.tertiary};
    top: 55%;
    left: 60%;
    animation-duration: 51s;
    animation-delay: -45s;
    transform-origin: 0vw -22vh;
    box-shadow: -40vmin 0 5.912040313835152vmin currentColor;
  }
  &.background span:nth-child(15) {
    color: ${({ theme }) => theme.colors.secondary};
    top: 43%;
    left: 46%;
    animation-duration: 27s;
    animation-delay: -33s;
    transform-origin: 19vw 25vh;
    box-shadow: -40vmin 0 5.314675170519236vmin currentColor;
  }
  &.background span:nth-child(16) {
    color: ${({ theme }) => theme.colors.background.primary};
    top: 19%;
    left: 31%;
    animation-duration: 51s;
    animation-delay: -2s;
    transform-origin: 15vw 13vh;
    box-shadow: -40vmin 0 5.3560783971455965vmin currentColor;
  }
  &.background span:nth-child(17) {
    color: ${({ theme }) => theme.colors.background.primary};
    top: 42%;
    left: 49%;
    animation-duration: 20s;
    animation-delay: -13s;
    transform-origin: 17vw 1vh;
    box-shadow: 40vmin 0 5.73248631814038vmin currentColor;
  }
  &.background span:nth-child(18) {
    color: ${({ theme }) => theme.colors.tertiary};
    top: 53%;
    left: 97%;
    animation-duration: 49s;
    animation-delay: -42s;
    transform-origin: 15vw -14vh;
    box-shadow: -40vmin 0 5.208219831933269vmin currentColor;
  }
  &.background span:nth-child(19) {
    color: ${({ theme }) => theme.colors.tertiary};
    top: 41%;
    left: 2%;
    animation-duration: 24s;
    animation-delay: -18s;
    transform-origin: 1vw 20vh;
    box-shadow: -40vmin 0 5.23364484694164vmin currentColor;
  }
`;
