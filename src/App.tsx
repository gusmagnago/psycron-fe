import {
	Alert,
	Box,
	Button,
	Checkbox,
	Divider,
	FormControl,
	InputLabel,
	LinearProgress,
	Link,
	MenuItem,
	Pagination,
	Radio,
	Select,
	Switch,
	TextField,
	Tooltip,
	Typography} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarDays, ChevronDown, X } from 'lucide-react';


function App() {
	return (
		<>
			<Box>
				<Typography>First Commit</Typography>
				<Button variant='contained'>Label</Button>
				<Button variant='contained' color='secondary'>
          label
				</Button>
				<Button variant='contained' disabled>
          label
				</Button>
				<Button variant='contained' color='secondary' disabled>
          label
				</Button>
				<Button variant='outlined'>Label</Button>
				<Button variant='outlined' color='secondary'>
          label
				</Button>
				<Button variant='outlined' disabled>
          label
				</Button>
				<Button variant='outlined' color='secondary' disabled>
          label
				</Button>
			</Box>
			<Box>
				<Link href='#'>Link</Link>
			</Box>
			<Box>
				<Checkbox />
				<Checkbox disabled checked />
			</Box>
			<Box>
				<Switch />
				<Switch checked />
				<Switch disabled />
				<Switch disabled checked />
			</Box>
			<Box>
				<Radio />
				<Radio checked />
				<Radio disabled />
				<Radio disabled checked />
			</Box>
			<Box>
				<Divider />
			</Box>
			<Box>
				<Tooltip title={'title'} arrow>
					<X />
				</Tooltip>
			</Box>
			<Box>
				<LinearProgress valueBuffer={40} value={20} />
				<LinearProgress color='secondary' value={20} />
			</Box>
			<Box>
				<Alert severity='success'> Some text should come here </Alert>
				<Alert severity='error'> Some text should come here </Alert>
				<Alert severity='info'> Some text should come here </Alert>
				<Alert severity='warning'> Some text should come here </Alert>
			</Box>
			<Box>
				<TextField label='Some Label' variant='standard' />
				<TextField label='Some Label' variant='standard' disabled />
			</Box>
			<Box width={200}>
				<FormControl>
					<InputLabel id='demo-simple-select-label'>Age</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						variant='standard'
						value={''}
						label='Age'
						// eslint-disable-next-line no-console
						onChange={() => console.log('ai')}
						IconComponent={ChevronDown}
						fullWidth
					>
						<MenuItem value={10} divider>
              Ten
						</MenuItem>
						<MenuItem value={20}>Twenty</MenuItem>
						<MenuItem value={30}>Thirty</MenuItem>
					</Select>
				</FormControl>
			</Box>
			<Box>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker
						label='Basic date picker'
						slots={{ openPickerIcon: CalendarDays }}
					/>
				</LocalizationProvider>
			</Box>
			<Box>
				<Pagination count={10} />
			</Box>
			<Box>
			</Box>
		</>
	);
}

export default App;
