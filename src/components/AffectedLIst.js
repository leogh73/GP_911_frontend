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

const AffectedList = () => {
	// const tabClickHandler = (e) => {
	// 	let element = document.getElementById(e.target.id);
	// 	if (element) {
	// 		let index = element.getAttribute('index');
	// 		let tabs = document.querySelectorAll('.tab');
	// 		let contents = document.querySelectorAll('.changes');
	// 		tabs.forEach((tab) => tab.classList.remove('selected'));
	// 		contents.forEach((content) => {
	// 			content.classList.remove('show');
	// 		});
	// 		element.classList.add('selected');
	// 		contents[index].classList.add('show');
	// 	}
	// };

	return (
		<div className="changes-list">
			<div className="changes show">
				<Table
					id={Math.random() * 10000}
					headersList={[
						{ key: 0, title: '#' },
						{ key: 1, title: 'Personal' },
						{ key: 2, title: 'Afectado' },
						{ key: 3, title: 'Desafectado' },
					]}
					rowType={'affected'}
					dataList={[
						{
							priorityId: '001',
							name: 'Cuevas Leonardo',
							affectedData: {
								date: '01/12/2022',
								shift: '14 a 22 hs.',
								day: 'Viernes',
								guardId: 'F',
							},
							disaffectedData: {
								date: '08/12/2022',
								shift: '14 a 22 hs.',
								day: 'Miercoles',
								guardId: 'B',
							},
						},
						{
							priorityId: '002',
							name: 'Coccolo Silvana',
							affectedData: {
								date: '09/12/2022',
								shift: '14 a 22 hs.',
								day: 'Viernes',
								guardId: 'F',
							},
							disaffectedData: {
								date: '14/12/2022',
								shift: '14 a 22 hs.',
								day: 'Miercoles',
								guardId: 'B',
							},
						},
						{
							priorityId: '003',
							name: 'Da Costa melina',
							affectedData: {
								date: '29/11/2022',
								shift: '14 a 22 hs.',
								day: 'Viernes',
								guardId: 'F',
							},
							disaffectedData: {
								date: '30/11/2022',
								shift: '14 a 22 hs.',
								day: 'Miercoles',
								guardId: 'B',
							},
						},
					]}
					newLink={'/newaffected'}
				/>
			</div>
		</div>
	);
};

export default AffectedList;

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
