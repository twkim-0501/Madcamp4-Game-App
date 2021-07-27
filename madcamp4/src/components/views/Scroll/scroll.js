import styled from 'styled-components'
import React from "react"
import { withRouter } from "react-router-dom";
import "./scroll.css"
import spade from './spade.png'
import gameicon from './cube.png'

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

  max-width: 70rem;
`

const Container = styled.div`
  height: stretch;
  width: 100%;
  background: #000;
  align-content:center;
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

  margin-left: 1rem;
`

 const CarouselButton = styled.button`
  position: absolute;

  cursor: pointer;

  top: 50%;
  z-index: 1;

  transition: transform 0.1s ease-in-out;

  background: white;
  border-radius: 15px;
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

  &::-webkit-scrollbar {
    display: none;
  }

  ${CarouselItem} & {
    scroll-snap-align: center;
  }
`

const ArrowLeft = ({size = 30, color = '#000000'}) => (
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


const ArrowRight = ({size = 30, color = '#000000'}) => (
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
  { name: "Tobby", people: 6, id: 1},
  { name: "Tobby", people: 6, id: 2},
  { name: "Tobby", people: 6, id: 3},
  { name: "Tobby", people: 6, id: 4},

//   { col:'#e74c3c', name: "B", people: 6},
//   { col:'#16a085', name: "H"},
//   { col:'#2980b9', name: "H"},
//   { col:'#8e44ad', name: "H"},
//   { col:'#2c3e50', name: "H"},
//   { col:'#2c3e50', name: "H"},
]

const colorsArray = colors.map((color) => (
  <div class="outer"
    style={{background: 'white', borderRadius: '20px', opacity: 0.9, color: 'black'}}
    key={color.col}
  >
     <span class="inner" > {color.id} </span>
     <span class="spade">
     <img src={ spade } width='32' height='32' />
     </span>
     <span class="username" > {color.name} </span>
     
     <span class="gameicon">
     <img src={ gameicon } width='52' height='52' />
     </span>

     <span class="people" > {color.id} / 6 </span>
     <span class="spade2">
     <img src={ spade } width='32' height='32' />
     </span>
     <span class="end"> {color.id} </span>
     

  </div>
))

function Scroll() {
  return (
    <Container>
      <H1>WELCOME</H1>
      <HorizontalCenter>
        <Carousel>{colorsArray}</Carousel>
      </HorizontalCenter>
    </Container>
  )
}

export default withRouter(Scroll)