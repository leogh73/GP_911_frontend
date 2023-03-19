import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import { useReducer, useState } from 'react';
import ChangeEdit from '../pages/ChangeEdit';
import NewItem from '../pages/NewItem';
import Changes from '../pages/Changes';
import Affected from '../pages/Affected';
import Schedule from '../pages/Schedule';
import Password from '../pages/Password';
import Users from '../pages/Users';
import Profile from '../pages/Profile';
import ProfileEdit from '../pages/ProfileEdit';

const useRoutes = (token, userData) => {
	const location = useLocation();
	const [state, dispatch] = useReducer(reducer, {
		activeEditRoute: false,
		changeData: {},
		profileData: {},
	});

	function reducer(state, action) {
		switch (action.type) {
			case 'toggle edit route':
				return {
					...state,
					activeEditRoute: action.payload.status,
				};
			case 'load change data':
				return {
					...state,
					changeData: action.payload.change,
					activeEditRoute: action.payload.editRoute,
				};
			case 'load profile data':
				return {
					...state,
					profileData: action.payload.profile,
					activeEditRoute: action.payload.editRoute,
				};
			default:
				break;
		}
	}

	const superiorRoutes = [
		,
		{
			key: '03',
			path: '/newaffected',
			element: <NewItem type={'affected'} key={'newaffected'} />,
		},
	];

	const adminRoutes = [
		,
		{
			key: '01',
			path: '/users',
			element: <Navigate to="/users/phoning" />,
		},
	];

	const userRoutes = [
		{
			key: '01',
			path: '/newchange',
			element: <NewItem type={'change'} key={'newchange'} />,
		},
		{
			key: '02',
			path: '/newrequest',
			element: <NewItem type={'request'} key={'newrequest'} />,
		},
	];

	if (!!userData && userData.admin) adminRoutes.forEach((route) => userRoutes.push(route));

	// if (!!userData && userData.superior)
	// 	superiorToues.forEach({
	// 		user
	// 	});

	const routes = token ? (
		<Routes>
			<Route path="/" element={<Navigate to="/changes/agreed" />} />
			<Route path="/changes" element={<Navigate to="/changes/agreed" />} />
			<Route path="/changes">
				<Route path="agreed" element={<Changes type={'change'} />} />
				<Route path="requested" element={<Changes type={'request'} />} />
				{state.activeEditRoute && (
					<Route path="edit" element={<ChangeEdit changeData={state.changeData} />} />
				)}
			</Route>
			<Route path="/affected" element={<Affected />} />
			<Route path="/changepassword" element={<Password type={'change'} />} />
			<Route path="/schedule" element={<Navigate to="/schedule/month" />} />
			<Route path="/schedule">
				<Route path="month" element={<Schedule type={'month'} />} />
				<Route path="search" element={<Schedule type={'search'} />} />
			</Route>
			<Route path="/profile">
				<Route path="" element={<Profile />} />
				<Route path="edit" element={<ProfileEdit startData={userData} />} />
				{state.activeEditRoute && (
					<Route path="edit-user" element={<ProfileEdit startData={state.profileData} />} />
				)}
			</Route>
			{userData.superior
				? superiorRoutes.map((route) => (
						<Route key={route.key} path={route.path} element={route.element} />
				  ))
				: userRoutes.map((route) => (
						<Route key={route.key} path={route.path} element={route.element} />
				  ))}
			{userData.admin && (
				<Route path="/users">
					<Route path="phoning" element={<Users section={'Phoning'} />} />
					<Route path="dispatch" element={<Users section={'Dispatch'} />} />
					<Route path="monitoring" element={<Users section={'Monitoring'} />} />
				</Route>
			)}
			{userData.admin && (
				<Route path="/register">
					<Route path="phoning" element={<Register key="phone-register" section={'Phoning'} />} />
					<Route
						path="dispatch"
						element={<Register key="dispatch-register" section={'Dispatch'} />}
					/>
					<Route
						path="monitoring"
						element={<Register key="monitoring-register" section={'Monitoring'} />}
					/>
				</Route>
			)}
			<Route path="*" element={<NotFound />} />
		</Routes>
	) : (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="*" element={<NotFound />} />
			<Route path="/forgotpassword" element={<Password type={'forgot'} />} />
		</Routes>
	);

	return {
		routes,
		state,
		dispatch,
	};
};

export default useRoutes;
