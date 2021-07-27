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
  const { player, myId, MyChips, Playing, host, playerBids, BidStatus, myIndex } = props;

  useEffect(() => {
    console.log("map test", playerBids,myIndex, player);
  }, [Playing])

  return (
    <div>
      <span>
          {
            host?._id == player._id ?
            <span class="staricon">
                <StarIcon style={{color: 'yellow'}}/>
            </span> :
            null
          }
        </span>
      <span>
        {"Player " + player?.name}
        <CloseIcon class="closeicon" />
      </span>
      <span>
        {
          Playing ?
          <div>
            {
              playerBids[myIndex]?.map( (Bid,index) => 
                (BidStatus[myIndex].activeIndex.includes(index)) ?
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