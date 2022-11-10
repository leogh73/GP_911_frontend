import Change from './Row';
import Title from './Title';
import Button from './Button';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IconContext } from 'react-icons';
import { BiDownArrow } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import { GoSearch } from 'react-icons/go';

import './ChangesList.css';
import Table from './Table';

const ChangesList = ({ changes }) => {
	const tabClickHandler = (e) => {
		let element = document.getElementById(e.target.id);
		if (element) {
			let index = element.getAttribute('index');
			let tabs = document.querySelectorAll('.tab');
			let contents = document.querySelectorAll('.changes');
			tabs.forEach((tab) => tab.classList.remove('selected'));
			contents.forEach((content) => {
				content.classList.remove('show');
			});
			element.classList.add('selected');
			contents[index].classList.add('show');
		}
	};

	return (
		<div className="changes-list">
			<div className="tabs-container" onClick={tabClickHandler}>
				<div className="tabs-list">
					<div className="tab selected" id="requested" index={0}>
						Solicitados
					</div>
					<div className="tab" id="opened" index={1}>
						Abiertos
					</div>
				</div>
			</div>
			<div className="changes show">
				<Table
					id={Math.random() * 10000}
					headersList={[
						{ key: 0, title: '#' },
						{ key: 1, title: 'Quien cubre' },
						{ key: 2, title: 'A cubrir' },
						{ key: 3, title: 'Quien devuelve' },
						{ key: 4, title: 'A devolver' },
						{ key: 5, title: 'Estado' },
					]}
					rowType={'change'}
					dataList={changes}
					newLink={'/newchange'}
				/>
			</div>
			<div className="changes">
				<Table
					id={Math.random() * 10000}
					headersList={[
						{ key: 0, title: '#' },
						{ key: 1, title: 'Personal' },
						{ key: 2, title: 'Pedido' },
						{ key: 3, title: 'Ofrecido' },
					]}
					rowType={'request'}
					dataList={[
						{
							priorityId: '001',
							name: 'Cuevas Leonardo',
							requestData: {
								date: '01/12/2022',
								shift: '14 a 22 hs.',
								day: 'Viernes',
								guardId: 'F',
							},
							offerData: {
								date: '08/12/2022',
								shift: '14 a 22 hs.',
								day: 'Miercoles',
								guardId: 'B',
							},
						},
						{
							priorityId: '002',
							name: 'Coccolo Silvana',
							requestData: {
								date: '09/12/2022',
								shift: '14 a 22 hs.',
								day: 'Viernes',
								guardId: 'F',
							},
							offerData: {
								date: '14/12/2022',
								shift: '14 a 22 hs.',
								day: 'Miercoles',
								guardId: 'B',
							},
						},
						{
							priorityId: '003',
							name: 'Da Costa melina',
							requestData: {
								date: '29/11/2022',
								shift: '14 a 22 hs.',
								day: 'Viernes',
								guardId: 'F',
							},
							offerData: {
								date: '30/11/2022',
								shift: '14 a 22 hs.',
								day: 'Miercoles',
								guardId: 'B',
							},
						},
					]}
					newLink={'/newchange'}
				/>
			</div>
		</div>
	);
};

export default ChangesList;

// useEffect(() => {
// const headers = document.querySelectorAll('.table-header');
// const buttons = document.querySelectorAll('.arrow-down');
// const clickHandler = (bt, i, value) => {
// 	console.log('CLICK');
// 	bt.classList.toggle('arrow-active');
// 	let activeSelect = bt.classList.contains('arrow-active');
// 	buttons.forEach((button, index) => {
// 		let active = button.classList.contains('arrow-active');
// 		if (i != index && activeSelect == active) button.classList.toggle('arrow-active');
// 	});
// 	dispatch({ payload: value });
// };
// headers.forEach((header, i) => {
// 	let innerArrow = header.querySelector('.arrow-down');
// 	header.addEventListener('click', () =>
// 		clickHandler(innerArrow, i, header.innerText.substr(1)),
// 	);
// });
// return () => {
// 	headers.forEach((header, i) => {
// 		let innerArrow = header.querySelector('.arrow-down');
// 		header.removeEventListener('click', (e) =>
// 			clickHandler(innerArrow, i, e.target.innerText.substr(1)),
// 		);
// 	});
// };
// }, []);
