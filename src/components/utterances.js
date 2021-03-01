import React, { useEffect } from 'react';

const commentNodeId = 'comments';

const Utterances = () => {
	// this query is for retrieving the repo name from gatsby-config
	useEffect(() => {
		// docs - https://utteranc.es/
		const script = document.createElement('script');

		script.src = 'https://utteranc.es/client.js';
		script.async = true;
		script.setAttribute('repo', 'woobottle/blog-comments');
		script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'github-light');
		script.setAttribute('crossorigin', 'anonymous');

		const scriptParentNode = document.getElementById(commentNodeId);

		scriptParentNode.appendChild(script);

		return () => {
			// cleanup - remove the older script with previous theme
			scriptParentNode.removeChild(scriptParentNode.firstChild);
		};
	});

	return <div id={commentNodeId} />;
};

export default Utterances;