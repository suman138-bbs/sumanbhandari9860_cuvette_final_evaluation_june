import style from "./style.module.css";
const TextInput = ({ placeholder, error, ...otherProps }) => {
  return (
    <div className={style.textInputContainer}>
      <input type="text" placeholder={placeholder} {...otherProps} />
      {error && <span>{error}</span>}
    </div>
  );
};

export default TextInput;
