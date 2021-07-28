import styled from 'styled-components'
import React, { useState } from "react"
import { withRouter } from "react-router-dom";
import ReactCardFlip from 'react-card-flip';
import "./scroll.css"
import spade from './spade.png'
import gameicon from './cube.png'
import { useSpring, a } from '@react-spring/web'
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NavigationIcon from '@material-ui/icons/Navigation';
import { makeStyles } from '@material-ui/core/styles';
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Center } from "@react-three/drei";

const H1 = styled.h1`
  text-align: center;
  margin: 0;
  padding-bottom: 5rem;
`

const Relative = styled.div`
  position: relative;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
`

const HorizontalCenter = styled(Flex)`
  justify-content: center;
  align-items:center;
  margin-left: auto;
  margin-right: auto;
  max-width: 64rem;
`


// const Item = styled.div`
//   color: white;
//   font-size: 2rem;
//   //text-transform: capitalize;

//   width: ${({size}) => `${20}rem`};
//   height: ${({size}) => `${30}rem`};

//   display: flex;

// //   align-items: center;
// //   justify-content: center;
// `

function getPrevElement(list) {
  const sibling = list[0].previousElementSibling
  
  if (sibling instanceof HTMLElement) {
    return sibling
  }

  return sibling
}

function getNextElement(list) {
  const sibling = list[list.length - 1].nextElementSibling

  if (sibling instanceof HTMLElement) {
    return sibling
  }

  return null
}

function usePosition(ref) {
  const [prevElement, setPrevElement] = React.useState(null)
  const [nextElement, setNextElement] = React.useState(null)

  React.useEffect(() => {
    const element = ref.current

    const update = () => {
      const rect = element.getBoundingClientRect()
     
      const visibleElements = Array.from(element.children).filter((child) => {
        const childRect = child.getBoundingClientRect()
        

        return childRect.left >= rect.left && childRect.right <= rect.right
      })

      if (visibleElements.length > 0) {
        setPrevElement(getPrevElement(visibleElements))
        setNextElement(getNextElement(visibleElements))
      }
    }

    update()

    element.addEventListener('scroll', update, {passive: true})

    return () => {
      element.removeEventListener('scroll', update, {passive: true})
    }
  }, [ref])

  const scrollToElement = React.useCallback(
    (element) => {
      const currentNode = ref.current

      if (!currentNode || !element) return

      let newScrollPosition

      newScrollPosition =
        element.offsetLeft +
        element.getBoundingClientRect().width / 2 -
        currentNode.getBoundingClientRect().width / 2

      currentNode.scroll({
        left: newScrollPosition,
        behavior: 'smooth',
      })
    },
    [ref],
  )

  const scrollRight = React.useCallback(() => scrollToElement(nextElement), [
    scrollToElement,
    nextElement,
  ])

  const scrollLeft = React.useCallback(() => scrollToElement(prevElement), [
    scrollToElement,
    prevElement,
  ])

  return {
    hasItemsOnLeft: prevElement !== null,
    hasItemsOnRight: nextElement !== null,
    scrollRight,
    scrollLeft,
  }
}

const CarouserContainer = styled(Relative)`
  overflow: hidden;
`

 const CarouselItem = styled.div`
  flex: 0 0 auto;

  margin-left: 1.5rem;
`

 const CarouselButton = styled.button`
  position: absolute;
  
  cursor: pointer;

  top: 50%;
  z-index: 1;

  transition: transform 0.1s ease-in-out;

  background: black;
  border-radius: 30px;
  border: none;
  padding: 0.5rem;
`
 const LeftCarouselButton = styled(CarouselButton)`
  left: 0;
  transform: translate(-100%, -50%);

  ${CarouserContainer}:hover & {
    transform: translate(0%, -50%);
  }

  visibility: ${({hasItemsOnLeft}) => (hasItemsOnLeft ? `all` : `hidden`)};
`

 const RightCarouselButton = styled(CarouselButton)`
  right: 0;
  transform: translate(100%, -50%);

  ${CarouserContainer}:hover & {
    transform: translate(0%, -50%);
  }

  visibility: ${({hasItemsOnRight}) => (hasItemsOnRight ? `all` : `hidden`)};
`

 const CarouserContainerInner = styled(Flex)`
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;

  // offset for children spacing
  margin-left: -1rem;
  margin-top: 40px;

  &::-webkit-scrollbar {
    display: none;
  }

  ${CarouselItem} & {
    scroll-snap-align: center;
  }
`

const ArrowLeft = ({size = 40, color = '#fff'}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H6M12 5l-7 7 7 7" />
  </svg>
)


const ArrowRight = ({size = 40, color = '#fff'}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h13M12 5l7 7-7 7" />
  </svg>
)


function Carousel({children}) {
  const ref = React.useRef()

  const {
    hasItemsOnLeft,
    hasItemsOnRight,
    scrollRight,
    scrollLeft,
  } = usePosition(ref)

  return (
    <CarouserContainer>
      <CarouserContainerInner ref={ref}>
        {React.Children.map(children, (child, index) => (
          <CarouselItem key={index}>{child}</CarouselItem>
        ))}
      </CarouserContainerInner>
      <LeftCarouselButton hasItemsOnLeft={hasItemsOnLeft} onClick={scrollLeft}>
        <ArrowLeft />
      </LeftCarouselButton>
      <RightCarouselButton
        hasItemsOnRight={hasItemsOnRight}
        onClick={scrollRight}
      >
        <ArrowRight />
      </RightCarouselButton>
    </CarouserContainer>
  )
}

const colors = [
  { name: "Tobby", people: 6, id: 'A'},
  { name: "Hello", people: 6, id: 1},
  { name: "Tobby", people: 6, id: 2},
  { name: "Tobby", people: 6, id: 3},
  { name: "Tobby", people: 6, id: 4},
  { name: "Tobby", people: 6, id: 4},
  { name: "Tobby", people: 6, id: 4},
  { name: "Tobby", people: 6, id: 4},
  { name: "Tobby", people: 6, id: 11},
]

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: "300px",
    height: "50px",
    color: "white",
    backgroundColor: "indigo",
    fontSize: "20px",
    fontFamily: "futura"
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

function Scroll() {
  const classes = useStyles();
  const [flipped, set] = useState(false)
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })
  const colorsArray = colors.map((color) => (
    <div class="outer" 
      onClick={() => set(state => !state)}>
    <a.div class="front"
      style={{ opacity: opacity.to(o => 1 - o), transform, borderRadius: '20px'}}
    >
       <span class="inner" > {color.id} </span>
       <span class="spade">
       <img src={ spade } width='32' height='32' />
       </span>
       <span class="username" > {color.name} </span>
       
       <span class="gameicon">
       <img src={ gameicon } width='52' height='52' />
       </span>
  
       <span class="people" > {color.people} / 6 </span>
       <span class="spade2">
       <img src={ spade } width='32' height='32' />
       </span>
       <span class="end"> {color.id} </span>
    </a.div>
    <a.div
        class="back"
        style={{
          opacity,
          transform,
          borderRadius: '20px',
          rotateY: '180deg',
        }}
      />
    </div>
  ))
  return (
    <Canvas className="Container">
        
        <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />
      <Html as='div' fullscreen="true" >
      
      <h1 className="title"> MINUS AUCTION </h1>
      <HorizontalCenter>
        <Carousel>{colorsArray}</Carousel>
      </HorizontalCenter>
      <div className="plus">
      <Fab variant="extended" aria-label="add" className={classes.margin} >
        <AddIcon className={classes.extendedIcon}/>
        New room
      </Fab>
      </div>

    </Html>

    </Canvas>
  )
}

export default withRouter(Scroll)