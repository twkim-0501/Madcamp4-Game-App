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
  const { player, myId, MyChips, Playing, host } = props;

  useEffect(() => {
    console.log("whereisstar", host, player);
  }, [])

  //   const Chip = () => {
  //     const [{ isDragging, canDrag }, drag] = useDrag({
  //         type: 'chip',
  //         item: { name: 'chip' },
  //         end: (item, monitor) => {
  //             const dropResult = monitor.getDropResult()
  //             if (dropResult && dropResult.name === 'table') {
  //                 setMyChips(MyChips - 1)
  //                 setBet(Bet + 1)
  //             }
  //         },
  //         collect: (monitor) => ({
  //             isDragging: monitor.isDragging(),
  //             canDrag: monitor.canDrag()
  //         }),
  //     });

  //     const opacity = isDragging ? 0.4 : 1;

  //     return (
  //         <div className='chip' ref={drag} style={{ opacity }}>
  //             {canDrag? "true" : "false"}
  //         </div>
  //     )
  // }

  // const FixedChip = () => {
  //     return (
  //         <div className='chip'>
  //             fix
  //         </div>
  //     )
  // }

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
     
    </div>
  )
}

export default Oppo_player