import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Calendar() {

  const [dateState, setDateState] = useState(new Date());

  useEffect(()=>{
    setInterval(()=>setDateState(new Date()), 1000);
  },[])

  return (
    <div className='mt-10'>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={3}>
          <Item>
            <div>
              <p>
                {
                  dateState.toLocaleTimeString()
                }
              </p>
              <p>
                {
                  dateState.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })
                }
              </p> 
            </div>
          </Item>
          <Item className='mt-4'>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae voluptas fugit quidem in, consequatur illo voluptate delectus temporibus maiores itaque blanditiis culpa consectetur deserunt sit aspernatur. Fugit cumque architecto autem!
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi, delectus optio nihil architecto nam est dicta sed aliquid harum ipsum expedita magnam vel, voluptas itaque libero ea voluptatibus at mollitia!
            </div>
          </Item>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }} xs={12} className='mt-4'>
            <Grid item xs={6}>
              <Item>
                Test
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>ITEM 2</Item>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Item>
            <Paper>
              <Scheduler height={660}>
                <WeekView startDayHour={9} endDayHour={19} />
                <Appointments />
              </Scheduler>
            </Paper>
          </Item>
        </Grid>
      </Grid>

    </div>
  )
}

export default Calendar;