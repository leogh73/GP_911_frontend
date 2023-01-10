// import './ItemsList.css';
// import Table from './Table';

// const ItemsList = ({ type, items }) => {
// 	const tabClickHandler = (e) => {
// 		let element = document.getElementById(e.target.id);
// 		if (element) {
// 			let index = element.getAttribute('index');
// 			let tabs = document.querySelectorAll('.tab');
// 			let contents = document.querySelectorAll('.changes');
// 			tabs.forEach((tab) => tab.classList.remove('selected'));
// 			contents.forEach((content) => {
// 				content.classLisordert.remove('show');
// 			});
// 			element.classList.add('selected');
// 			contents[index].classList.add('show');
// 		}
// 	};

// 	return (

// 			) : (
// 				<div className="changes show">
// 					<Table
// 						id={Math.random() * 10000}
// 						headersList={[
// 							{ key: 0, title: '#' },
// 							{ key: 1, title: 'Personal' },
// 							{ key: 2, title: 'Afectado' },
// 							{ key: 3, title: 'Desafectado' },
// 							{ key: 4, title: 'Foja' },
// 						]}
// 						rowType={'affected'}
// 						dataList={items}
// 						newLink={'/newaffected'}
// 					/>
// 				</div>
// 			)}
// 		</div>
// 	);
// };

// export default ItemsList;

// // useEffect(() => {
// // const headers = document.querySelectorAll('.table-header');
// // const buttons = document.querySelectorAll('.arrow-down');
// // const clickHandler = (bt, i, value) => {
// // 	console.log('CLICK');
// // 	bt.classList.toggle('arrow-active');
// // 	let activeSelect = bt.classList.contains('arrow-active');
// // 	buttons.forEach((button, index) => {
// // 		let active = button.classList.contains('arrow-active');
// // 		if (i != index && activeSelect == active) button.classList.toggle('arrow-active');
// // 	});
// // 	dispatch({ payload: value });
// // };
// // headers.forEach((header, i) => {
// // 	let innerArrow = header.querySelector('.arrow-down');
// // 	header.addEventListener('click', () =>
// // 		clickHandler(innerArrow, i, header.innerText.substr(1)),
// // 	);
// // });
// // return () => {
// // 	headers.forEach((header, i) => {
// // 		let innerArrow = header.querySelector('.arrow-down');
// // 		header.removeEventListener('click', (e) =>
// // 			clickHandler(innerArrow, i, e.target.innerText.substr(1)),
// // 		);
// // 	});
// // };
// // }, []);
