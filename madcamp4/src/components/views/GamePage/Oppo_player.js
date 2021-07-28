import React, { useEffect, useState } from 'react'
import "./MG_GamePage.css"
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function Oppo_player(props) {
  const { player, myId, MyChips, Playing, host, playerBids, BidStatus, Index, myIndex } = props;
  var isMe = (Index == myIndex) ? "Me" : "notMe"
  useEffect(() => {
    console.log("map test", playerBids,Index, player);
  }, [Playing])

  return (
    <div>
      <span>
          {
            host?._id == player._id ?
            <span class="staricon">
                <StarIcon style={{color: 'blue'}}/>
            </span> :
            null
          }
        </span>
      <span>
        {"Player " + player?.name}
        <CloseIcon class="closeicon" id={isMe}/>
      </span>
      <span>
        {
          Playing ?
            (Index == myIndex) ?
            <div class="Bids" id="Me">
              {
                playerBids[Index]?.map( (Bid,index) => 
                  (BidStatus[Index].activeIndex.includes(index)) ?
                    <div class="Bid">{Bid}</div> :
                    <div>{Bid}</div>
                )
              }
            </div> :
            <div class="Bids">
              {
                playerBids[Index]?.map( (Bid,index) => 
                  (BidStatus[Index].activeIndex.includes(index)) ?
                    <div class="Bid">{Bid}</div> :
                    <div>{Bid}</div>
                )
              }
            </div>
           :
          null
        }
      </span>
    </div>
  )
}

export default Oppo_player