import React, { FC, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import MultiRegExp2 from './regex';
import { Position } from './types';

const DateInput: FC = () => {
	const dateRef: any = useRef(null);
	let date = dayjs();
	let dateString = date.format('DD/MMMM/YYYY HH:mm:ss');
	let datePositions = new MultiRegExp2(/(\d+)\/(\w+)\/(\d+) (\d+):(\d+):(\d+)/gi).execForAllGroups(dateString);

	const updatePositions = () => datePositions = new MultiRegExp2(/(\d+)\/(\w+)\/(\d+) (\d+):(\d+):(\d+)/gi).execForAllGroups(dateString);

    enum UnitType {
        day,
        month,
        year,
        hour,
        minute,
        second,
    };

    useEffect(() => {
        dateRef.current.value = dateString;
	}, []);


	const getPosition = (position: number): Position | null => {
		if (!datePositions) {
			throw new Error('date positions is null')
		};
		
        for (let i = 0; i < datePositions.length; i++) {
            let value = datePositions[i];
            if (position >= value.start && position <= value.end) {
                return { 
					...value,
                    index: i, 
                };
            }
        };
        return null;
    }

	const increment = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const position = getPosition(dateRef.current.selectionStart) ?? (() => {throw new Error("Position is null")})();

        if (!e.ctrlKey) {
            switch (position.index) {
                case UnitType.day: 
					date.daysInMonth() === date.date() 
						? date = date.date(1) 
						: date = date.add(1, 'day');
				 	break;
                case UnitType.month: 
					date.month() === 11 
						? date = date.month(0) 
						: date = date.add(1, 'month');
				 	break;
                case UnitType.year: 
					date = date.add(1, 'year'); 
					break;
                case UnitType.hour: 
					date.hour() === 23 
						? date = date.hour(0) 
						: date = date.add(1, 'hour');
					break;
                case UnitType.minute:
					date.minute() === 59 
					 	? date = date.minute(0)
					 	: date = date.add(1, 'minute');
					break;
                case UnitType.second: 
                    date.second() === 59 
                        ? date = date.second(0) 
                        : date = date.add(1, 'second'); 
                    break;
                default: 
					throw new Error('Ошибочка');
            }
        } else {
            switch (position.index) {
                case UnitType.day: 
					date = date.add(1, 'day');
					break;
                case UnitType.month: 
					date = date.add(1, 'month');
					break;
                case UnitType.year: 
					date = date.add(1, 'year');
					break;
                case UnitType.hour: 
					date = date.add(1, 'hour');
					break;
                case UnitType.minute: 
					date = date.add(1, 'minute');
					break;
                case UnitType.second: 
					date = date.add(1, 'second');
					break;
                default: 
					throw new Error('Ошибочка');
            }
        }
        dateString = date.format('DD/MMMM/YYYY HH:mm:ss');
        dateRef.current.value = dateString;
        updatePositions();
        if (!datePositions) {
            throw new Error('Positions is null');
        }
        const newPosition = datePositions[position.index];
        dateRef.current.setSelectionRange(newPosition.start, newPosition.end);
    }

	const decrement = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const position = getPosition(dateRef.current.selectionStart)  ?? (() => {throw new Error("Position is null")})();

        if (!e.ctrlKey) {
            switch (position.index) {
                case 0: 
                    date.date() === 1 
                        ? date = date.date(date.daysInMonth()) 
                        : date = date.subtract(1, 'day'); 
                    break;
                case 1: 
                    date.month() === 0 
                        ? date = date.month(11) 
                        : date = date.subtract(1, 'month'); 
                    break;
                case 2: 
                    date = date.subtract(1, 'year'); 
                    break;
                case 3: 
                    date.hour() === 0 
                        ? date = date.hour(23) 
                        : date = date.subtract(1, 'hour'); 
                    break;
                case 4: 
                    date.minute() === 0 
                        ? date = date.minute(59)
                        : date = date.subtract(1, 'minute');
                    break;
                case 5: 
                    date.second() === 0
                        ? date = date.second(59) 
                        : date = date.subtract(1, 'second'); 
                    break;
                default: 
                    throw new Error('Ошибочка');
            }
        } else {
            switch (position.index) {
                case 0: 
					date = date.subtract(1, 'day');
					break;
                case 1: 
					date = date.subtract(1, 'month');
					break;
                case 2: 
					date = date.subtract(1, 'year');
					break;
                case 3: 
					date = date.subtract(1, 'hour');
					break;
                case 4: 
					date = date.subtract(1, 'minute');
					break;
                case 5: 
					date = date.subtract(1, 'second');
					break;
                default: 
                    throw new Error('Ошибочка');
            }
        }
        dateString = date.format('DD/MMMM/YYYY HH:mm:ss');
        dateRef.current.value = dateString;
        updatePositions();
        if (!datePositions) {
            throw new Error('Positions is null');
        }
        const newPosition = datePositions[position.index];
        dateRef.current.setSelectionRange(newPosition.start, newPosition.end);
    }

	const enter = () => {
		let customParseFormat = require('dayjs/plugin/customParseFormat');
		dayjs.extend(customParseFormat);
		date = dayjs(dateRef.current.value, 'DD MM YYYY');
		dateString = date.format('DD/MMMM/YYYY HH:mm:ss');
		updatePositions();
		dateRef.current.value = dateString;
	}

	return (
		<div>
			<input
        	    style={{ width: '300px' }}
        	    type="text"
        	    ref={dateRef}
        	    onKeyDown={e => {
        	        e.code === 'ArrowUp' && increment(e);
        	        e.code === 'ArrowDown' && decrement(e);
					e.code === 'Enter' && enter();
        	    }}
        	/>
		</div>
		
	);
}

export default DateInput;
