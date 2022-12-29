import './TodoTemplate.scss';

const TodoTemplate = ({ children }) => {
  return (
    <div className="TodoTemplate">
      <div className="app-title">수연's 일정 관리</div>
      <div className="content">{children}</div>
    </div>
  );
};

export default TodoTemplate;
