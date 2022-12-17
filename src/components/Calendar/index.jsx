import React, { memo, useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Toolbar,
  MonthView,
  WeekView,
  DayView,
  ViewSwitcher,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  DragDropProvider,
  EditRecurrenceMenu,
  AllDayPanel,
  TodayButton,
  DateNavigator,
} from '@devexpress/dx-react-scheduler-material-ui';

import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {
  Button, 
  Checkbox, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  TextField, 
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Grid } from '@mui/material';
import moment from 'moment/moment';
import 'moment/locale/id'  
import './index.css';


// import {appointments} from '../Data/appointments'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// BAHASA INDONESIA UNTUK MOMENT
moment.locale('id')



const PREFIX = 'Demo';
// #FOLD_BLOCK
export const classes = {
  container: `${PREFIX}-container`,
  text: `${PREFIX}-text`,
  formControlLabel: `${PREFIX}-formControlLabel`,
};

// #FOLD_BLOCK
const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.container}`]: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
  [`& .${classes.text}`]: theme.typography.h6,
  [`& .${classes.formControlLabel}`]: {
    ...theme.typography.caption,
    fontSize: '1rem',
  },
}));




const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const initialValue = {
  title: "",
  startDate: "",
  endDate: "",
  notes: "",
}

// FUNCTION
function Calendar() {

  // TIME STATE
  const [timeState, setTimeState] = useState(moment().format());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null );
  // console.log(`START ${startTime}`);
  // console.log(`END ${endTime}`);


  useEffect(()=>{
    setInterval(() => setTimeState(moment().format()), 1000);
  },[])




  // DATA STATE
  const [addedAppointment, setAddedAppointment] = useState({});
  const [values, setValues] = useState({
    title: "",
    startDate: null,
    endDate: null,
    notes: "",
  });
  // const {title, notes, startDate, endDate} = values;
  const [data, setData] = useState([]);
  const [simpan, setSimpan] = useState([]);
  const [flagData, setFlagData] = useState(false)
  console.log(data);

  // useEffect(()=>{
  //   if(!flagData){
  //     setData({values})

  //     setTimeout(()=>{
  //       setFlagData(false)
  //     }, 2000)
      
  //   }
  // },[])

  const [isAppointmentBeingCreated, setIsAppointmentBeingCreated] = useState(false);

  // Melakukan Perubahan
  const onCommitChanges = useCallback(({ added, changed, deleted }) => {
    if (added) {
      const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
      setData([...data, { id: startingAddedId, ...added }]);
    }
    if (changed) {
      setData(data.map(appointment => (
        changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment)));
    }
    if (deleted !== undefined) {
      setData(data.filter(appointment => appointment.id !== deleted));
    }
    setIsAppointmentBeingCreated(false);
  }, [setData, setIsAppointmentBeingCreated, data]);


  // Appointment Chahange || Perubahan Perjanjian
  const onAddedAppointmentChange = useCallback((appointment) => {
    setAddedAppointment(appointment);
    setIsAppointmentBeingCreated(true);
  });


  // ADD Appointment dengan click 2x cell
  const TimeTableCellDay = useCallback(memo(({ onDoubleClick, ...restProps }) => (
    <DayView.TimeTableCell
      {...restProps}
      onClick={onDoubleClick} // allowAdding & unidfined dihilangkan nanti 
    />
  )), []); 

  const TimeTableCellWeek = useCallback(memo(({ onDoubleClick, ...restProps }) => (
    <WeekView.TimeTableCell
      {...restProps}
      onClick={onDoubleClick} // allowAdding & unidfined dihilangkan nanti 
    />
  )), []); 

  const TimeTableCellMonth = useCallback(memo(({ onDoubleClick, ...restProps }) => (
    <MonthView.TimeTableCell
      {...restProps}
      onClick={onDoubleClick} // allowAdding & unidfined dihilangkan nanti 
    />
  )), []); 


  const LayoutSettings = useCallback(memo(({ ...restProps }) => (
    <AppointmentForm.Layout
      {...restProps}
      isRecurrence={false}
    />
  )), []); 

  // USE CALL BACK COMMOND BUTTON 
  const CommandButton = useCallback(({ id, ...restProps }) => {
    // if (id === 'deleteButton') {
    //   return <AppointmentForm.CommandButton id={id} {...restProps} />;
    // }
    return <AppointmentForm.CommandButton id={id} {...restProps} />;
  }, []);

  
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickClose = () => {
    setOpen(false);
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.title || values.notes || values.startDate || values.endDate){
      console.log(values);
      setData((state) => [...state, values])

      setValues({
        title: "",
        startDate: null,
        endDate: null,
        notes: "",
      })
    }else {
      console.log("GAGAL");
    }
  }
  // console.log(values);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <div className='mt-10'>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* LEFT SIDE */}
        <Grid item={true} xs={3}>
          <Item>
            <div>
              <p>
                {
                  moment().format('LTS')
                }
              </p>
              <p>
                {
                  // dateState.toLocaleDateString('en-GB', {
                  //   day: 'numeric',
                  //   month: 'short',
                  //   year: 'numeric'
                  // })
                  moment().format('dddd Do MMMM')
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
          <Grid container className='mt-4'>
            <Grid item xs={6}>
              <Item className='mr-1'>ITEM 1</Item>
            </Grid>
            <Grid item xs={6}>
              <Item className='ml-1'>ITEM 1</Item>
            </Grid>
          </Grid>
        </Grid>

        {/* SCHEDULE CALENDAR SIDE || RIGHT SIDE */}
        <Grid item={true} xs={9}>
          <Item>
            {/* <div>
              <div className='w-full flex justify-end py-2 pr-5'>
                <Button className='bg-blue-500' variant="contained" onClick={handleOpen}>Open modal</Button>
              </div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={styleModal}>
                  <Typography  id="modal-modal-title" variant="h6" component="h2">
                    Meeting Schedule
                  </Typography>
                  <TextField  id="outlined-basic" label="Judul Acara" variant="outlined" size="small" sx={{mt: 4}} />
                  <TextField  id="outlined-basic" label="test" variant="outlined" size="small" sx={{ mt: 4 }} />
                  <TextField  id="outlined-basic" label="test" variant="outlined" size="small" sx={{ mt: 4 }} />
                  <TextField  id="outlined-basic" label="test" variant="outlined" size="small" sx={{ mt: 4 }} />
                  <TextField  id="outlined-basic" label="test" variant="outlined" size="small" sx={{ mt: 4 }} />
                </Box>
              </Modal>
            </div> */}

            <div>
                <div className='w-full flex justify-end py-2 pr-6'>
                  <Button className='bg-orange-500 hover:bg-orange-700' variant="contained" onClick={handleClickOpen} >
                    Open dialog
                  </Button>
                </div>
                  <BootstrapDialog
                    onClose={handleClickClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                  >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClickClose}>
                        Modal title
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                      {/* TITLE */}
                    <form onSubmit={handleSubmit} >
                      <Typography gutterBottom component={'div'}>
                        <div>
                          <TextField
                            type="text"
                            name='title'
                            label="Acara"
                            id="outlined-size-small"
                            size="small"
                            sx={{width: '80%'}}
                            value={values.title}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Typography>

                      {/* DATE START & END */}
                      <Typography gutterBottom component={'div'} sx={{mt: 2}}>
                        <LocalizationProvider spacing={2} dateAdapter={AdapterMoment}>
                          <div className='w-full flex justify-between m-10'>
                            <DateTimePicker
                              type="date"
                              name="startDate"
                              label="Mulai Dari"
                              value={values.startDate}
                              onChange={(newValue) => {
                                setValues((prev) => ({...prev, startDate: newValue._d}) );
                                }
                              }
                              renderInput={(params) => 
                                <TextField {...params} sx={{ mr: 3, mt: 2 }} />
                              }

                              />
                              
                            <DateTimePicker
                              type="date"
                              name="endDate"
                              label="Berakhir"
                              value={values.endDate}
                              onChange={(newValue) => {
                                  setValues((prev) => ({ ...prev, endDate: newValue._d }));
                                }
                              }
                              renderInput={(params) => 
                                <TextField {...params} sx={{ mt: 2 }} />
                              }
                                
                              />

                          </div>

                        </LocalizationProvider> 
                      </Typography>

                      <Typography gutterBottom>
                        All Day <Checkbox />
                      </Typography>

                      {/* <Typography gutterBottom>
                        <div>
                          <TextField

                            label="Tambahkan Lokasi"
                            id="outlined-size-small"
                            size="small"
                            sx={{ width: '80%' }}
                          />
                        </div>
                      </Typography> */}

                      <Typography sx={{ mt: 3 }} gutterBottom component={'div'}>
                        <div>
                          <TextField
                            type="text"
                            label="Tambahkan Deskripsi"
                            id="outlined-size-small"
                            size="small"
                            sx={{ width: '80%' }}
                            name='notes'
                            value={values.notes}
                            onChange={handleInputChange}
                            />
                        </div>
                      </Typography>
                      <Button
                        type='submit'
                      >
                        Save changes
                      </Button>
                    </form>
                    </DialogContent>
                  </BootstrapDialog>
            </div>

            {/* PURE REACT SCHEDULER */}
            <Paper >
              <Scheduler
                data={data} 
                height={700}
                allDay={false}
              >
                <ViewState
                  // defaultCurrentDate={dateState.toLocaleDateString()}
                  defaultCurrentViewName="Bulan"
                />
                <EditingState 
                  onCommitChanges={onCommitChanges}
                  addedAppointment={addedAppointment}
                  onAddedAppointmentChange={onAddedAppointmentChange}
                />
                <IntegratedEditing />
                <DayView
                  startDayHour={6}
                  endDayHour={20}
                  name="Hari"
                  timeTableCellComponent={TimeTableCellDay} 
                />
                <WeekView 
                  startDayHour={6} 
                  endDayHour={20}
                  timeTableCellComponent={TimeTableCellWeek} 
                  name="Minggu"
                />
                <MonthView 
                  name="Bulan"
                  timeTableCellComponent={TimeTableCellMonth} 
                />
                <Appointments 
                />
                <AllDayPanel />
                <AppointmentTooltip 
                  showOpenButton={true}
                  showDeleteButton={true}
                />
                {/* <AppointmentForm 
                  commandButtonComponent={CommandButton}
                  // recurrenceLayoutComponent={reccurenceLayout}
                  layoutComponent={LayoutSettings}
                /> */}
                {/* <DragDropProvider 
                  allowDrag={()=>true}
                  allowResize={()=>true}
                /> */}
                <Toolbar />
                <ViewSwitcher />
                <DateNavigator /> 
                <TodayButton />
              </Scheduler>
            </Paper>
          </Item>
        </Grid>
      </Grid>

    </div>
  )
}

export default Calendar;
