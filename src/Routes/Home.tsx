import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence,useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow-x:hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  padding:60px;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position:relative;
  top:-100px;
`
const Row = styled(motion.div)`
  display:grid;
  gap:10px;
  grid-template-columns:repeat(6,1fr);
  position:absolute;
  width:100%;
`
const Box = styled(motion.div)<{bgphoto:string}>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: red;
  cursor:pointer;
  font-size: 66px;
  &:first-child{
    transform-origin:center left;
  }
  &:last-child{
    transform-origin:center right;
  }
`
const Info = styled(motion.div)`
  opacity:0;
  padding:10px;
  background-color:${(props)=>props.theme.black.lighter};
  position:absolute;
  width:100%;
  bottom:0;
  h4{
    font-size:18px;
    text-align: center;
    color:${props=>props.theme.white.lighter}
  }
`
const Overlay=styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow:auto; 
  background-color: ${(props) => props.theme.black.lighter};
`;
const Detail=styled.div`
height:300px;
`
const BigCover=styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position:absolute;
  top:0;
`;

const BigOverview = styled.p`
  padding: 20px;
  
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
const Line=styled.div`
font-size:1.2em;
padding:20px;
display:flex;
justify-content:space-between;
align-items:center;
`
const Vote=styled.p`
color:white;
`
const Date=styled.p`
color:white;
`
const InfoVariants={
  hover:{
    opacity:1,
    transition:{
      delay:0.5,
      duration:0.3,
      type:"tween",
    }
  }
}
const rowVariants ={
  hidden:{
    x:window.outerWidth+5,
  },
  visible:{
    x:0,
  },
  exit:{
    x:-window.outerWidth-5,
  },
}

const BoxVariants={
  normal:{
    scale:1,
  },
  hover:{
    h:-50,
    scale:1.2,
    transition:{
      delay:0.5,
      duration:0.3,
      type:"tween",
    }
  }
}
const offset =6;
function Home() {
  const {data,isLoading}=useQuery<IGetMoviesResult>(
    ['movies','nowPlaying'],
    getMovies
  );
  const [index, setIndex]=useState(0)
  const [leaving,setLeaving]=useState(false);
  const history= useHistory();
  const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  console.log(clickedMovie)
  const onOverlayClick = ()=>{
    history.push('/');
  }

  const toggleLeaving=()=>setLeaving(prev=>!prev);
  const increaseIndex=()=>{
    if(data){
      const totalMovies = data.results.length-1;
      const maxIndex = Math.floor(totalMovies/offset)-1;
      if(leaving) return;
        toggleLeaving();
        setIndex((prev)=>prev===maxIndex ? 0 : prev+1)
    }
  
  }
  const onBoxClicked = (movieId:number)=>(history.push(`/movies/${movieId}`));
  return (
    <Wrapper>
      {isLoading?(
        <Loader>Loading...</Loader>
      ):(
        <>
          <Banner
            onClick = {increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>
              {data?.results[0].title}
            </Title>
            <Overview>
              {data?.results[0].overview}
            </Overview>
          </Banner>
              <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                  >
                    {data?.results
                      .slice(1)
                      .slice(offset * index, offset * index + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id+''}
                          variants={BoxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{type:"tween"}}
                          onClick={()=>onBoxClicked(movie.id)}
                          key={movie.id}
                          bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info
                            variants={InfoVariants}
                          >
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                    ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            <AnimatePresence>
              {bigMovieMatch?(
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <BigMovie
                    layoutId={bigMovieMatch.params.movieId}
                    style={{top:scrollY.get()+100}}
                  >
                  {clickedMovie&&(
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <Detail>
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <Line>
                          <Vote>평점 : {clickedMovie.vote_average}</Vote>
                          <Date>출시일 : {clickedMovie.release_date}</Date>
                        </Line>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                      </Detail>
                      
                    </>
                  )}
                  </BigMovie>
                </>
              ):null}
              
                
            </AnimatePresence>
          
        </>
      )}


    </Wrapper>
    )
}
export default Home;