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
  const {player} = props;
  const [Posts, setPosts] = useState([])
  useEffect(() => {
  }, [])

  return (
      <div class="opo-player">
        <div>
          {"Player "+player}
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