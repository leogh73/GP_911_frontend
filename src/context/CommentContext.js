import { createContext } from 'react';

const CommentContext = createContext({
	comment: null,
	loadComment: () => {},
});

export default CommentContext;
