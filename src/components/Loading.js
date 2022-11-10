import { css } from '@emotion/react';
import FadeLoader from 'react-spinners/FadeLoader';

const Loading = () => {
	const override = css`
		margin: 0;
		display: center;
	`;

	const spinnerColor =
		localStorage.getItem('mode') === 'light-mode' ? '#3d7ccf' : 'rgb(226, 226, 226)';

	return <FadeLoader color={spinnerColor} css={override} />;
};

export default Loading;
