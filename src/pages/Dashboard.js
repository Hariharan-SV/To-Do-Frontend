import { Button, Grid, Modal, Typography, Box, TextField, DialogContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import Cookies from 'universal-cookie';

const DashboardPage = () => {
	const [userDetails, setUserDetails] = useState(null);
	const [toDoS, setToDoS] = useState([]);
	const [addDialogData, setAddDialogData] = useState({});
	const [editDialogData, setEditDialogData] = useState({});
	const [openAddDialog, setOpenAddDialog] = React.useState(false);
	const [openEditDialog, setOpenEditDialog] = React.useState(false);
	const cookies = new Cookies();

	const handleToDoEdit = (todo) => {
		setEditDialogData(todo);
		setOpenEditDialog(true);
	}

	const handleEditDataChange = (e) => {
		setEditDialogData({
			...editDialogData,
			[e.target.name]: e.target.value
		})
	}

	const handleAddDataChange = (e) => {
		e.preventDefault();
		setAddDialogData({
			...addDialogData,
			[e.target.name]: e.target.value
		})
	}

	const handleEditDataSubmit = (e) => {
		e.preventDefault();
		window.location.reload();
	}

	const handleAddDataSubmit = async(e) => {
		e.preventDefault();
		const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/todo", {
			method: "POST",
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ 'x-auth-token': cookies.get('x-auth-token'), 'userDetails': userDetails, 'id': userDetails.id, ...addDialogData }),
		}).then(response => response.json());
		window.location.reload();
	}

	const ToDoForm = (props) => {
		const { inputs, handleInputChange } = props;
		return (
			<Grid container direction="row" spacing={2}>
				<Grid item xs={12} md={6}>
					<TextField
						required
						fullWidth
						label="Description"
						name="description"
						value={inputs.description}
						onChange={handleInputChange}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						required
						label="Start Date"
						fullWidth
						name="startDateTime"
						value={inputs.startDateTime}
						onChange={handleInputChange}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						required
						label="End Date"
						fullWidth
						name="endDateTime"
						value={inputs.endDateTime}
						onChange={handleInputChange}
					/>
				</Grid>
			</Grid>
		);
	}

	useEffect(() => {
		async function loadData() {
			const usernameFromBackend = await fetch(process.env.REACT_APP_BACKEND_URL + "/get-session", {
				method: "POST",
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 'x-auth-token': cookies.get('x-auth-token') }),
			}).then(response => response.json());
			setUserDetails(usernameFromBackend);
			const todosFromBackend = await fetch(process.env.REACT_APP_BACKEND_URL + "/get-todos", {
				method: "POST",
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 'x-auth-token': cookies.get('x-auth-token'), 'userDetails': usernameFromBackend }),
			}).then(response => response.json());
			setToDoS(todosFromBackend.result);
		}
		loadData()
	}, []);

	const handleEditDialogClose = () => {
		setOpenEditDialog(false);
		setEditDialogData({});
	};

	const handleAddDialogClose = () => {
		setOpenAddDialog(false);
		setAddDialogData({});
	};

	return (
		<div>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
				<h1>{`Hello ${userDetails?.name}`}</h1>
				<Button variant="contained" onClick={() => {
					cookies.remove('x-auth-token');
					window.location.reload();
				}}>Logout</Button>
			</div>
			<Grid container spacing={2} style={{ marginBottom: "12px" }} direction="row" alignItems="center" justifyContent="center">
				<Grid item xs={8}>
					<Button variant="outlined" fullWidth onClick={() => {
						setAddDialogData({});
						setOpenAddDialog(true);
					}}>Add New ToDo</Button>
				</Grid>
			</Grid>
			<Grid container direction="row">
				<Grid item xs={12} md={4}>
					<Typography variant="h5">
						Description
					</Typography>
				</Grid>
				<Grid item xs={12} md={2}>
					<Typography variant="h5">
						Start
					</Typography>
				</Grid>
				<Grid item xs={12} md={2}>
					<Typography variant="h5">
						End
					</Typography>
				</Grid>
				<Grid item xs={12} md={2}>
					<Typography variant="h5">
						Edit
					</Typography>
				</Grid>
				<Grid item xs={12} md={2}>
					<Typography variant="h5">
						Delete
					</Typography>
				</Grid>
			</Grid>
			{
				toDoS.map((todo, index) =>
					<Grid container direction="row" spacing={2} key={`Todo-${index}`} >
						<Grid item xs={12} md={4}>
							<Typography variant="paragraph">
								{todo.description}
							</Typography>
						</Grid>
						<Grid item xs={12} md={2}>
							<Typography variant="paragraph">
								{todo.startDateTime}
							</Typography>
						</Grid>
						<Grid item xs={12} md={2}>
							<Typography variant="paragraph">
								{todo.endDateTime}
							</Typography>
						</Grid>
						<Grid item xs={12} md={2}>
							<Button variant="outlined" onClick={handleToDoEdit.bind(this, todo)} fullWidth>Edit</Button>
						</Grid>
						<Grid item xs={12} md={2}>
							<Button variant="outlined" onClick={handleToDoEdit.bind(this, todo)} fullWidth>Delete</Button>
						</Grid>
					</Grid>
				)
			}

			<Modal
				open={openEditDialog}
				onClose={handleEditDialogClose}
			>
				<Box sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 700,
					bgcolor: 'background.paper',
					boxShadow: 24,
					p: 4,
				}}>
					<ToDoForm
						inputs={editDialogData}
						handleInputChange={handleEditDataChange}
					/>
					<div style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'flex-end',
						justifyContent: 'flex-end'
					}}>
						<Button variant="outlined" onClick={handleEditDialogClose}>Submit</Button>
					</div>
				</Box>
			</Modal>

			<Modal
				open={openAddDialog}
				onClose={handleAddDialogClose}
			>
				<DialogContent>
					<Box sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 700,
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
					}}>
						<ToDoForm
							inputs={addDialogData}
							handleInputChange={handleAddDataChange}
						/>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'flex-end',
							justifyContent: 'flex-end'
						}}>
							<Button variant="outlined" onClick={handleAddDataSubmit}>Submit</Button>
						</div>
					</Box>
				</DialogContent>
			</Modal>

		</div >
	);
}

export default DashboardPage;