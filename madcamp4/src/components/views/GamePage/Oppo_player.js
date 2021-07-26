import React, { useEffect, useState } from 'react'
import "./MG_GamePage.css"
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

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
  const {player, index, userChips} = props;

  const [Posts, setPosts] = useState([])
  const [userchips, setUserchips] = useState(userChips)

  useEffect(() => {
  }, [])

  return (
      <div class="opo-player">
        <div>
          {"Player "+player}
          {
            userChips 
            ? userChips.map((num, idx) => 
                (index == idx) ? num : null
              )
            : null
          }
          <CloseIcon class="closeicon"/>
        </div>
        
        <div>
          {
            
          }
        </div>
        
      </div>
  )
}

export default Oppo_player