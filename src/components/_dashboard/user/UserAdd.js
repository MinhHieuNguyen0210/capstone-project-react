import react, { useState } from 'react';
import { FormGroup, FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import './styles.css';

const initialValue = {
  name: '',
  username: '',
  email: '',
  phone: ''
};

const useStyles = makeStyles({
  container: {
    width: '50%',
    margin: '5% 0 0 25%',
    '& > *': {
      marginTop: 20
    }
  }
});

const UserAdd = () => {
  const [user, setUser] = useState(initialValue);
  const { name, username, email, phone } = user;
  const classes = useStyles();

  const onValueChange = (e) => {
    console.log(e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <FormGroup className={classes.container}>
      <Typography variant="h4">Add Food</Typography>
      <FormControl>
        <InputLabel htmlFor="my-input">Name</InputLabel>
        <Input onChange={(e) => onValueChange(e)} name="" value={name} id="my-input" />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Category</InputLabel>
        <Input onChange={(e) => onValueChange(e)} name="" value={username} id="my-input" />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Price</InputLabel>
        <Input onChange={(e) => onValueChange(e)} name="" value={email} id="my-input" />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Description</InputLabel>
        <Input onChange={(e) => onValueChange(e)} name="" value={phone} id="my-input" />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Status</InputLabel>
        <Input onChange={(e) => onValueChange(e)} name="" value={phone} id="my-input" />
      </FormControl>
      <FormControl>
        <DatePickerComponent
          style={{ padding: '11px', fontSize: '15px' }}
          id="datepicker"
          placeholder="Enter date"
        />
      </FormControl>

      <FormControl>
        <Button variant="contained" color="primary">
          Add food
        </Button>
      </FormControl>
    </FormGroup>
  );
};

export default UserAdd;
