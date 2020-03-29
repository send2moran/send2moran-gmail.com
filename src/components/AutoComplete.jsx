/* eslint-disable complexity */
import React, { useState, useRef } from 'react';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';
import '../styles/autoComplete.css';

const autocompleteMachine = Machine({
    id: 'autocomplete',
    type: 'parallel',
    context: {
        hits: [],
        highlightedIndex: null,
        selected: {}
    },
    states: {
        searchBox: {
            initial: 'idle',
            states: {
                idle: {
                    entry: ['reset'],
                    on: { INPUT: 'debounce' }
                },
                debounce: {
                    states: {
                        debouncing: {
                            invoke: {
                                id: 'debounce',
                                src: 'debounce',
                                onDone: { target: '#autocomplete.searchBox.searching', actions: ['search'] }
                            }
                        },
                        debouncerestart: {
                            on: {
                                '': 'debouncing'
                            }
                        },
                        settled: {
                            on: {}
                        }
                    },
                    initial: 'debouncing',
                    on: {
                        INPUT: '.debouncerestart'
                    }
                },
                searching: {
                    on: {
                        FETCHED: 'success',
                        RESET_SEARCH: 'idle'
                    }
                },
                success: {
                    entry: ['setHits', 'openOrCloseDropdown'],
                    on: { INPUT: 'debounce', RESET_SEARCH: 'idle' }
                }
            }
        },
        dropdown: {
            initial: 'closed',
            states: {
                closed: {
                    on: { OPEN: 'opened' }
                },
                opened: {
                    on: { CLOSE: 'closed', SELECT: 'selected' }
                },
                selected: {
                    entry: ['setSelected'],
                    on: { CLOSE: 'closed' }
                }
            }
        },
        highlight: {
            initial: 'none',
            states: {
                none: {
                    entry: ['resetHighlightedIndex'],
                    on: {
                        HIGHLIGHT_NEXT: { target: 'highlighted', cond: 'hasHits' },
                        HIGHLIGHT_PREV: { target: 'highlighted', cond: 'hasHits' }
                    }
                },
                highlighted: {
                    entry: ['updateHighlightedIndex'],
                    on: {
                        HIGHLIGHT_NEXT: 'highlighted',
                        HIGHLIGHT_PREV: 'highlighted',
                        RESET_HIGHLIGHT: 'none'
                    }
                }
            }
        }
    }
});

const KEY_ESC = 27;
const KEY_ARROW_UP = 38;
const KEY_ARROW_DOWN = 40;
const KEY_ENTER = 13;

export default props => {
    const ref = useRef();
    const [inputValue, setInputValue] = useState('');

    const [state, send] = useMachine(autocompleteMachine, {
        actions: {
            reset: assign({
                hits: []
            }),
            search: (_, { data }) => {
                props.onSearch.call(null, data).then(p => {
                    send({ type: 'FETCHED', data: { hits: p } });
                });
            },
            setHits: assign({
                hits: (_, { data }) => data.hits
            }),
            setSelected: assign({
                selected: ({ hits, highlightedIndex }, { data }) => {
                    const hit = data ? data.hit : hits[highlightedIndex];
                    setInputValue(hit.title);
                    props.onSelected.call(null, hit);
                    return hit;
                }
            }),
            openOrCloseDropdown: ({ hits = [] }) => {
                if (hits.length > 0) {
                    send('OPEN');
                } else {
                    send('CLOSE');
                }
            },
            resetHighlightedIndex: assign({
                highlightedIndex: null
            }),
            updateHighlightedIndex: assign({
                highlightedIndex: ({ hits, highlightedIndex }, { type }) => {
                    if (highlightedIndex === null) {
                        return 0;
                    } else if (type === 'HIGHLIGHT_NEXT') {
                        return highlightedIndex + 1 < hits.length ? highlightedIndex + 1 : 0;
                    } else if (type === 'HIGHLIGHT_PREV') {
                        return highlightedIndex - 1 >= 0 ? highlightedIndex - 1 : hits.length - 1;
                    } else {
                        return null;
                    }
                }
            })
        },
        guards: {
            hasHits: ({ hits = [] }) => {
                return hits.length > 0;
            }
        },
        services: {
            debounce: (_, { data: { query } }) =>
                new Promise(resolve => {
                    setTimeout(() => resolve(query), props.debounce || 1000);
                })
        }
    });

    const onInput = event => {
        const query = event.currentTarget.value;
        if (query === '') {
            setInputValue('');
            send('RESET_SEARCH');
            send('RESET_HIGHLIGHT');
            send('CLOSE');
        } else {
            setInputValue(query);
            send({ type: 'INPUT', data: { query } });
        }
    };

    const onFocus = () => {
        if ((state.context.hits || []).length > 0) {
            send('OPEN');
        }
    };

    const onBlur = event => {
        event.preventDefault();
        if (!ref.current.contains(event.relatedTarget)) {
            send('CLOSE');
        }
    };

    const onKeyDown = event => {
        if (event.keyCode === KEY_ENTER) {
            event.preventDefault();
            send('SELECT');
            send('CLOSE');
        } else if (event.keyCode === KEY_ARROW_DOWN) {
            if (state.value.dropdown === 'closed' && state.context.hits.length > 0) {
                send('OPEN');
            }
            send('HIGHLIGHT_NEXT');
        } else if (event.keyCode === KEY_ARROW_UP) {
            if (state.value.dropdown === 'closed' && state.context.hits.length > 0) {
                send('OPEN');
            }
            send('HIGHLIGHT_PREV');
        } else if (event.keyCode === KEY_ESC) {
            send('CLOSE');
        }
    };

    const onClick = (event, hit) => {
        event.preventDefault();
        setInputValue(hit.title);
        send({ type: 'SELECT', data: { hit } });
        send('CLOSE');
    };

    const onChange = () => {};

    return (
        <>
            <div className="react-autosuggest" ref={ref}>
                <input
                    value={inputValue}
                    onChange={onChange}
                    className="appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    type="search"
                    onInput={onInput}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                />
                {state.value.dropdown === 'opened' && (
                    <ul className="dropdown appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        {(state.context.hits || []).map((hit, index) => {
                            return (
                                <li
                                    key={index}
                                    className={`my-3 py-2 hover:bg-blue-100 ${
                                        index === state.context.highlightedIndex ? 'bg-blue-100' : ''
                                    }`}
                                >
                                    <button onClick={e => onClick(e, hit)} role="button" tabIndex={index}>
                                        <p>{hit.title}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </>
    );
};
