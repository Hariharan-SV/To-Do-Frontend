import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import Cookies from 'universal-cookie';

const LoginPage = () => {
	const cookies = new Cookies();

	const [inputs, setInputs] = useState({
		email: '',
		password: ''
	});

	const handleInputChange = (e) => {
		e.persist();
		setInputs({
			...inputs,
			[e.target.name]: e.target.value,
		});
	}

	const handleSubmit = async(e) => {
		if(!inputs.password || !inputs.email) {
			console.log("Provide All inputs");
			return;
		}
		const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/login", {
			method: "POST",
			body: JSON.stringify({
				'email': inputs.email,
				'password': inputs.password
			})
		}).then(response => response.json());
		if (response["status"] === "SUCCESS") {
			cookies.set("x-auth-token", response["token"]);
			window.location.reload();
		}
	}

	return (
		<Grid container spacing={2} alignItems={"center"} justifyContent={"center"}>
			<Grid item xs={12} md={8}>
				<TextField
					label="Email"
					required
					value={inputs.username}
					onChange={handleInputChange}
					name="email"
					fullWidth
				/>
			</Grid>
			<Grid item xs={12} md={8}>
				<TextField
					label="Password"
					required
					value={inputs.password}
					onChange={handleInputChange}
					name="password"
					type="password"
					fullWidth
				/>
			</Grid>
			<Grid item xs={12} md={8}>
				<Button
					variant="contained"
					fullWidth
					onClick={handleSubmit}
				>Login</Button>
			</Grid>
		</Grid>
	);
}

export default LoginPage;