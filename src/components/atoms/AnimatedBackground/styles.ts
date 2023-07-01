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
  overflow: hidden;
  top: 0;
  left: 0;
  opacity: 0.6;

  &.background span {
    width: 1vmin;
    height: 1vmin;
    border-radius: 1vmin;
    backface-visibility: hidden;
    position: absolute;
    animation: ${move};
    animation-duration: 35;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  &.background span:nth-child(0) {
    color: #ffacac;
    top: 84%;
    left: 50%;
    animation-duration: 149s;
    animation-delay: -78s;
    transform-origin: 23vw -12vh;
    box-shadow: -2vmin 0 0.8036115020273648vmin currentColor;
  }
  &.background span:nth-child(1) {
    color: #583c87;
    top: 11%;
    left: 9%;
    animation-duration: 90s;
    animation-delay: -149s;
    transform-origin: 16vw -19vh;
    box-shadow: 2vmin 0 1.034912069208279vmin currentColor;
  }
  &.background span:nth-child(2) {
    color: #e45a84;
    top: 12%;
    left: 48%;
    animation-duration: 42s;
    animation-delay: -115s;
    transform-origin: 14vw 10vh;
    box-shadow: -2vmin 0 0.7421303053501388vmin currentColor;
  }
  &.background span:nth-child(3) {
    color: #583c87;
    top: 17%;
    left: 94%;
    animation-duration: 9s;
    animation-delay: -147s;
    transform-origin: 1vw -2vh;
    box-shadow: -2vmin 0 1.0018530729396806vmin currentColor;
  }
  &.background span:nth-child(4) {
    color: #583c87;
    top: 28%;
    left: 19%;
    animation-duration: 112s;
    animation-delay: -109s;
    transform-origin: 23vw 11vh;
    box-shadow: -2vmin 0 0.6378299601276297vmin currentColor;
  }
  &.background span:nth-child(5) {
    color: #e45a84;
    top: 99%;
    left: 42%;
    animation-duration: 33s;
    animation-delay: -96s;
    transform-origin: -9vw -21vh;
    box-shadow: 2vmin 0 0.9354842052556368vmin currentColor;
  }
  &.background span:nth-child(6) {
    color: #ffacac;
    top: 20%;
    left: 23%;
    animation-duration: 55s;
    animation-delay: -10s;
    transform-origin: 17vw -9vh;
    box-shadow: -2vmin 0 1.2196372339319637vmin currentColor;
  }
  &.background span:nth-child(7) {
    color: #583c87;
    top: 24%;
    left: 20%;
    animation-duration: 79s;
    animation-delay: -59s;
    transform-origin: 22vw 13vh;
    box-shadow: 2vmin 0 1.2476520754085825vmin currentColor;
  }
  &.background span:nth-child(8) {
    color: #583c87;
    top: 65%;
    left: 23%;
    animation-duration: 59s;
    animation-delay: -53s;
    transform-origin: -10vw 4vh;
    box-shadow: 2vmin 0 0.754463746532482vmin currentColor;
  }
  &.background span:nth-child(9) {
    color: #e45a84;
    top: 53%;
    left: 33%;
    animation-duration: 38s;
    animation-delay: -73s;
    transform-origin: -18vw 6vh;
    box-shadow: -2vmin 0 0.5490909304349971vmin currentColor;
  }
  &.background span:nth-child(10) {
    color: #583c87;
    top: 78%;
    left: 45%;
    animation-duration: 88s;
    animation-delay: -22s;
    transform-origin: -21vw -19vh;
    box-shadow: 2vmin 0 1.1896443519617947vmin currentColor;
  }
  &.background span:nth-child(11) {
    color: #ffacac;
    top: 77%;
    left: 5%;
    animation-duration: 56s;
    animation-delay: -112s;
    transform-origin: -15vw 2vh;
    box-shadow: 2vmin 0 1.028156543295934vmin currentColor;
  }
  &.background span:nth-child(12) {
    color: #e45a84;
    top: 99%;
    left: 67%;
    animation-duration: 138s;
    animation-delay: -58s;
    transform-origin: 22vw -16vh;
    box-shadow: -2vmin 0 0.719791983527827vmin currentColor;
  }
  &.background span:nth-child(13) {
    color: #ffacac;
    top: 64%;
    left: 23%;
    animation-duration: 42s;
    animation-delay: -7s;
    transform-origin: -24vw 9vh;
    box-shadow: 2vmin 0 0.8753895471058052vmin currentColor;
  }
  &.background span:nth-child(14) {
    color: #ffacac;
    top: 69%;
    left: 33%;
    animation-duration: 119s;
    animation-delay: -149s;
    transform-origin: 16vw -5vh;
    box-shadow: -2vmin 0 0.4771936055031374vmin currentColor;
  }
  &.background span:nth-child(15) {
    color: #ffacac;
    top: 93%;
    left: 79%;
    animation-duration: 11s;
    animation-delay: -50s;
    transform-origin: 6vw -9vh;
    box-shadow: -2vmin 0 0.984208089867163vmin currentColor;
  }
  &.background span:nth-child(16) {
    color: #ffacac;
    top: 99%;
    left: 98%;
    animation-duration: 86s;
    animation-delay: -150s;
    transform-origin: -20vw 11vh;
    box-shadow: -2vmin 0 1.0948788556293398vmin currentColor;
  }
  &.background span:nth-child(17) {
    color: #ffacac;
    top: 52%;
    left: 21%;
    animation-duration: 65s;
    animation-delay: -125s;
    transform-origin: 13vw -21vh;
    box-shadow: -2vmin 0 0.3866209977234659vmin currentColor;
  }
  &.background span:nth-child(18) {
    color: #ffacac;
    top: 56%;
    left: 3%;
    animation-duration: 126s;
    animation-delay: -70s;
    transform-origin: -1vw 19vh;
    box-shadow: 2vmin 0 0.8057152115553529vmin currentColor;
  }
  &.background span:nth-child(19) {
    color: #583c87;
    top: 70%;
    left: 39%;
    animation-duration: 26s;
    animation-delay: -145s;
    transform-origin: 2vw -9vh;
    box-shadow: 2vmin 0 0.30901816897843115vmin currentColor;
  }
  &.background span:nth-child(20) {
    color: #ffacac;
    top: 28%;
    left: 9%;
    animation-duration: 47s;
    animation-delay: -103s;
    transform-origin: -10vw -22vh;
    box-shadow: 2vmin 0 0.9873303327172859vmin currentColor;
  }
  &.background span:nth-child(21) {
    color: #ffacac;
    top: 29%;
    left: 83%;
    animation-duration: 65s;
    animation-delay: -135s;
    transform-origin: -4vw -17vh;
    box-shadow: 2vmin 0 0.6819295747166886vmin currentColor;
  }
  &.background span:nth-child(22) {
    color: #e45a84;
    top: 35%;
    left: 49%;
    animation-duration: 148s;
    animation-delay: -9s;
    transform-origin: 4vw -12vh;
    box-shadow: -2vmin 0 0.5352842535407607vmin currentColor;
  }
  &.background span:nth-child(23) {
    color: #ffacac;
    top: 91%;
    left: 14%;
    animation-duration: 121s;
    animation-delay: -112s;
    transform-origin: -14vw 15vh;
    box-shadow: 2vmin 0 0.4709271864623368vmin currentColor;
  }
  &.background span:nth-child(24) {
    color: #583c87;
    top: 41%;
    left: 93%;
    animation-duration: 144s;
    animation-delay: -125s;
    transform-origin: 25vw 13vh;
    box-shadow: -2vmin 0 0.4582619538781336vmin currentColor;
  }
  &.background span:nth-child(25) {
    color: #e45a84;
    top: 87%;
    left: 40%;
    animation-duration: 57s;
    animation-delay: -61s;
    transform-origin: -14vw 4vh;
    box-shadow: 2vmin 0 0.9063876032274439vmin currentColor;
  }
  &.background span:nth-child(26) {
    color: #e45a84;
    top: 26%;
    left: 12%;
    animation-duration: 27s;
    animation-delay: -100s;
    transform-origin: 4vw 22vh;
    box-shadow: -2vmin 0 0.8450931076195467vmin currentColor;
  }
  &.background span:nth-child(27) {
    color: #ffacac;
    top: 83%;
    left: 11%;
    animation-duration: 59s;
    animation-delay: -5s;
    transform-origin: 13vw -2vh;
    box-shadow: -2vmin 0 0.3793316775438622vmin currentColor;
  }
  &.background span:nth-child(28) {
    color: #e45a84;
    top: 20%;
    left: 84%;
    animation-duration: 34s;
    animation-delay: -115s;
    transform-origin: 17vw -14vh;
    box-shadow: -2vmin 0 0.7629706432605805vmin currentColor;
  }
  &.background span:nth-child(29) {
    color: #e45a84;
    top: 81%;
    left: 32%;
    animation-duration: 85s;
    animation-delay: -143s;
    transform-origin: -15vw 12vh;
    box-shadow: -2vmin 0 0.6685578684303615vmin currentColor;
  }
  &.background span:nth-child(30) {
    color: #e45a84;
    top: 61%;
    left: 92%;
    animation-duration: 124s;
    animation-delay: -99s;
    transform-origin: 20vw -15vh;
    box-shadow: -2vmin 0 0.34693339602264983vmin currentColor;
  }
  &.background span:nth-child(31) {
    color: #ffacac;
    top: 38%;
    left: 60%;
    animation-duration: 149s;
    animation-delay: -131s;
    transform-origin: -15vw -22vh;
    box-shadow: 2vmin 0 0.9586178567245692vmin currentColor;
  }
  &.background span:nth-child(32) {
    color: #583c87;
    top: 60%;
    left: 66%;
    animation-duration: 78s;
    animation-delay: -145s;
    transform-origin: -2vw -8vh;
    box-shadow: -2vmin 0 0.4189305287311488vmin currentColor;
  }
  &.background span:nth-child(33) {
    color: #ffacac;
    top: 97%;
    left: 8%;
    animation-duration: 47s;
    animation-delay: -21s;
    transform-origin: 23vw -21vh;
    box-shadow: 2vmin 0 0.5068761536491992vmin currentColor;
  }
  &.background span:nth-child(34) {
    color: #ffacac;
    top: 29%;
    left: 59%;
    animation-duration: 97s;
    animation-delay: -118s;
    transform-origin: 25vw -21vh;
    box-shadow: -2vmin 0 0.8254409807968809vmin currentColor;
  }
  &.background span:nth-child(35) {
    color: #ffacac;
    top: 75%;
    left: 44%;
    animation-duration: 27s;
    animation-delay: -120s;
    transform-origin: 23vw 6vh;
    box-shadow: -2vmin 0 1.2035861338363096vmin currentColor;
  }
  &.background span:nth-child(36) {
    color: #e45a84;
    top: 9%;
    left: 62%;
    animation-duration: 35s;
    animation-delay: -25s;
    transform-origin: 17vw -1vh;
    box-shadow: 2vmin 0 1.0225807808337268vmin currentColor;
  }
  &.background span:nth-child(37) {
    color: #583c87;
    top: 95%;
    left: 57%;
    animation-duration: 41s;
    animation-delay: -1s;
    transform-origin: -12vw -16vh;
    box-shadow: 2vmin 0 0.6490703003451149vmin currentColor;
  }
  &.background span:nth-child(38) {
    color: #e45a84;
    top: 31%;
    left: 73%;
    animation-duration: 67s;
    animation-delay: -39s;
    transform-origin: 12vw 20vh;
    box-shadow: -2vmin 0 0.5043256855249045vmin currentColor;
  }
  &.background span:nth-child(39) {
    color: #e45a84;
    top: 6%;
    left: 16%;
    animation-duration: 144s;
    animation-delay: -40s;
    transform-origin: 2vw -18vh;
    box-shadow: 2vmin 0 1.0958675325352163vmin currentColor;
  }
  &.background span:nth-child(40) {
    color: #ffacac;
    top: 76%;
    left: 38%;
    animation-duration: 79s;
    animation-delay: -47s;
    transform-origin: -24vw -1vh;
    box-shadow: -2vmin 0 0.7872232053297118vmin currentColor;
  }
  &.background span:nth-child(41) {
    color: #ffacac;
    top: 66%;
    left: 93%;
    animation-duration: 52s;
    animation-delay: -54s;
    transform-origin: -1vw -15vh;
    box-shadow: -2vmin 0 1.0405016698099292vmin currentColor;
  }
  &.background span:nth-child(42) {
    color: #ffacac;
    top: 8%;
    left: 9%;
    animation-duration: 155s;
    animation-delay: -34s;
    transform-origin: 16vw 21vh;
    box-shadow: -2vmin 0 0.3621542710744715vmin currentColor;
  }
  &.background span:nth-child(43) {
    color: #e45a84;
    top: 62%;
    left: 33%;
    animation-duration: 76s;
    animation-delay: -75s;
    transform-origin: -21vw 25vh;
    box-shadow: -2vmin 0 0.8313977014395677vmin currentColor;
  }
  &.background span:nth-child(44) {
    color: #ffacac;
    top: 50%;
    left: 73%;
    animation-duration: 75s;
    animation-delay: -40s;
    transform-origin: -9vw -2vh;
    box-shadow: 2vmin 0 0.6704356584516005vmin currentColor;
  }
  &.background span:nth-child(45) {
    color: #e45a84;
    top: 74%;
    left: 60%;
    animation-duration: 16s;
    animation-delay: -32s;
    transform-origin: 10vw -17vh;
    box-shadow: 2vmin 0 0.6942316967248071vmin currentColor;
  }
  &.background span:nth-child(46) {
    color: #ffacac;
    top: 65%;
    left: 78%;
    animation-duration: 15s;
    animation-delay: -102s;
    transform-origin: -20vw 11vh;
    box-shadow: 2vmin 0 1.1440320007658693vmin currentColor;
  }
  &.background span:nth-child(47) {
    color: #ffacac;
    top: 99%;
    left: 1%;
    animation-duration: 120s;
    animation-delay: -105s;
    transform-origin: -7vw 7vh;
    box-shadow: 2vmin 0 1.2049970256800258vmin currentColor;
  }
  &.background span:nth-child(48) {
    color: #583c87;
    top: 43%;
    left: 22%;
    animation-duration: 85s;
    animation-delay: -48s;
    transform-origin: 21vw -13vh;
    box-shadow: -2vmin 0 1.2007509520732214vmin currentColor;
  }
  &.background span:nth-child(49) {
    color: #583c87;
    top: 66%;
    left: 25%;
    animation-duration: 108s;
    animation-delay: -6s;
    transform-origin: 23vw -4vh;
    box-shadow: 2vmin 0 0.7290382936723339vmin currentColor;
  }
`;
