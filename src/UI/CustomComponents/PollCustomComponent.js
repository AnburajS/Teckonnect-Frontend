import React from 'react';

const PollCustomComponent = (props) => {

	const { data, typee } = props;

	return (
		<React.Fragment>
			{typee && typee === "score" &&
				<div className='c-2c2c2c'>{data.score} %</div>
			}
			{typee && typee === "response" &&
				<div className='c-2c2c2c'>{data.response}/{data.totalResponse}</div>
			}
		</React.Fragment>
	)
}

export default PollCustomComponent;