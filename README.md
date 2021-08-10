# Mad-Game-Center
두 가지 게임을 즐길 수 있는 웹을 구현했다.

> 개발자: 김찬영, 김태우, 최종윤
>
> Skill : React.js, three.js / Node.js, MongoDB, socket.io

---

## 기능 소개

### Login

<img src="./source/login.gif" height="250">

+ 로그인과 회원가입을 할 수 있다.



### Main

<img src="./source/main.gif" height="250"> <img src="./source/logout.gif" height="250">

+ 탁구와 마이너스 경매 두 개의 게임 중 하나를 선택할 수 있다.
+ 글자를 클릭하면 해당 게임 페이지로 넘어간다.
+ 우측 하단의 플로팅 버튼으로 로그아웃이 가능하다.



### Game 1 : Ping-Pong

<img src="./source/pingpong1.gif" height="250"> <img src="./source/pingpong2.gif" height="250">

+ 혼자 즐길 수 있는 탁구 게임을 구현했다.
+ 우측 하단의 플로팅 버튼에서 메인 화면으로 돌아갈 수 있다.



### Game 2 : Minus Auction

#### Lobby

<img src="./source/lobby1.gif" height="250"> <img src="./source/lobby2.gif" height="250">

+ 메인 화면에서 Minus Auction을 클릭하면 로비 화면이 뜨게 된다.
+ 현재 개설되어있는 게임 방을 확인할 수 있다.
+ 카드 중앙 위에는 호스트 이름, 중앙 아래에는 현재 방 인원이 표시된다.
+ 방이 여러 개일 경우는 좌우의 화살표 버튼을 이용해 넘겨서 볼 수 있다.
+ 우측 하단의 플로팅 버튼으로 새로고침, 로그아웃, 메인으로 돌아가기를 할 수 있다.
+ New Room 버튼을 누르면 방을 생성할 수 있다.

#### Game Playing

<img src="./source/start_alone.gif" height="250"> <img src="./source/game_start.gif" height="250">

+ 혼자일 경우 게임을 시작할 수 없다.
+ 두 명 이상 접속했을 때 방장이 Press to Start 버튼을 누르면 게임이 시작된다.

> 게임 설명
>  
> 1. -3부터 -35까지의 경매 상품이 있으며, 한 개의 히든 상품은 끝까지 경매에 오르지 않는다.
> 
> 2. 자기 차례에 입찰 상품을 클릭하면 낙찰할 수 있다.
> 
> 3. 상품을 낙찰하고 싶지 않다면 칩을 지불하고 턴을 넘길 수 있다.
> 
> 4. 마지막에 가지고 있는 칩 수와 상품들의 총 합이 자신의 점수가 되며, 점수의 절댓값이 가장 작은 사람이 승리한다. 
> (단, 연속된 숫자를 보유하고 있는 경우엔 절댓값이 낮은 숫자만 점수에 포함된다.)

<img src="./source/turn.gif" height="250"> <img src="./source/chip.gif" height="250">

+ 자신의 이름은 노란색으로 표시된다.
+ 흔들리는 우주선으로 현재 턴을 확인할 수 있다.
+ 우주선의 빨간 창문을 클릭하면 칩을 지불하고 턴을 넘길 수 있다.
+ 달 위의 숫자를 클릭하면 상품을 낙찰할 수 있다. 
+ 달 옆의 작은 원에는 쌓인 칩이 표시되고, 낙찰 받을 경우 쌓인 칩을 상품과 함께 가져온다.

<img src="./source/chip_zero.gif" height="250"> <img src="./source/game_finish.gif" height="250">

+ 가지고 있는 칩이 0개라면 턴을 넘길 수 없어 강제로 낙찰을 해야만 한다.
+ 32개의 상품이 모두 낙찰되었다면 게임이 종료된다.
+ 점수가 가장 높은 사람이 승리하고, 순위가 표시된다.

<img src="./source/exit.gif" height="250"> <img src="./source/lobby_back.gif" height="250">

+ 방장이 방을 나갔을 경우, 두 번째에 있던 사람이 방장이 되는 것을 확인할 수 있다.
+ 로비에서 메인 화면으로 나갈 수 있다.

---

## Implementation



### DB

### Game Playing

