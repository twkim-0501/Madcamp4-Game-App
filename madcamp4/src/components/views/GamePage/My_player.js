import React, { useEffect, useState } from 'react'
import "./MG_GamePage.css"
import StarIcon from '@material-ui/icons/Star';
import { makeStyles } from '@material-ui/core/styles';


function My_player(props) {
    const {playerName, playerId, MyChips, Chip, FixedChip, Dragable, host} = props;
    useEffect(() => {
    }, [])
  
    return (
        <div class="my-status">
            <div>
                {
                    host?._id == playerId ?
                    <span class="staricon">
                        <StarIcon style={{color: 'yellow'}}/>
                    </span> :
                    null
                }
                {"Player "+playerName}
            </div>
            <div>{MyChips}</div>
            <div>
            {
                Dragable
                ? <Chip />
                : <FixedChip /> 
            }
            </div>
        </div>
    )
  }
  
  export default My_player