import { css } from '@emotion/react';
import FadeLoader from 'react-spinners/FadeLoader';

const Loading = () => {
	const override = css`
		margin: 0;
		display: center;
	`;

	return (
		<div className="sweet-loading">
			<FadeLoader color="#1a73e8" loading={true} css={override} size={70} />
		</div>
	);
};

export default Loading;
