import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { getTv, IGetSearchMovie, searchMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { constSelector } from "recoil";
import { click } from "@testing-library/user-event/dist/click";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow-x:hidden;
`;

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


const Row = styled(motion.div)`
  display:grid;
  gap:10px;
  grid-template-columns:repeat(6,1fr);
  position:absolute;
  width:100%;
`
const Banner = styled.div<{ bgPhoto: string }>`
  
  height: 100vh;
  display: flex;
  padding:60px;
  flex-direction: column;
  justify-content: center;
  background-size: cover;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
  url(${(props) => props.bgPhoto});
`;

const Tv=styled.div`
  height:300px;
  background-color:white;
  position:relative;
  top:-300px;
  background-color:rgba(255,255,255,0.3);
`
const Slider = styled.div`
  h1{
    padding:10px;
    font-size:48px;
    font-weight:bold;
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
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Overlay=styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`
const Detail=styled.div`
height:300px;
`
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
const BigCover=styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`
const BigTitle = styled.h3`
position:absolute;
  top:0;
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
 
  
`;

const BigOverview = styled.p`
  padding: 20px;
  
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

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


const offset =6;

function TV() {
  const location = useLocation();
  const keyword= new URLSearchParams(location.search).get("keyword");
 
  const history= useHistory();
  const onOverlayClick = ()=>{
    history.push(`/tv`);
  }
 
  const {data, isLoading}=useQuery<IGetSearchMovie>(
    ['searchData','nowPlaying'],
    ()=>getTv(1)
    
  )
 console.log(data)
  const onBoxClicked = (tvId:number)=>(history.push(`/tv/${tvId}`));
  const bigMovieMatch = useRouteMatch<{tvId:string}>(`/tv/:tvId`);
  console.log(bigMovieMatch)
  
  const clickedMovie =
    bigMovieMatch?.params.tvId &&
    data?.results.find((tv) => tv.id === +bigMovieMatch.params.tvId);

  

  const [tLeaving,setTLeaving]=useState(false);

  const [tIndex, setTIndex]=useState(0)
  const { scrollY } = useViewportScroll();

  const toggleTLeaving=()=>setTLeaving(prev=>!prev);

  const increaseTvIndex=()=>{
    if(data){
      const totalTvs = data.results.length;
      const maxIndex = Math.floor(totalTvs/offset)-1;
      if(totalTvs>6){
        if(tLeaving) return;
          toggleTLeaving();
          setTIndex((prev)=>prev===maxIndex ? 0 : prev+1)
      }
     
    }
  }
  
  return(
    <Wrapper>
      {isLoading?(
        <Loader>Loading...</Loader>
      ):(
        <>
      <Banner
       
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >

      </Banner>

        
      <Tv
      
      >
      <Slider>
      <h1
         onClick = {increaseTvIndex}
      >TV SHOW</h1>
            <AnimatePresence initial={false} onExitComplete={toggleTLeaving}>
              <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={tIndex}
              >
                {data?.results
                  ?.slice(offset * tIndex, offset * tIndex + offset)
                  .map((tv) => (
                    <Box          
                      layoutId={tv.id+''}
                      variants={BoxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{type:"tween"}}
                      key={tv.id}
                      onClick={()=>onBoxClicked(tv.id)}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info
                        variants={InfoVariants}
                      >
                        <h4>{tv.title}</h4>
                      </Info>
                    </Box>
                ))}
              </Row>
            </AnimatePresence>
      </Slider>
      </Tv>
      <AnimatePresence>
              {(bigMovieMatch)?(
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <BigMovie
                    layoutId={bigMovieMatch.params.tvId}
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
                        <BigTitle>{clickedMovie.name}</BigTitle>
                        <Line>
                          <Vote>평점 : {clickedMovie.vote_average}</Vote>
                          <Date>출시일 : {clickedMovie.first_air_date}</Date>
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
  );
}
export default TV;