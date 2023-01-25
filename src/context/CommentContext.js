import { createContext } from 'react';

const CommentContext = createContext({
	comment: '',
	loadComment: () => {},
});

export default CommentContext;
