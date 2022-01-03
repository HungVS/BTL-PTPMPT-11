import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from '@material-ui/core';
import InsertDriveFileTwoToneIcon from '@material-ui/icons/InsertDriveFileTwoTone';
import { useState } from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import './admin.scss';
import bg from '../../assets/images/footer-bg.jpg';

const CircularProgressWithLabel = (props) => {
  return (
    <Box position='relative' display='inline-flex'>
      <CircularProgress variant='determinate' {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position='absolute'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Typography
          variant='subtitle1'
          component='div'
          color='textSecondary'
        >{`${props.value}%`}</Typography>
      </Box>
    </Box>
  );
};

const Admin = () => {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(0);

  const [openSB, setOpenSB] = useState(false);
  const [msgSB, setMsbSB] = useState('hehe');
  const [typeSB, setTypeSB] = useState('success');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSB(false);
  };

  const handleCLick = async (type, file) => {
    try {
      switch (type) {
        case 'sql':
          const { data: sqlRes } = await axios.get(
            'http://localhost:5000/load'
          );
          console.log(sqlRes);
          setMsbSB('Load table rating to Sqoop done!!');
          break;
        case 'csv':
          if (file) {
            const { data: csvRes } = await axios.post(
              'http://localhost:5000/upload',
              file[0],
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            console.log(csvRes);
            // const formData = new FormData();
            // formData.append('file', file[0]);
            // console.log(formData);
            setMsbSB(`Load csv file: ${file[0].name} to Sqoop done!!`);
          }
          break;
        case 'training':
          const { data: resultTrain } = await axios.get(
            'http://localhost:5000/train'
          );
          console.log(resultTrain);
          setResult(resultTrain);
          setMsbSB('Traning Done!!');
          break;
        default:
          throw new Error('type not found');
      }

      setTypeSB('success');
    } catch (error) {
      console.log(error);
      setMsbSB('Something Wrong !!!');
      setTypeSB('error');
    }
    setOpenSB(true);
  };

  return (
    // <div className='admin_wrapper' style={{ backgroundImage: `url(${bg})` }}>
    <div className='admin_wrapper'>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSB}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={typeSB}
          elevation={6}
          variant='filled'
        >
          {msgSB}
        </Alert>
      </Snackbar>
      <div className='container'>
        <h2>Tải dữ liệu vào HDFS</h2>
        <div className='importdata'>
          <div className='importdata__btn'>
            <Button
              variant='contained'
              color='primary'
              onClick={() => handleCLick('sql')}
            >
              từ SQL
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setOpen(true)}
            >
              từ tệp CSV
            </Button>
            <DropzoneDialog
              dialogTitle='Chọn tệp CSV '
              acceptedFiles={['.csv']}
              cancelButtonText={'cancel'}
              submitButtonText={'submit'}
              getPreviewIcon={() => <InsertDriveFileTwoToneIcon />}
              filesLimit={1}
              maxFileSize={50000000}
              open={open}
              onClose={() => setOpen(false)}
              onSave={(files) => {
                handleCLick('csv', files);
                setOpen(false);
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </div>
        </div>
        <h2>Training</h2>
        <div className='trainning'>
          <Button
            color='primary'
            variant='contained'
            onClick={() => handleCLick('training')}
          >
            Training
          </Button>
          <div className='trainning__result'>
            <span>Độ chính xác: </span>
            <CircularProgressWithLabel
              thickness={4}
              size='75px'
              value={result}
            />
          </div>
        </div>
        <Button
          className='link'
          variant='outlined'
          color='primary'
          href='https://google.com'
          target='_blank'
        >
          Quản lý HDFS
        </Button>
      </div>
    </div>
  );
};

export default Admin;
