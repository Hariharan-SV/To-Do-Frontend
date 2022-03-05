import { Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Cookies from 'universal-cookie';

const DashboardPage = () => {
	const [userDetails, setUserDetails] = useState(null);
	const [toDoS, setToDoS] = useState([]);
	const cookies = new Cookies();

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
	}, [])
	return (
		<div>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
				<h1>{`Hello ${userDetails?.name}`}</h1>
				<Button variant="contained" onClick={() => {
					cookies.remove('x-auth-token');
					window.location.reload();
				}}>Logout</Button>
			</div>
			<Grid container direction="row">
				<Grid item xs={12} md={4}>
					<Typography variant="h6">
						Description
					</Typography>
				</Grid>
				<Grid item xs={12} md={2}>
					<Typography variant="h6">
						Start	DateTime
					</Typography>
				</Grid>
				<Grid item xs={12} md={2}>
					<Typography variant="h6">
						End DateTime
					</Typography>
				</Grid>
				<Grid item xs={12} md={2}>
					<Typography variant="h6">
						Edit
					</Typography>
				</Grid>
				<Grid item xs={12} md={2}>
					<Typography variant="h6">
						Delete
					</Typography>
				</Grid>
			</Grid>
			{
				toDoS.map((todo,index)=>
				<Grid container direction="row">
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
					<Button fullWidth>Edit</Button>
				</Grid>
				<Grid item xs={12} md={2}>
					<Button fullWidth>Delete</Button>
				</Grid>
				</Grid>
				)
			}
		</div>
	);
}

export default DashboardPage;