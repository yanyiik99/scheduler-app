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
  Box,
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
import { BiPlus } from "react-icons/bi";
import { toast } from 'react-toastify';
import bgImage from '../../assets/coding.jpg';
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

// const initialValue = {
//   title: "",
//   startDate: "",
//   endDate: "",
//   notes: "",
// }

// FUNCTION
function Calendar() {

  // TIME STATE
  // const [startTime, setStartTime] = useState(null);
  // const [endTime, setEndTime] = useState(null );
  // console.log(`START ${startTime}`);
  // console.log(`END ${endTime}`);
  
  
  const [timeState, setTimeState] = useState(moment().format());
  useEffect(()=>{
    setInterval(() => setTimeState(moment().format()), 1000);
  },[])
  
  // DATA STATE
  const [addedAppointment, setAddedAppointment] = useState({});
  const [values, setValues] = useState({
    title: "",
    startDate: moment(),
    endDate: moment().add(1, 'd'),
    notes: "",
    location: "",
    allDay: false,
  });
  
  const [data, setData] = useState([]);
  // console.log(data);

  const [checked, setChecked] = useState(false);
  // console.log(checked);
  // console.log(values);


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


  // const LayoutSettings = useCallback(memo(({ ...restProps }) => (
  //   <AppointmentForm.Layout
  //     {...restProps}
  //     isRecurrence={false}
  //   />
  // )), []); 

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
      setData((state) => [...state, values,])
      setOpen(false);
      
      setValues({
        title: "",
        startDate: moment(),
        endDate: moment().add(1, 'd'),
        notes: "",
        location: "",
        allDay: false
      })
      
      setTimeout(() => {
        toast.success("Agenda Ditambahkan")
      }, 500)

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

  const handleChecked = (e) => {
    setChecked(e.target.checked)
    setValues({...values, allDay: !checked})
    // const { name } = e.target;
    // setValues({
    //   ...values,
    //   [name]: true,
    // });
  }

  return (
    <div className='mt-2 lg:mt-10'>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* LEFT SIDE */}
        <Grid item={true} xs={12} md={3}>

          {/* WAKTU */}
          <Item sx={{ display: { xs: "none", md: 'block' } }} className="bg-teal-500 text-white">
            <div className='flex flex-col justify-start items-start pl-4'>
              <p className='text-3xl'>
                {
                  moment().format('LTS')
                }
              </p>
              <p>
                {
                  moment().format('dddd Do MMMM')
                }
              </p> 
            </div>
          </Item>

          {/* CONTENT */}
          <Item className="mt-4 bg-cover  bg-bottom bg-no-repeat text-white p-6" style={{backgroundImage: `url(${bgImage})`}}>
            <div>
              KONTEN DISINI dolor sit amet consectetur adipisicing elit. Vitae voluptas fugit quidem in, consequatur illo voluptate delectus temporibus maiores itaque blanditiis culpa consectetur deserunt sit aspernatur. Fugit cumque architecto autem!
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi, delectus optio nihil architecto nam est dicta sed aliquid harum ipsum expedita magnam vel, voluptas itaque libero ea voluptatibus at mollitia!
            </div>
          </Item>

          {/* VIDEO PROMOTION  */}
          <Grid container className='mt-4' sx={{ display: { xs: "none", md: 'flex' } }}>
            <Grid item xs={6}>
              <Item className='mr-1'>KONTEN 01</Item>
            </Grid>
            <Grid item xs={6}>
              <Item className='ml-1'>KONTEN 02</Item>
            </Grid>
          </Grid>
        </Grid>

        {/* SCHEDULE CALENDAR SIDE || RIGHT SIDE */}
        <Grid item={true} xs={12} md={9}>
          <Item>

            <div>
                <div className='py-3 z-50 h-10 bg-teal-500 bottom-0 left-0 right-0 ml-auto mr-auto text-center fixed md:bg-transparent md:flex md:w-full md:justify-end md:relative md:py-2 md:pr-6'> 
                {/* with flex  w-full flex justify-end */}
                  <Button className='bg-orange-500 hover:bg-orange-700 w-4 h-16 absolute m-auto left-0 right-0 bottom-3 md:relative md:mr-0 md:mt-1 md:w-auto md:h-auto rounded-full md:rounded-sm' variant="contained" onClick={handleClickOpen} >
                    <span className='mr-3 font-bold hidden md:flex'>
                      Buat Acara
                    </span>
                    <BiPlus className='text-3xl md:text-xl font-bold ' />
                  </Button>
                </div>
                <BootstrapDialog
                  onClose={handleClickClose}
                  aria-labelledby="customized-dialog-title"
                  open={open}
                >
                  <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClickClose}>
                      Tambahkan Acaras
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
                    All Day <Checkbox name='allDay' checked={checked} onChange={handleChecked} />
                    </Typography>
                    
                    {/* Location */}
                    <Typography gutterBottom component={'div'}>
                      <div>
                        <TextField
                          type="text"
                          label="Tambahkan Lokasi"
                          id="outlined-size-small"
                          size="small"
                          sx={{ width: '80%' }}
                          name='location'
                          value={values.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </Typography> 
                    
                    {/* Deskripsi */}
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
                      Selesai
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
                <Box sx={{display: {xs: "none", md: 'block'}}}>
                  <TodayButton />
                </Box>
              </Scheduler>
            </Paper>
          </Item>
        </Grid>
      </Grid>

    </div>
  )
}

export default Calendar;
