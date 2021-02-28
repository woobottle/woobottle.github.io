// import React, { useEffect } from 'react';

// // class는 es6
// class Utterances extends React.Component {
//   constructor(props) {
//     super(props)

//     this.commentsEl = React.createRef()
//     this.state = { status: "pending" }
//   }

//   componentDidMount(){
//     const scriptEl = document.createElement('script')

//     scriptEl.onload = () => this.setState({status: "success"})
//     scriptEl.onerror = () => this.setState({status: "fail"})
//     scriptEl.async = true
//     scriptEl.src = 'https://utteranc.es/client.js'
//     scriptEl.setAttribute('repo', 'woobottle/blog-comments')
//     scriptEl.setAttribute('issue-term', 'pathname')
//     scriptEl.setAttribute('theme', 'github-light')
//     scriptEl.setAttribute('crossorigin', 'anonymous')
//     this.commentsEl.current.appendChild(scriptEl)
//   }

//   render() {
//     const {status} = this.state

//     return (
//       <div className="comments-wrapper">
//         {status === 'failed' && <div>Error. Please try again.</div>}
//         {status === 'pending' && <div>Loading Script...</div>}
//         <div ref={this.commentsEl}></div>
//       </div>
//     )
//   } 
// }

// export default Utterances

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