import React, { FC } from 'react';
import DateInput from './DateInput/DateInput';

const App: FC = () => {
	return (
		<div
			className="App"
			style={{ width: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
		>
			<DateInput />
		</div>
	);
}

export default App;