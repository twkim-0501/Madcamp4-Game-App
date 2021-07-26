import React, { useEffect, useState } from 'react'
import "./MG_GamePage.css"
import { makeStyles } from '@material-ui/core/styles';


function My_player(props) {
    const {playerName, MyChips, Chip, FixedChip, Dragable} = props;
    useEffect(() => {
    }, [])
  
    return (
        <div class="my-status">
            <div>{"Player "+playerName}</div>
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