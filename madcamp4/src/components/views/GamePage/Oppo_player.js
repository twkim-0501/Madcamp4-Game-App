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
  const {player, host} = props;
  const [Posts, setPosts] = useState([])
  useEffect(() => {
  }, [])

  return (
      <div class="opo-player">
        <span>
          {
            host._id == player._id ?
            <span class="staricon">
                <StarIcon style={{color: 'yellow'}}/>
            </span> :
            null
          }
        </span>
        <span>
          {"Player "+player?.name}
          <CloseIcon class="closeicon"/>
        </span>
        
        <div>
          {
            
          }
        </div>
        
      </div>
  )
}

export default Oppo_player