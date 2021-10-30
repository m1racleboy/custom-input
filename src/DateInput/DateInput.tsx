import React, { FC, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import MultiRegExp2 from './regex';
import { Position } from './types';
import { mainDateFormat, DateTypes, KeyCodes, dateFormats } from '../const';

const DateInput: FC = () => {
	const dateRef: any = useRef(null);
	let date = dayjs();
	let dateString = date.format(mainDateFormat);
	let datePositions = new MultiRegExp2(/(\d+)\/(\w+)\/(\d+) (\d+):(\d+):(\d+)/gi).execForAllGroups(dateString);

	const updatePositions = () => datePositions = new MultiRegExp2(/(\d+)\/(\w+)\/(\d+) (\d+):(\d+):(\d+)/gi).execForAllGroups(dateString);

  const changeCurrentDateValue = (position: Position) => {
    dateString = date.format(mainDateFormat);
		dateRef.current.value = dateString;
		updatePositions();

		if (!datePositions) {
			throw new Error('Positions is null');
		}

		const newPosition = datePositions[position.index];
		dateRef.current.setSelectionRange(newPosition.start, newPosition.end);
  }

	useEffect(() => {
		dateRef.current.value = dateString;
	}, []);

	const getPosition = (position: number): Position | null => {
		if (!datePositions) {
			throw new Error('date positions is null');
		}

		for (let i = 0; i < datePositions.length; i++) {
			let value = datePositions[i];
			if (position >= value.start && position <= value.end) {
				return {
					...value,
					index: i,
				};
			}
		}
		return null;
	};

	const incrementDateHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const position = getPosition(dateRef.current.selectionStart) ?? (() => { throw new Error("Position is null") })();

		if (!e.ctrlKey) {
			switch (position.index) {
				case DateTypes.DAY:
					date.daysInMonth() === date.date()
            ? date = date.date(1)
            : date = date.add(1, 'day');
					break;
				case DateTypes.MONTH:
					date.month() === 11
            ? date = date.month(0)
            : date = date.add(1, 'month');
					break;
				case DateTypes.YEAR:
					date = date.add(1, 'year');
					break;
				case DateTypes.HOUR:
					date.hour() === 23
            ? date = date.hour(0)
            : date = date.add(1, 'hour');
					break;
				case DateTypes.MINUTE:
					date.minute() === 59
            ? date = date.minute(0)
            : date = date.add(1, 'minute');
					break;
				case DateTypes.SECOND:
					date.second() === 59
            ? date = date.second(0)
            : date = date.add(1, 'second');
					break;
				default:
					throw new Error('Ошибочка');
			}
		} else {
			switch (position.index) {
				case DateTypes.DAY: date = date.add(1, 'day'); break;
				case DateTypes.MONTH: date = date.add(1, 'month'); break;
				case DateTypes.YEAR: date = date.add(1, 'year'); break;
				case DateTypes.HOUR: date = date.add(1, 'hour'); break;
				case DateTypes.MINUTE: date = date.add(1, 'minute'); break;
				case DateTypes.SECOND: date = date.add(1, 'second'); break;
				default: throw new Error('Ошибочка');
			}
		}

    changeCurrentDateValue(position);
	};

	const decrementDateHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const position = getPosition(dateRef.current.selectionStart)  ?? (() => { throw new Error("Position is null") })();

		if (!e.ctrlKey) {
			switch (position.index) {
				case DateTypes.DAY:
					date.date() === 1
            ? date = date.date(date.daysInMonth())
            : date = date.subtract(1, 'day');
					break;
				case DateTypes.MONTH:
					date.month() === 0
            ? date = date.month(11)
            : date = date.subtract(1, 'month');
					break;
				case DateTypes.YEAR:
					date = date.subtract(1, 'year');
					break;
				case DateTypes.HOUR:
					date.hour() === 0
            ? date = date.hour(23)
            : date = date.subtract(1, 'hour');
					break;
				case DateTypes.MINUTE:
					date.minute() === 0
            ? date = date.minute(59)
            : date = date.subtract(1, 'minute');
					break;
				case DateTypes.SECOND:
					date.second() === 0
            ? date = date.second(59)
            : date = date.subtract(1, 'second');
					break;
				default:
					throw new Error('Ошибочка');
			}
		} else {
			switch (position.index) {
				case DateTypes.DAY: date = date.subtract(1, 'day'); break;
				case DateTypes.MONTH: date = date.subtract(1, 'month'); break;
				case DateTypes.YEAR: date = date.subtract(1, 'year'); break;
				case DateTypes.HOUR: date = date.subtract(1, 'hour'); break;
				case DateTypes.MINUTE: date = date.subtract(1, 'minute'); break;
				case DateTypes.SECOND: date = date.subtract(1, 'second'); break;
				default: throw new Error('Ошибочка');
			}
		}

		changeCurrentDateValue(position);
	};

	const enterDateHandler = () => {
		let customParseFormat = require('dayjs/plugin/customParseFormat');
		dayjs.extend(customParseFormat);
		date = dayjs(dateRef.current.value, dateFormats, true);
		dateString = date.format(mainDateFormat);
    if (dateString === 'Invalid Date') {
      date = dayjs();
      dateString = date.format(mainDateFormat);
    }
		dateRef.current.value = dateString;
	};

	return (
			<input
				style={{ width: '300px' }}
				type="text"
				ref={dateRef}
				onKeyDown={(e) => {
					e.code === KeyCodes.ARROW_UP && incrementDateHandler(e);
					e.code === KeyCodes.ARROW_DOWN && decrementDateHandler(e);
					e.code === KeyCodes.ENTER && enterDateHandler();
				}}
			/>
	);
};

export default DateInput;
