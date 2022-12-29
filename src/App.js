import { useReducer, useState, useRef, useCallback } from 'react';
import TodoTemplate from './components/TodoTemplate';
import TodoInsert from './components/TodoInsert';
import TodoList from './components/TodoList';

function createBulkTodos() {
  const array = [];
  for (let i = 1; i <= 2500; i++) {
    array.push({
      id: i,
      text: `할 일 ${i}`,
      checked: false,
    });
  }
  return array;
}

function todoReducer(todos, action) {
  switch (action.type) {
    case 'INSERT':
      // {type: 'INSERT', todo: {id:1, text: 'todo', checked: false}}
      return todos.concat(action.todo);
    case 'REMOVE':
      //{type: 'REMOVE', id: 1}
      return todos.filter((todo) => todo.id !== action.id);
    case 'TOGGLE':
      //{type: 'TOGGLE', id: 1}
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, checked: !todo.checked } : todo,
      );
    default:
      return todos;
  }
}

const App = () => {
  const [todos, dispatch] = useReducer(todoReducer, undefined, createBulkTodos);
  //원래는 두번째 파라미터에 초기 상태 넣기, but 지금은 세번째 파라미터에 초기 상태 만드는 함수 넣음 -> 컴포넌트가 맨 처음 렌더링될 때만 함수 호츨
  //const [todos, setTodos] = useState(createBulkTodos);

  const nextId = useRef(2501);

  const onInsert = useCallback(
    (text) => {
      const todo = {
        id: nextId.current,
        text,
        checked: false,
      };
      //setTodos(todos => todos.concat(todo));
      dispatch({ type: 'INSERT', todo });
      nextId.current += 1;
    },
    //[todos],
    [],
  );

  const onRemove = useCallback(
    (id) => {
      //setTodos(todos => todos.filter((todo) => todo.id !== id));
      dispatch({ type: 'REMOVE', id });
    },
    //[todos],
    [],
  );

  const onToggle = useCallback(
    (id) => {
      /*setTodos(
        todos => 
        //map : 불변성 유지하면서 특정 배열 원소 업데이트
        todos.map((todo) =>
          todo.id === id ? { ...todo, checked: !todo.checked } : todo,
        ),*/
      dispatch({ type: 'TOGGLE', id });
    },
    //[todos],
    [],
  );

  return (
    <TodoTemplate>
      <TodoInsert onInsert={onInsert} />
      <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle} />
    </TodoTemplate>
  );
};

export default App;

/* 4개의 컴포넌트
1.TodoTemplate
-> 화면 가운데 정렬, 앱 타이틀(일정 관리)을 보여줌, children으로 내부 JSX를 props로 받아 와서 렌더링
2.TodoInsert
-> 새로운 항목 입력하고 추가, state 통해 인풋의 상태 관리
3.TodoListItem
-> 각 할 일 항목에 대한 정보 보여줌, todo 객체를 props로 받아 와서 상태에 따라 다른 스타일의 UI 보여줌
4.TodoList
-> todos 배열을 props로 받아 온 후, 이를 배열 내장 함수 map을 사용해서 여러 개의 TodoListItem 컴포넌트로 변환하여 보여줌
*/

/*
1.할일1 항목 체크 -> App 컴포넌트의 state 변경 -> App(부모) 컴포넌트 리렌더링 -> TodoList 컴포넌트 리렌더링 -> 그 안의 무수한 컴포넌트 리렌더링
2.todos 배열 바뀔 때마다 onRemove, onToggle 새로 만들어짐
 -> useState의 함수형 업데이트 기능 사용
   => setTodos 사용할 때 새로운 상태를 파라미터로 넣는 대신, 상태 업데이트 어떻게 할지 정의해 주는 업데이크 함수를 넣기
   => setTodos 사용할 때 그 안에 todos => 만 넣어주면 됨.
 -> useReducer 사용
*/
