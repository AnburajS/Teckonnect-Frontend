const Button = (props) => {
  return (
    <button
      className={props.className}
      disabled={props.disabled ? props.disabled : false}
      onClick={props.onClick}
    >
      {props.name}
    </button>
  );
};
export default Button;
